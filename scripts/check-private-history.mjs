#!/usr/bin/env node
// No commit of a pull request adds personal data, even one that a later commit removes.
//
//   node scripts/check-private-history.mjs origin/main      # every commit in origin/main..HEAD
//   node scripts/check-private-history.mjs --control        # proves the check can fail
//
// `check-private.mjs` looks at what git tracks at the tip. That misses the case that has
// already happened here twice: a commit adds a file with a user name or a machine's path
// in it, the next commit deletes the file, and the tip is clean while the public history
// keeps the data for good. A merge cannot take a commit back, so the only place to stop it
// is before the merge, and this reads the lines each commit ADDS.
//
// It never prints the line it found. CI logs of a public repository are public, so quoting
// the offending text would publish the thing the check exists to keep out. It names the
// commit, the file and the kind of finding, which is enough to go and look.
//
// This file and `personal-patterns.mjs` are copied from the personaxis CLI repository's `scripts/`,
// where the same check runs. Change them there first and copy them here.
//
// What it does not read: author names and e-mails in the commit headers (git records
// those on purpose) and people's names in prose.

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ARTIFACT, TEXT, personalIn } from "./personal-patterns.mjs";

/** Files whose text is not ours to word, or that hold the patterns themselves. */
const SKIP = new Set(["scripts/personal-patterns.mjs", "scripts/check-private-history.mjs"]);

function git(args, cwd) {
	return execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 1024 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
}

/**
 * A binary file has no added lines to read, but it can still carry a path: compiled Python bytecode
 * embeds the path of the machine that built it, and that is how a user name reached this history once.
 * So the printable runs of the blob are read as lines. Files over 16 MB are left alone.
 */
