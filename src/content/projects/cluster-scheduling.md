---
title: "Machine Learning for Cluster Workload Scheduling"
description: "Ongoing research on learned scheduling policies for cluster workloads."
category: "Machine Learning and AI"
technologies:
  - Python
  - Machine Learning
  - Scheduling
  - Simulation
featured: true
status: "In Progress"
date: 2026-11-01
---

## Overview

This is an ongoing research project on machine learning for workload
scheduling in computing clusters. The work asks whether a learned policy can
make better scheduling and resource-allocation decisions than the
hand-designed heuristics that schedulers typically rely on.

**Status: in progress.** The project is currently at the stage of problem
formulation, workload analysis, and method design. No experimental results
are reported on this page, and none should be inferred from it.

## Research problem

A cluster scheduler receives a stream of jobs, each with a resource demand
(CPU, memory, possibly accelerators), a duration, and a priority. It must
decide when each job starts, and on which machine, subject to capacity
constraints. The objective is not a single number: throughput, mean job
waiting time, tail latency, and fairness between users all matter, and they
trade off against each other.

Classical schedulers encode a policy by hand — shortest-job-first, fair
sharing, backfilling, or a priority queue with reservations. These policies
are interpretable and predictable, but they are fixed: they do not adapt
when the workload mix changes, and their parameters are tuned for average
behaviour rather than for a specific cluster's traffic.

## Research questions

1. Which workload features — job size, arrival pattern, resource demand,
   runtime, queue depth — carry the most information about a good scheduling
   decision?
2. Can a learned policy match or improve on established heuristics under
   realistic workload conditions, including bursty arrivals?
3. How sensitive is a learned policy to distribution shift between the
   workload it was trained on and the workload it is evaluated on?
4. What does a learned policy give up in interpretability, and can that gap
   be reduced without losing performance?

## Experimental setup

The experimental plan uses workload traces together with a discrete-event
simulation of the cluster, so that policies can be compared on identical
inputs and under identical capacity constraints.

- **Workload characterisation.** Job size distributions, arrival processes,
  and resource utilisation are analysed before any model is trained, because
  the shape of the workload determines which learning formulation is
  appropriate.
- **Simulation environment.** A scheduler-independent simulator provides the
  state transitions, so that baseline heuristics and learned policies are
  evaluated by the same code path.
- **Baselines.** Standard heuristics, implemented and tuned consistently,
  rather than a single weak comparator.
- **Metrics.** Mean and tail waiting time, makespan, throughput, and
  fairness across users, reported together so that trade-offs are visible.

## Approach under development

The working direction has two components:

- **Estimation.** Supervised models for job runtime and resource demand,
  used to give the scheduler better information than the values declared at
  submission time.
- **Decision-making.** A policy that maps the observed cluster state to a
  scheduling action, trained against a reward that reflects the metrics
  above. A reinforcement-learning formulation is the main candidate, with a
  supervised imitation of a strong heuristic as a comparison point.

The simulator is deliberately kept separate from the learning code, so that
a policy can be tested against a different workload or a different baseline
without being rewritten.

## Current progress

- Problem formulation and a review of existing scheduling policies.
- Workload data preparation and exploratory analysis.
- Design of the simulation-based evaluation protocol.
- Implementation of baseline heuristics for comparison.

## Planned work

- Complete and validate the simulation environment.
- Establish baseline results across the chosen workloads.
- Train and evaluate the learned policies.
- Analyse sensitivity to workload shift and report limitations.

## Limitations and expected risks

- **Simulation fidelity.** A simulator is not a production cluster; a gain
  in simulation may not survive contact with real hardware and real users.
- **Reward specification.** Scheduling objectives are multi-objective, and a
  scalar reward inevitably embeds a value judgement about the trade-off.
- **Training data.** Workload traces are limited and may not represent the
  distribution a deployed scheduler would face.
- **Reproducibility.** Learned policies are sensitive to seeds and
  hyperparameters; the evaluation protocol must report variance, not only
  best runs.

Results will be published here only once the experiments are complete and
can be reproduced.
