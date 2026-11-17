---
title: "Predict-Ur-Score"
description: "A command-line machine learning application that predicts student scores across seven subjects, built on 2,000 student records and shipped as a single saved pipeline."
category: "Machine Learning and AI"
technologies:
  - Python
  - Scikit-learn
  - Pandas
  - NumPy
  - pytest
  - uv
github: "https://github.com/gsadra/Predict-Ur-Score"
featured: false
status: "Completed"
date: 2026-01-01
---

## Overview

Predict-Ur-Score is a command-line application that estimates how a student is
likely to score in seven school subjects — mathematics, history, physics,
chemistry, biology, English, and geography — from six attributes of their
circumstances and study habits.

Predictions come from a Random Forest with a tuned configuration, wrapped in a
scikit-learn pipeline that is fitted, persisted, and reloaded as one object. The
project is deliberately end-to-end: preprocessing as pipeline steps, a saved
artifact, input validation with specific error types, a statistics view, and
automated tests. Running it needs only `uv` and a clone of the repository.

```bash
uv sync
uv run predict-ur-score
```

## Problem and motivation

Students can see their own habits but not their likely outcomes. A model that maps
observable study behaviour to expected subject scores offers a concrete,
data-grounded starting point for reflection — not a verdict, but a calibration
aid.

Formulated as a learning problem, the task is to approximate a mapping from a
feature vector <em>x</em> describing a student to a vector of seven subject
scores <em>y</em>. The features are mixed numeric and categorical, the targets are
correlated across subjects, and a command-line interface keeps the scope honest:
the substance is the data pipeline and its validation, not a web front end
around it.

## Data

The repository includes the training data at `data/student-scores.csv`: **2,000
student records across 17 columns**. Four are identity fields — `id`,
`first_name`, `last_name`, `email` — and are dropped on load by `_select_data`,
before any model sees them. The remaining columns split cleanly:

- **Six features:** gender, part-time employment, absence days, extracurricular
  activities, weekly self-study hours, and career aspiration.
- **Seven targets:** `math_score`, `history_score`, `physics_score`,
  `chemistry_score`, `biology_score`, `english_score`, `geography_score`.

The dataset is observational and its source and licence are not documented in the
repository. Adding that provenance is a prerequisite for treating the reported
behaviour as reproducible outside this context.

## Methodology

**Preprocessing runs inside the pipeline.** A `ColumnTransformer` applies a
`StandardScaler` to the two numeric features (`absence_days`,
`weekly_self_study_hours`) and a `OneHotEncoder` — with `handle_unknown="ignore"`,
so unseen answers at prediction time do not raise — to the categorical ones. The
transformer is fitted on training data and saved with the model, which removes
the most common source of silent error in applied machine learning: training and
inference data being transformed differently.

**Four candidate pipelines.** `train.py` maps model names to pipeline builders,
each pairing the shared preprocessor with a different estimator:

| Key                | Estimator                                    |
| ------------------ | -------------------------------------------- |
| `random_forest`    | `RandomForestRegressor` (multi-output native) |
| `decision_tree`    | `DecisionTreeRegressor`                      |
| `svm`              | `SVR(kernel="rbf")` in a `MultiOutputRegressor` |
| `linear_regression`| `LinearRegression`                           |

**The shipped configuration** applies `BEST_MODEL_PARAMS` on top of the pipeline
defaults: 200 trees instead of 100, `max_depth=10`, `min_samples_split=5`,
`min_samples_leaf=4`, and `max_features="log2"`. Those are tuned values, and they
are the only record of the selection step in the repository — see the note under
Results.

**Prediction.** The CLI collects answers, validates them, loads
`models/best_model.joblib` (a 4.9 MB artifact containing both preprocessing and
model), and prints a predicted score for each of the seven subjects.

## The interface

The screenshots below are from the application itself, running at version 0.1.0
on Windows.