function binaryFinding(commit, file, cwd) {
	let buf;
	try {
		buf = execFileSync("git", ["show", `${commit}:${file}`], { cwd, maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
	} catch {
		return null;
	}
	if (buf.length > 16 * 1024 * 1024) return null;
	for (const run of buf.toString("latin1").match(/[\x20-\x7e]{6,}/g) ?? []) {
		const what = personalIn(run);
		if (what) return what;
	}
	return null;
}

/** The findings in the commits of `base..HEAD`, run inside `cwd`. */
function scanRange(base, cwd = process.cwd()) {
	const log = git(["log", "--no-color", "--no-ext-diff", "--no-renames", "--no-merges", "-p", "--unified=0", "--format=%x00%H", `${base}..HEAD`], cwd);
	const findings = [];
	for (const chunk of log.split("\0")) {
		if (!chunk.trim()) continue;
		const lines = chunk.split("\n");
		const commit = lines[0].trim();
		let file = "";
		for (const line of lines.slice(1)) {
			if (line.startsWith("diff --git ")) {
				const m = / b\/(.+)$/.exec(line);
				file = m ? m[1] : "";
				if (file && ARTIFACT.test(file) && !SKIP.has(file)) findings.push({ commit, file, what: "a compiled artifact, which embeds the building machine's path" });
				continue;
			}
			const bin = /^Binary files .* and b\/(.+) differ$/.exec(line);
			if (bin) {
				const what = SKIP.has(bin[1]) ? null : binaryFinding(commit, bin[1], cwd);
				if (what) findings.push({ commit, file: bin[1], what });
				continue;
			}
			if (!file || SKIP.has(file) || !TEXT.test(file)) continue;
			if (!line.startsWith("+") || line.startsWith("+++")) continue;
			const what = personalIn(line.slice(1));
			if (what) findings.push({ commit, file, what });
		}
	}
	return findings;
}

function report(findings) {
	const seen = new Set();
	for (const f of findings) {
		const key = `${f.commit}|${f.file}|${f.what}`;
		if (seen.has(key)) continue;
		seen.add(key);
		console.error(`  ${f.commit.slice(0, 7)}  ${f.file}  (${f.what})`);
	}
	return seen.size;
}

/**
 * A planted case in a throwaway repository: a commit adds a file with a user name inside a
 * home path, the next commit deletes it. The tip is clean, so a check of the tip passes and
 * this one must not. A second range with nothing planted must pass.
 */
function control() {
	const dir = mkdtempSync(join(tmpdir(), "check-private-history-"));
	const run = (args) => git(["-c", "user.name=control", "-c", "user.email=control@example.com", "-c", "commit.gpgsign=false", ...args], dir);
	try {
		run(["init", "-q"]);
		writeFileSync(join(dir, "readme.md"), "start\n");
		run(["add", "."]);
		run(["commit", "-q", "-m", "base"]);
		const base = run(["rev-parse", "HEAD"]).trim();

		// Built from parts so this file does not carry a home path of its own.
		const planted = ["C:", "Users", "jsmith", "Documents"].join("\\");
		writeFileSync(join(dir, "state.json"), JSON.stringify({ project: planted }) + "\n");
		run(["add", "."]);
		run(["commit", "-q", "-m", "adds a file with a home path"]);
		unlinkSync(join(dir, "state.json"));
		run(["add", "-A"]);
		run(["commit", "-q", "-m", "removes it again"]);

		// The same path inside a binary file (a NUL byte makes git treat it as one), added and removed.
		writeFileSync(join(dir, "blob.bin"), Buffer.concat([Buffer.from([0, 1, 2, 255]), Buffer.from(planted), Buffer.from([0, 200])]));
		run(["add", "."]);
		run(["commit", "-q", "-m", "adds a binary with a home path"]);
		unlinkSync(join(dir, "blob.bin"));
		run(["add", "-A"]);
		run(["commit", "-q", "-m", "removes the binary"]);

		const caught = scanRange(base, dir);
		let failed = false;
		if (!caught.some((f) => f.file === "state.json")) {
			console.error("control FAILED: the check did not catch a home path that a later commit removed.");
			failed = true;
		}
		if (!caught.some((f) => f.file === "blob.bin")) {
			console.error("control FAILED: the check did not catch a home path inside a binary file.");
			failed = true;
		}
		const tipFiles = run(["ls-files"]).split("\n").filter(Boolean);
		if (tipFiles.includes("state.json")) {
			console.error("control FAILED: the planted file is still at the tip, so the control proves nothing.");
			failed = true;
		}

		run(["checkout", "-q", "-b", "clean", base]);
		writeFileSync(join(dir, "notes.md"), "nothing personal here\n");
		run(["add", "."]);
		run(["commit", "-q", "-m", "clean change"]);
		if (scanRange(base, dir).length !== 0) {
			console.error("control FAILED: the check reported something in a range with nothing planted.");
			failed = true;
		}
		if (failed) process.exit(1);
		console.log("control: a home path added and removed inside a range is caught, in text and in a binary, and a clean range passes.");
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}

function main() {
	const args = process.argv.slice(2);
	if (args.includes("--control")) return control();
	const base = args.find((a) => !a.startsWith("--"));
	if (!base) {
		console.error("usage: check-private-history.mjs <base-ref>   (for example origin/main)");
		process.exit(2);
	}
	try {
		git(["rev-parse", "--verify", "--quiet", `${base}^{commit}`]);
	} catch {
		console.error(`private history: cannot resolve ${base}. In CI the checkout needs fetch-depth: 0.`);
		process.exit(2);
	}
	const count = git(["rev-list", "--no-merges", "--count", `${base}..HEAD`]).trim();
	const findings = scanRange(base);
	if (findings.length === 0) {
		console.log(`private history: ${count} commits in ${base}..HEAD, none adds personal data.`);
		return;
	}
	console.error(`private history: personal data added by commits of ${base}..HEAD (the lines are not printed on purpose).\n`);
	const n = report(findings);
	console.error(`\n${n} finding${n === 1 ? "" : "s"}. A later commit that removes the data does not take it out of the history: rewrite the branch before merging.`);
	process.exit(1);
}

main();
