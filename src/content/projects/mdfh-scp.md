---
title: "Multidimensional Fitness Function-Based Heuristic for the Set Covering Problem"
description: "A dependency-free Python implementation of a multidimensional fitness heuristic for the Set Covering Problem, published on PyPI and tested on three Python versions."
category: "Operations Research and Optimization"
technologies:
  - Python
  - Heuristic algorithms
  - Optimization
  - Packaging
  - GitHub Actions
github: "https://github.com/gsadra/mdfh-scp"
featured: true
status: "Completed"
date: 2026-01-01
---

## Overview

`mdfh-scp` is a small, dependency-free Python package that implements a
Multidimensional Fitness Heuristic (MDFH) for the Set Covering Problem. It is
published on PyPI — version 1.0.1, with 1.0.0 released in June 2026 — installs
with a single command, and has no runtime dependencies at all.

```bash
pip install mdfh-scp
```

The solver takes a set of candidate variables, three caller-supplied fitness
components, and a coverage map, then returns a feasible selection with its
objective value and solve time. The implementation is inspired by Hashemi et al.
(2025), *A multidimensional fitness function based heuristic algorithm for set
covering problems* (Applied Soft Computing 174:113038,
[doi:10.1016/j.asoc.2025.113038](https://doi.org/10.1016/j.asoc.2025.113038)). It
is an independent implementation, not the authors' code, and the package says so
explicitly.

## Problem and motivation

Given a universe of elements <em>U</em>, a family of subsets
<em>S</em><sub>1</sub>, …, <em>S</em><sub>n</sub> of <em>U</em>, and a cost
<em>c</em><sub>j</sub> &gt; 0 for each subset, the Set Covering Problem asks for a
minimum-cost subcollection whose union is <em>U</em>:

<div class="math">
  <p><span class="math__label">minimise</span> Σ<sub>j</sub> <em>c</em><sub>j</sub> <em>x</em><sub>j</sub></p>
  <p><span class="math__label">subject to</span> Σ<sub>j ∋ i</sub> <em>x</em><sub>j</sub> ≥ 1 &nbsp; for every <em>i</em> ∈ <em>U</em></p>
  <p><span class="math__label"></span> <em>x</em><sub>j</sub> ∈ {0, 1}, &nbsp; <em>j</em> = 1, …, <em>n</em></p>
</div>

SCP is NP-hard and appears wherever a set of requirements must be met by
selecting from candidate options: facility location, crew scheduling, network
design, and test selection. Large instances are beyond exact solvers in
practical time, so heuristics are the working tool.

A conventional greedy heuristic ranks candidates by a single ratio — cost per
newly covered element. That is fast and often effective, but myopic: it ignores
other dimensions of the problem that shape which choices lead to a good complete
solution. MDFH replaces the single ratio with a multidimensional fitness score.

## Method

The solver is configured explicitly, with one component per fitness dimension:

| Parameter                 | Role                                              |
| ------------------------- | ------------------------------------------------- |
| `variables`               | Identifiers for the candidate sets                |
| `fitness_cost_component`  | Cost-related contribution of each candidate       |
| `fitness_time_component`  | Time-related contribution                         |
| `fitness_route_component` | Route-related contribution                        |
| `coverage_weight`         | Which variables each candidate covers             |
| `include_self`            | Whether a variable covers itself                  |

At each iteration the solver scores every remaining candidate over the elements
it would *newly* cover:

```
score(v) = Σ_{i ∈ unassigned(v)} (cost_i + time_i + route_i) − cost_v
```

It selects the highest-scoring candidate, removes the covered elements from the
candidate set, then recomputes the score of each newly covered variable and
eliminates any whose score has fallen to zero or below. Iteration stops when no
candidates remain. If an iteration finds no selectable candidate, the solver
raises `MDFHSolverError` rather than returning a partial answer silently.

Ties are broken deterministically, since candidates are scanned in sorted order —
the same input produces the same selection on every run.

`solve()` returns an `MDFHResult` carrying the selected variables, the covered and
uncovered variables, a feasibility flag, the objective value, and the solve
duration measured with a monotonic clock. The objective value is the sum of the
cost components of the selected variables, which makes it directly comparable to
other SCP solutions.

## Implementation

- **Packaging.** A `hatchling` build with a `src/` layout, `requires-python >= 3.10`,
  and an empty dependency list — the package is pure standard library. MIT
  licensed, and labelled `Development Status :: 3 - Alpha` on PyPI, which is a
  fair description of a 1.x package with a narrow test suite.
- **Validation.** Input is checked at construction: duplicate variables, empty
  variable lists, missing component entries, and coverage maps that reference
  unknown variables all raise `MDFHValidationError` before solving starts.
- **Testing.** Three tests in `tests/test_solver.py` cover a feasible solution
  end to end, a missing fitness component, and an unknown covered variable.
- **CI.** A GitHub Actions matrix runs the suite on Python 3.10, 3.11, and 3.12,
  then `ruff check` and `mypy src` — the latter in strict mode, configured in
  `pyproject.toml` along with an 88-character line length and the `E`, `F`, `I`,
  `B`, `U` rule sets. A build job produces the sdist and wheel and validates them
  with `twine check`; tagging a release triggers publication through PyPI trusted
  publishing.
- **Examples.** `examples/basic_usage.py` and `examples/article_example.py`
  demonstrate the API, the second reproducing the reference paper's example.

A minimal call looks like this:

```python
from mdfh import MDFHSetCoverSolver

solver = MDFHSetCoverSolver(
    variables=["x1", "x2", "x3"],
    fitness_cost_component={"x1": 10.0, "x2": 8.0, "x3": 6.0},
    fitness_time_component={"x1": 1.0, "x2": 1.0, "x3": 1.0},
    fitness_route_component={"x1": 1.0, "x2": 1.0, "x3": 1.0},
    coverage_weight={"x1": {"x2"}, "x2": {"x1", "x3"}, "x3": {"x3"}},
    include_self=True,
)

result = solver.solve()
print(result.selected_variables, result.objective_value, result.is_feasible)
```

## Results and evaluation

The package reports an objective value and solve duration for whatever instance
it is given. It does not ship a benchmark table, and this page does not claim a
performance improvement over the published method or over a greedy baseline.

That comparison is the natural next step: run standard benchmark instances,
record objective values and runtimes, and set them against both the published
results and a reproducible greedy baseline. Until that exists, the honest claim
is narrower — the package provides an installable, type-checked, tested
implementation of the method with a clear interface.

## Limitations and future work

- **No benchmark suite.** Solution quality relative to published results is not
  reported. This is the largest gap in the current work.
- **Unequal component scales are not compensated.** The three components are
  summed as supplied, with no per-dimension weights, so a component measured in
  large units dominates the score. Callers must normalise; the package does not.
- **Greedy with elimination, not local search.** Candidates whose recomputed score
  drops to zero are discarded permanently. That keeps the loop fast but can
  exclude a set that would have been useful later.
- **Implementation fidelity.** Without an official reference implementation,
  agreement with the paper's algorithm rests on careful reading and on
  reproducing its worked example, not on a published conformance test.
- **Thin test coverage.** Three tests establish that the solver works and that
  validation fires; they do not pin down tie-breaking behaviour or larger
  instances.
- **Instance scope.** Behaviour on structured, application-specific instances may
  differ from the small examples shipped with the package.

Planned work is a benchmark harness over standard instances, a comparison against
a greedy baseline, optional per-dimension weights, and a written comparison with
the published results.