<figure>
    <img src="/images/projects/predict-ur-score/cli-home.png" alt="Terminal showing the Predict Ur Score CLI App version 0.1.0 menu with three options: predict scores, check scores stats, and exit." width="993" height="467" loading="lazy" decoding="async" />
    <figcaption>
      The entry menu: predict a score, inspect the dataset statistics, or exit.
    </figcaption>
  </figure>
  <figure>
    <img src="/images/projects/predict-ur-score/cli-answers.png" alt="Terminal question flow asking gender, part-time job, absence days, extracurricular activities, weekly study hours, and a career aspiration from a numbered list of 17 options." width="1028" height="999" loading="lazy" decoding="async" />
    <figcaption>
      Six prompts, including the 17 career aspirations the model was trained on.
      Answers are validated as they are entered.
    </figcaption>
  </figure>
  <figure>
    <img src="/images/projects/predict-ur-score/cli-prediction.png" alt="Terminal table listing predicted scores for seven subjects: math 85.39, history 78.92, physics 86.6, chemistry 86.01, biology 83.65, English 81.2, and geography 81.43." width="900" height="595" loading="lazy" decoding="async" />
    <figcaption>
      Output for one set of answers: seven predicted subject scores, one per
      target the model was trained on.
    </figcaption>
  </figure>
  <figure>
    <img src="/images/projects/predict-ur-score/cli-stats.png" alt="Terminal table of descriptive statistics from pandas describe, covering absence days, weekly self-study hours, and the seven subject scores with mean, standard deviation, quartiles, minimum, and maximum." width="1830" height="768" loading="lazy" decoding="async" />
    <figcaption>
      The statistics view: a <code>describe()</code> over the two numeric
      features and all seven targets, so a prediction can be read against the
      dataset's actual range.
    </figcaption>
  </figure>

## Implementation

The code is a small package under `src/predict_ur_score/`, with separate modules
for data loading, exploratory analysis, preprocessing, training, validation,
prediction, statistics, the CLI interface, custom exceptions, and shared
constants. `pandas` and `NumPy` handle loading and numeric work, `scikit-learn`
provides the transformers and estimators, and `joblib` carries the fitted pipeline
between training and prediction.

A dedicated validation layer checks user input against the expected types and
ranges and reports problems through named exceptions rather than failing deep
inside the model. Tests live in `tests/test_interface.py` and
`tests/test_predict.py`, and `ruff` and `mypy` are configured for linting,
formatting, and type checking.

## Results and evaluation

The repository ships the tuned hyperparameters and the fitted artifact, but it
does **not** include the evaluation that produced them: there is no metrics
report, no held-out score, and no committed script that reproduces the model
selection. The README describes evaluation as part of the workflow, and the tuned
parameters are consistent with that having happened, but the evidence is not in
the repository.

This page therefore quotes no accuracy or error figure. Doing so would mean
re-running training and inventing a number that the project itself never
published. What the repository does establish is a reproducible path from raw
data to a persisted, loadable, testable prediction pipeline.

## Limitations and future work

- **No committed evaluation.** The single most useful addition is the missing
  piece: a held-out split, per-subject MAE and R², and the comparison table across
  the four candidate pipelines.
- **Prediction is not advice.** The model describes statistical associations in
  one dataset; it does not identify what causes a score to rise or fall.
- **Dataset provenance.** The source and licence of `student-scores.csv` are
  undocumented, and no fixed snapshot or checksum is recorded.
- **Identity fields.** `id`, name, and email are correctly dropped, but they sit
  in the same CSV a future contributor might train from. Guarding that explicitly
  — and committing a de-identified copy — would be safer.
- **Scope.** Seven subjects, one dataset, one fixed feature set. Performance on
  another cohort or curriculum has not been tested.
- **Uncertainty.** The application returns point predictions without intervals,
  which limits how strongly any single number should be read.
- **Fairness.** Sensitive attributes and their proxies have not been audited
  before use in anything resembling advising.

Next steps are the evaluation harness, calibration, a fairness audit across
subgroups, documented dataset provenance, and an exportable per-student report.

## Related

The saved-pipeline approach here mirrors the preprocessing discipline in
[House Price Regression: Linear vs Polynomial Models](/projects/house-price-regression-analysis/),
where model form rather than feature count proved decisive.
