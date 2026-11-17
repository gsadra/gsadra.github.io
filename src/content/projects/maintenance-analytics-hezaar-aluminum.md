---
title: "Maintenance Analytics for Hezaar Aluminum Industries"
description: "Reliability analysis of an aluminum production line: 254 failures across two subsystems, 11,820 minutes of downtime, and the MTBF, MTTR, and availability figures that follow."
category: "Data Science and Analytics"
technologies:
  - Python
  - pandas
  - SciPy
  - Reliability engineering
  - Data visualization
github: "https://github.com/gsadra/Maintenance-Analytics-for-Hezaar-Aluminum-Industries"
featured: true
status: "Completed"
date: 2026-05-13
---

## Overview

This is an industrial reliability study of the A6 production line at Hezaar
Aluminum Industries, built from the line's own maintenance records. It covers
both subsystems: 172 recorded electrical failures and 82 mechanical failures,
together accounting for 11,820 minutes of downtime. From those records it
computes the standard maintenance KPIs, ranks failure causes by frequency and
by downtime impact, and characterises how downtime is distributed.

The headline result is a split diagnosis. The electrical subsystem accounts for
two thirds of all failures but **81% of all downtime** — 9,626 minutes against
2,194 for mechanical — and runs at 96.4% availability against 99.1% for the
mechanical side. Availability improvements on this line are, on this evidence,
an electrical problem first.

## Problem and motivation

Maintenance records accumulate as a by-product of work, not as a dataset. In
most plants they are complete enough to answer questions but structured so that
answering them is slow: inconsistent headers, free-text failure descriptions,
partial entries, and dates recorded in the Jalali calendar. The practical
consequence is that reliability decisions rest on individual experience rather
than on the record the plant already holds.

The questions here are the ones a maintenance manager actually asks. Which
failures occur most often, and which consume the most time? Is downtime
concentrated in a few critical modes or spread thinly? What is the line's
availability, and where does it lose the most of it?

## Data

The analysis draws on two record sets, one for electrical components and one for
mechanical components, each carrying failure causes, classifications, and
downtime entries timestamped in the Jalali calendar.

Two properties of the data shape the conclusions. First, causes are published
under anonymised identifiers (`AnonymizedCause` in the result sheets), so the
analysis can say that cause 13 is the dominant electrical failure mode without
naming the component. Second, the underlying records are confidential and are
**not** included in the repository: it ships the notebook, the analysis code, and
the derived result tables, but not the plant's data. The method is therefore
reproducible; these particular figures are not independently auditable.

## Method

1. **Preprocessing.** Headers were normalised across the two subsystems,
   incomplete and invalid records removed, categorical fields encoded for
   grouping, and Jalali timestamps converted to Gregorian dates so intervals and
   seasonality could be computed.
2. **Exploratory analysis.** Failure counts, downtime totals, and their
   distribution across subsystems were examined before any KPI was computed,
   because the shape of the data determines which summaries mean anything.
3. **Pareto analysis.** Causes were ranked separately by failure count and by
   downtime, with cumulative percentages. Ranking on both matters: a cause can be
   frequent but quick to repair, or rare and expensive to recover from.
4. **Distribution fitting.** Downtime durations were fitted to candidate
   distributions with `scipy.stats`, to describe repair behaviour rather than
   report a single average.
5. **Time-series inspection.** Failures were tracked over time to detect
   clusters, trends, and periodic patterns that a static count would hide.
6. **Reliability metrics.** MTBF, MTTR, availability, and failure rate were
   computed from the cleaned event records, with breakdowns by subsystem.

## Results

| Metric                | Electrical | Mechanical |
| --------------------- | ---------: | ---------: |
| Recorded failures     | 172        | 82         |
| Total downtime (min)  | 9,626      | 2,194      |
| MTTR                  | 56.0 min   | 26.8 min   |
| MTBF                  | 24.70 h    | 50.03 h    |
| Availability          | 96.4%      | 99.1%      |
| Failure rate (per h)  | 0.0405     | 0.0200     |

The availability figures are internally consistent with the other two KPIs:
MTBF / (MTBF + MTTR) reproduces 0.9636 and 0.9912 to four decimal places for
electrical and mechanical respectively.

**Where the downtime comes from.** The electrical subsystem produces 2.1 times as
many failures as the mechanical one, and each repair takes roughly twice as long
— 56 minutes against 27. The two effects compound: electrical downtime is 4.4
times mechanical downtime.

**Concentration of causes.** Electrical failures follow a Pareto pattern. The
single most frequent cause accounts for 41 of 172 failures (23.8%) and 3,770
minutes — 39% of all electrical downtime, at an average of 92 minutes per
occurrence, well above the subsystem's 56-minute MTTR. The top three causes cover
49.4% of failures; the top five cover 70.3%. The mechanical subsystem is even more
concentrated: one cause accounts for 38 of 82 failures (46.3%), and the top three
cover 63.4%.

