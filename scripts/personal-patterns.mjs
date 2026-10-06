// What counts as personal data in a public file. Copied from the personaxis CLI repository's
// `scripts/`; change it there first. Used by `check-private-history.mjs`, which reads what every
// commit of a pull request adds, including what a later commit takes out again.

/**
 * What is personal, as opposed to private (E104).
 *
 * The rules above catch pointers into private work and say nothing about WHO appears in
 * what is tracked. Twice a machine's own user name reached this public repository inside a
 * path: once in a test's example root, once inside Python bytecode a test wrote beside a
 * plugin. These are the shapes that can be checked without crying wolf: a home path with a
 * name in it, an e-mail that is not an example or the product's own, a key that looks real,
 * and a compiled artifact, which embeds the path of the machine that built it.
 *
 * What is NOT attempted: people's names in prose. That cannot be told from ordinary words
 * without false positives, and a gate that cries wolf is a gate somebody deletes.
 */
export const GENERIC_USERS = new Set(["user", "username", "me", "you", "name", "someone", "runner", "runneradmin", "admin", "administrator", "default", "public", "test", "tester", "ci", "example", "alice", "bob", "ana", "mara", "jane", "john", "dev", "developer", "home", "shared", "all", "guest"]);
export const HOME = [
	/[A-Za-z]:(?:\\\\|\\|\/)+Users(?:\\\\|\\|\/)+([A-Za-z0-9._-]+)/,
	/(?:^|[\s"'`(=:])\/home\/([a-z0-9._-]+)/,
	/(?:^|[\s"'`(=:])\/Users\/([A-Za-z0-9._-]+)/,
];
export const EMAIL = /\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g;
export const EMAIL_OK = /(?:^|\.)(?:example\.(?:com|org|net)|test|localhost|invalid|personaxis\.com|users\.noreply\.github\.com|anthropic\.com)$/i;
export const KEY = /\b(?:sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|hf_[A-Za-z0-9]{30,}|nvapi-[A-Za-z0-9_-]{30,}|tvly-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16})\b/g;
/** A key a test writes on purpose says so: a run of the alphabet, EXAMPLE, or a word for fake. */
export const KEY_IS_FAKE = /abcdefghij|EXAMPLE|test|fake|not-a-real|dummy|placeholder|xxxx/i;
/** Compiled output is never source here, and it carries the absolute path of the machine that built it. */
export const ARTIFACT = /(?:^|\/)__pycache__\/|\.pyc$/;

export function personalIn(line) {
	for (const re of HOME) {
		const hit = re.exec(line);
		if (hit && !GENERIC_USERS.has(hit[1].toLowerCase()) && !/^<.*>$|^\$|^%|^\.+$/.test(hit[1])) return "a user name inside a home path";
	}
	// `git@host:` is an SSH remote, not somebody's address.
	for (const hit of line.matchAll(EMAIL)) if (!EMAIL_OK.test(hit[1]) && !/^git@/.test(hit[0])) return "a personal e-mail address";
	for (const hit of line.matchAll(KEY)) if (!KEY_IS_FAKE.test(hit[0])) return "something shaped like a real key";
	return null;
}

/** Only text. A binary file matching one of these is a coincidence, not a pointer. */
export const TEXT = /\.(?:md|mdx|ts|tsx|js|mjs|cjs|json|jsonc|yaml|yml|toml|txt|sh|html|css|py)$/;
