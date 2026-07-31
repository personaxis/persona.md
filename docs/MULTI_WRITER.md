# Multiple writers: what the spec requires when a persona lives in more than one place

Companion to [SPEC.md](./SPEC.md) §8.2 (episodic memory) and §8.3 (the state contract).
This document states the **requirements any implementation must meet** when the same
persona is written from more than one process, machine or runtime. It does not prescribe a
transport or a storage engine.

A persona used from a desktop and a laptop, or served by two runtime instances, is the
normal case, not an edge case. The guarantees the spec makes (§15) have to survive it.

---

## 1. The problem, stated precisely

Two spec artifacts are append-only and hash-chained:

- `memory/episodic*.jsonl`, the episodic chain (§8.2)
- `state.json`'s `mutation_log`, the audit trail (§8.3)

A hash chain admits **exactly one appender**. Given entries `e₁ … eₙ` where each commits to
its predecessor, two writers appending concurrently produce entries whose `prev_hash` does
not match the chain they land in. A verifier is then correct to report tampering, and has
no way to distinguish that from real tampering. The information needed to tell them apart
was never recorded.

The same argument applies to `state.json` as a document: a single mutable file has a single
writer, and a second writer's copy silently replaces the first.

## 2. Requirements

### R1. One chain per writer

> An implementation supporting concurrent writers MUST maintain one append-only chain per
> writer, each starting from the empty predecessor, and MUST NOT link an entry to a chain
> written by a different writer.

A writer is whatever unit can append independently: a device, a runtime instance, a tenant.
The identifier MUST be stable across restarts, so that the same writer resumes its own
chain rather than starting a new one.

### R2. Verification is per chain, and localising

> Verification MUST run per chain and, on failure, MUST identify **which** chain and **at
> which entry**.

"The chain is broken" is not a useful result when several exist: it condemns every writer
at once and points at nothing. Naming the chain and the position is what makes a break
actionable.

### R3. Reading is the union

> Retrieval MUST present the union of every chain as one history. Ordering for retrieval
> MAY be by timestamp; ordering for STATE RECONSTRUCTION MUST be total and agreed (R4).

Recall answers "what does this persona know"; there is one persona, so there is one
history. Integrity answers "was anything altered"; that question is per writer.

### R4. State reconstruction uses a total order, and applies the envelope at every step

> State MUST be reconstructible as a fold of the mutation entries under a total order that
> every implementation computes identically, and the envelope clamp (§15, T1) MUST be
> applied at **each** step of that fold.

The clamp is not distributive: `clamp(a + b) ≠ clamp(a) + clamp(b)` in general. Summing
deltas and clamping the result once would admit final states unreachable by any sequence of
individually-clamped steps, breaking T1 for merged history while preserving it locally.
Hence "at each step", and hence the order must be agreed rather than incidental.

A total order over `(logical time, writer id)` satisfies this. Wall-clock time alone does
not: clocks drift, are corrected, and are wrong on unmaintained machines, so two entries
can carry timestamps in the opposite order to the one in which they were caused. A **hybrid
logical clock** (physical time plus a counter that never regresses relative to what the
writer has observed) is the recommended construction.

### R5. A failed chain does not contribute

> Entries belonging to a chain that fails verification MUST NOT participate in state
> reconstruction.

Tamper-evidence exists so that altered history can be discounted. Folding entries that are
known to be altered, even with a warning, defeats its purpose.

### R6. Derived state is reconstructible

> `state.json` MAY be treated as a cache. An implementation MUST be able to recompute it
> from the logs alone, and MUST NOT hold state that no entry explains.

This is the existing §8.3 contract ("state as a replayable checkpoint of `mutation_log`"),
restated for the multi-writer case: with several logs, "replayable" means replayable from
all of them.

### R7. The spec document is not a log

> `personaxis.md` is edited by people and MUST NOT be merged automatically.

Identity, character and governance are documents, not event streams. Concurrent edits are
resolved the way documents are resolved (a diff a person approves). Silently merging two
edits to who a persona is would be a change of identity nobody authorised, which §7
forbids.

## 3. What the spec does NOT require

- **No transport.** Whether logs travel by git, a file-sync service, an object store or an
  API is out of scope. R1 makes file-level conflict impossible, which is what lets a
  general-purpose transport suffice.
- **No CRDT machinery.** The operations here are deltas under a clamp with a total order;
  a fold is enough. An implementation MAY use CRDTs, and gains nothing required by this
  document.
- **No single naming scheme.** `memory/episodic.<writerId>.jsonl` is what the reference
  implementation uses; any layout satisfying R1–R3 conforms.
- **No locking.** R1–R6 exist precisely so that concurrent writers need no mutual exclusion:
  each owns its chain, and the fold is deterministic. An implementation MAY offer a lock or
  lease so that an operator can serialise writers deliberately, and MUST NOT require one for
  conformance, nor treat a persona as unreadable because a lock is held elsewhere.

## 4. Single-writer implementations

Nothing above is required of an implementation that only ever writes from one place. A
single `memory/episodic.jsonl` and a directly-maintained `state.json` remain conforming,
and remain readable by multi-writer implementations, which treat such a file as the chain
of one writer.

## 5. Conformance

These requirements refine **C1 Governed State** and **C2 Living Runtime** (§13.2) for the
concurrent case. An implementation that supports concurrent writers and fails R1, R4 or R5
does not meet C1, because the state it produces is not the state its own audit trail
explains.

The reference implementation's design notes, including the concrete fold and clock, are in
the CLI repository under `docs/architecture/multi-device.md`.
