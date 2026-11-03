---
title: "MDFH-SCP"
description: "A Python implementation of a multidimensional fitness heuristic for the Set Covering Problem."
category: "Operations Research and Optimization"
technologies:
  - Python
  - Heuristic algorithms
  - Optimization
  - Packaging
github: "https://github.com/gsadra/mdfh-scp"
featured: true
status: "Completed"
date: 2026-01-01
---

## Overview

`mdfh-scp` is a lightweight Python package that implements a Multidimensional
Fitness Heuristic (MDFH) for the Set Covering Problem (SCP). It is published on
PyPI and can be installed with `pip install mdfh-scp`.

The implementation is inspired by the heuristic presented in Hashemi et al.
(2025), *A multidimensional fitness function based heuristic algorithm for set
covering problems* (Applied Soft Computing 174:113038,
[doi:10.1016/j.asoc.2025.113038](https://doi.org/10.1016/j.asoc.2025.113038)).
It is an independent implementation, not the authors' official code, and the
package says so explicitly.

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
other dimensions of the problem that shape which choices lead to a good
complete solution. The MDFH approach replaces the single ratio with a
multidimensional fitness score. The reference paper defines the formulation; this
package provides a small, tested implementation of it.

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

`solve()` runs the heuristic and returns an `MDFHResult` containing the selected
variables, the covered and uncovered variables, a feasibility flag, the
objective value, and the solve duration.

The design intent is that candidates are judged on more than cheapness: a
candidate that scores well across the supplied dimensions can outrank a
locally cheaper alternative. Because the components are supplied by the caller,
the same solver can express different instance families without changing its
code.

## Implementation

- **Packaging.** A `pyproject.toml` and `src/` layout support both a normal
  install and an editable development install. The package is on PyPI.
- **Validation.** Malformed input is rejected through `MDFHValidationError`, and
  unrecoverable solver states raise `MDFHSolverError`, so callers can handle
  failures explicitly.
- **Testing.** `tests/test_solver.py` exercises the solver, and a GitHub Actions
  workflow runs the suite on each push.
- **Examples.** `examples/basic_usage.py` and `examples/article_example.py`
  demonstrate the API.
- **Licence.** MIT.

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

That comparison is the natural next step: run the paper's benchmark instances,
record objective values and runtimes, and set them against both the published
results and a reproducible greedy baseline. Until that exists, the honest claim
is narrower — the package provides a tested, installable implementation of the
method with a clear interface.

## Limitations and future work

- **Implementation fidelity.** Without an official reference implementation,
  agreement with the paper's algorithm has to be established by careful reading
  and by reproducing its examples, not assumed.
- **No benchmark suite yet.** Solution quality relative to published results is
  not reported in the repository.
- **Parameter sensitivity.** The fitness components and coverage weights are
  caller-supplied. Their effect on solution quality has not been studied
  systematically.
- **No optimality bound.** As a heuristic, the solver provides feasible
  solutions and an objective value, not a guarantee of optimality.
- **Instance scope.** Behaviour on structured, application-specific instances
  may differ from the examples included with the package.

Planned work includes a benchmark harness for standard instances, a comparison
against a greedy baseline, and a written comparison with the published results.
