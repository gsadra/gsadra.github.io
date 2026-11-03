---
title: "Predict-Ur-Score"
description: "A command-line machine learning application that predicts student scores across seven school subjects."
category: "Machine Learning and AI"
technologies:
  - Python
  - Scikit-learn
  - Pandas
  - NumPy
  - pytest
github: "https://github.com/gsadra/Predict-Ur-Score"
featured: true
status: "Completed"
date: 2026-01-01
---

## Overview

Predict-Ur-Score is a command-line application that estimates how a student is
likely to score in seven school subjects — mathematics, history, physics,
chemistry, biology, English, and geography — from a short set of questions about
their circumstances and study habits.

Predictions come from a Random Forest regressor trained on a student score
dataset and wrapped in a reusable scikit-learn pipeline. The project is
deliberately end-to-end: exploratory analysis, preprocessing, model evaluation,
a saved model artifact, input validation, a statistics view, and automated
tests. Running it requires only `uv` and a clone of the repository.

## Problem and motivation

Students can see their own habits but not their likely outcomes. A model that
maps observable study behaviour to expected subject scores offers a concrete,
data-grounded starting point for that reflection — not a verdict, but a
calibration aid.

Formulated as a learning problem, the task is to approximate a mapping from a
feature vector <em>x</em> describing a student to a vector of subject scores
<em>y</em>. The features are heterogeneous (numeric and categorical), the
dataset is modest, and the relationships are non-linear, which makes a
tree-based ensemble a reasonable default.

A command-line interface keeps the scope honest. The substance of the project is
the data pipeline and its validation, not a web front end around it.

## Data and features

The repository includes the training data at `data/student-scores.csv`. Each
record describes a student through features such as:

- gender and part-time employment status,
- days absent and participation in extracurricular activities,
- weekly self-study hours,
- career aspirations.

The targets are scores in the seven subjects listed above.

The dataset is small and observational. Its original source and license are not
documented in the repository yet; adding that provenance is necessary before
the reported behaviour can be treated as reproducible outside this context.

## Methodology

The pipeline follows a standard supervised workflow:

1. **Exploratory analysis.** Distributions, missing values, and the relationship
   between candidate features and subject scores are inspected before modelling.
2. **Preprocessing.** Numeric and categorical features are handled automatically
   by a preprocessing stage that is fitted on the training data.
3. **Model evaluation.** Candidate models are trained and validated before the
   final pipeline is written, so that the choice is based on measured
   performance rather than convenience.
4. **Model selection.** A Random Forest regressor was selected as the
   best-performing model for this dataset, and is the model shipped with the
   application.
5. **Pipeline persistence.** Preprocessing and model are saved together as
   `models/best_model.joblib`, so inference applies exactly the transformations
   used during training.
6. **Prediction.** The CLI collects answers, validates them, loads the pipeline,
   and prints a predicted score for each of the seven subjects.

Keeping preprocessing inside the fitted pipeline removes the most common source
of silent error in applied machine learning: training and inference data being
transformed differently.

## Implementation

The code is organised as a small Python package under `src/predict_ur_score/`,
with separate modules for data loading, exploratory analysis, preprocessing,
training, validation, prediction, statistics, and the CLI interface.

- `pandas` and `NumPy` handle loading, cleaning, and numeric work.
- `scikit-learn` provides the transformers, the Random Forest model, and the
  pipeline that binds them.
- `joblib` carries the fitted pipeline between training and prediction.
- A dedicated validation layer checks user input and reports problems through
  custom exceptions, rather than failing deep inside the model.
- `pytest` covers the interface and prediction paths; `ruff` and `mypy` are
  configured for linting, formatting, and type checking.

The package is managed with `uv`:

```bash
uv sync
uv run predict-ur-score
```

## Results and evaluation

The repository is the authoritative record of the evaluation that informed the
model choice, together with the saved artifact.

This page does not restate a headline metric. Scores from a single dataset
snapshot depend on the split and preprocessing choices, and quoting one figure
without that context would overstate what has been demonstrated. What the
project does establish is a reproducible path from raw data to a persisted,
testable prediction pipeline.

## Limitations and future work

- **Prediction is not advice.** The model describes statistical associations in
  one dataset; it does not identify what causes a score to rise or fall.
- **Dataset provenance.** The source and license of the training data need to be
  documented, and a fixed snapshot kept, before results can be reproduced.
- **Scope.** Seven subjects, one dataset, and a fixed feature set. Performance on
  another cohort or curriculum has not been tested.
- **Uncertainty.** The application returns point predictions without calibrated
  intervals, which limits how strongly they should be read.
- **Fairness.** Sensitive attributes and their proxies need an explicit audit
  before any use in advising or assessment.

Next steps include calibrated prediction intervals, a fairness audit across
subgroups, documented dataset provenance, and an exportable report for a single
student's answers.