That contrast is the practical finding. Electrical reliability is a portfolio
problem — five causes to attack, no single dominant one — while mechanical
reliability is dominated by a single mode, where one intervention addresses
nearly half of all failures.

<figure>
  <img src="/images/projects/maintenance/pareto-electrical.png" alt="Pareto chart of electrical failure causes: bars sorted from 41 failures for cause 13 down to single failures, with a cumulative percentage line and a dashed 80 percent reference line." width="2373" height="1171" loading="lazy" decoding="async" />
  <figcaption>
    Pareto analysis of the electrical subsystem. Bars are failure counts by
    anonymised cause, ranked highest first; the red line is the cumulative share
    of all 172 failures, read against the dashed 80% reference. Cause 13 leads
    with 41 failures.
  </figcaption>
</figure>

<figure>
  <img src="/images/projects/maintenance/downtime-by-cause-electrical.png" alt="Horizontal bar chart of total downtime in minutes by electrical failure cause, led by cause 13 at roughly 3,770 minutes and followed by cause 14 near 1,090 minutes." width="2370" height="1174" loading="lazy" decoding="async" />
  <figcaption>
    The same causes ranked by minutes lost rather than by count. Cause 13 alone
    accounts for 3,770 of the subsystem's 9,626 downtime minutes — a different
    ordering from the frequency ranking, which is why both views are needed.
  </figcaption>
</figure>

<figure>
  <img src="/images/projects/maintenance/pareto-mechanical.png" alt="Pareto chart of mechanical failure causes: cause 0 with 38 failures, cause 5 with 8, cause 2 with 6, then single-digit counts, with a cumulative percentage line and a dashed 80 percent reference line." width="2373" height="1171" loading="lazy" decoding="async" />
  <figcaption>
    Pareto analysis of the mechanical subsystem. Cause 0 alone accounts for 38 of
    82 failures (46.3%), and the top three causes reach 63.4% — a steeper
    concentration than the electrical side.
  </figcaption>
</figure>

<figure>
  <img src="/images/projects/maintenance/downtime-by-cause-mechanical.png" alt="Horizontal bar chart of total downtime in minutes by mechanical failure cause, led by cause 0 at roughly 716 minutes, followed by causes 16 and 5 at about 319 and 313 minutes." width="2370" height="1174" loading="lazy" decoding="async" />
  <figcaption>
    Mechanical downtime by cause. Cause 0 loses 716 of the subsystem's 2,194
    minutes; causes 16 and 5 follow at 319 and 313. Both figures are published
    in the repository under <code>outputs/figures/</code>.
  </figcaption>
</figure>

## Implementation

The work is a documented notebook, `notebooks/Maintenance-Analytics-HAI.ipynb`,
using `pandas` and `numpy` for data handling, `matplotlib` and `seaborn` for
figures, `scipy.stats` for distribution fitting, and `jdatetime` for Jalali
conversion. Dependencies are pinned in `requirements.txt`.

Results are exported rather than left in the notebook: ten figures in
`outputs/figures/` (failure trends, downtime distributions, time between
failures, per-cause rankings for each subsystem) and the underlying tables as
CSVs in `outputs/sheets/`, including the KPI tables reproduced above. That export
matters for use — the numbers in this page can be checked against the repository
without re-running anything.

## Limitations and future work

- **Confidential data.** One production line, one period, private records.
  Nothing here can be independently reproduced or extended to another plant.
- **Anonymised causes.** The strongest finding — cause 13 dominates electrical
  downtime — cannot be acted on without the mapping back to components, which is
  held in the source data.
- **Hand-entered records.** Short stops and near-misses are likely
  under-reported, and misclassification is probable; cleaning can only remove
  what is visibly wrong.
- **Descriptive, not predictive.** The analysis explains past downtime. It does
  not forecast failures and is not a predictive-maintenance model.
- **Averages hide trend.** Availability is a period figure; without a rolling
  view, an improving or deteriorating line looks identical.
- **No cost data.** Downtime is measured in minutes, not money, so causes cannot
  be prioritised by financial impact.

The next step implied by the data is narrow: quantify what the top five
electrical causes would return if their mean repair time fell to the
subsystem's mechanical level, and track availability monthly afterwards so the
intervention has a baseline to be measured against.

## Related

The same reliability vocabulary — MTBF, MTTR, availability, Pareto ranking —
carries over to the scheduling work in
[Machine Learning for Cluster Workload Scheduling](/projects/cluster-scheduling/),
where the question is whether a scheduler can be learned rather than specified.
