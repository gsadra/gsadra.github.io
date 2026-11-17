---
title: "Heart Disease Classification with Classical Models"
description: "Logistic regression, decision trees, and SVMs compared on 303 patient records. A regularised linear model reaches 0.90 accuracy and 0.97 recall on the disease class."
category: "Machine Learning and AI"
technologies:
  - Python
  - Scikit-learn
  - Pandas
  - NumPy
  - Classification
  - Matplotlib
github: "https://github.com/gsadra/heart-disease-ml-classification"
featured: false
status: "Completed"
date: 2025-12-11
---

## Overview

This project compares classical supervised models on a binary clinical task:
predicting the presence or absence of heart disease from routine patient
measurements. Logistic regression, decision trees, and support vector machines
are trained on the same split and evaluated on the same 61 held-out records.

A heavily regularised logistic regression (`C = 0.01`) performs best. On the
test set it reaches **0.90 accuracy (55 of 61 records)** and **0.97 recall on the
disease class (28 of 29 patients)**. The second-best model, a linear SVM, gets 53
of 61 right. The practical reading of that gap is the first honest finding of
this study: two records separate the top two models, which is well inside the
noise a 61-record test set can resolve.

## Problem and motivation

Screening is a problem where the two error types are not equally costly. A false
negative sends a patient home without follow-up; a false positive triggers
further testing that is inconvenient and expensive but recoverable. That
asymmetry is why the interesting metric here is recall on the disease class
rather than accuracy alone, and why a model that flags 28 of 29 positive cases at
0.85 precision is more useful than one with a tidier accuracy and more missed
cases.

The secondary motivation is methodological. Small tabular datasets with a dozen
correlated clinical features are exactly where reaching for a complex model tends
to be wrong, and where regularisation and a simple decision boundary often hold
up better than they are given credit for.

## Data

The dataset contains **303 patient records** and 14 columns: age, sex, chest pain
type, resting blood pressure, cholesterol, fasting blood sugar, resting ECG,
maximum heart rate achieved, exercise-induced angina, ST depression, ST slope,
number of major vessels, thalassemia category, and the binary target.

All 303 records are complete across all 14 columns. The class balance is close to
even — 32 negatives and 29 positives in the test split — which keeps accuracy
interpretable but also means that 61 records is a small sample for distinguishing
models.

## Methodology

- **Split.** 80/20 holdout, `random_state = 2`, giving 242 training and 61 test
  records.
- **Scaling.** `StandardScaler` for the logistic regression, which needs it for
  the regularised objective to behave sensibly.
- **Evaluation.** Accuracy, and a full per-class `classification_report` with
  precision, recall, and F1.

Three model families were examined with internal variants: logistic regression
across a grid of regularisation strengths (`C` from 0.01 to 0.09), decision trees
under Gini, entropy, and log-loss splitting, and SVMs with linear, polynomial,
and RBF kernels.

## Results

| Model                    | Accuracy | Correct of 61 |
| ------------------------ | -------: | ------------: |
| Logistic regression      | **0.90** | 55            |
| SVM (linear)             | 0.87     | 53            |
| Decision tree (Gini)     | 0.82     | 50            |
| Decision tree (entropy)  | 0.82     | 50            |
| Decision tree (log loss) | 0.80     | 49            |
| SVM (polynomial)         | 0.68     | —             |
| SVM (RBF)                | 0.67     | —             |

**Best model, class by class.** At `C = 0.01`, logistic regression produces:

| Class           | Precision | Recall | F1    | Support |
| --------------- | --------: | -----: | ----: | ------: |
| No disease (0)  | 0.96      | 0.84   | 0.90  | 32      |
| Disease (1)     | 0.85      | 0.97   | 0.90  | 29      |

The errors are concentrated in the direction the task tolerates best: five
healthy patients were flagged for follow-up, and one diseased patient was missed.

## Sensitivity analysis

Regularisation strength was varied explicitly rather than fixed by convention.
Recovery is sharp and then flat: `C = 0.01` gives 0.9016 accuracy, and every value
from 0.02 through 0.09 gives 0.8689 — 53 of 61, the same score as the linear SVM.
The single best setting buys one additional correct classification over that whole
plateau, which is worth stating plainly because it bounds how much the tuned
result should be trusted.

The non-linear SVMs trail badly — 0.68 for the polynomial kernel and 0.67 for RBF,
with the RBF model's recall on the negative class falling to 0.44. On 242 training
records, a flexible kernel boundary is estimating more structure than the data
supports.

## Limitations and future work

- **Scaler fitted before the split.** The notebook standardises the full feature
  matrix and then splits it, so test-set statistics influence the training
  transform. The effect is small at this scale, but it is leakage and should be
  fixed inside a pipeline.
- **Inconsistent preprocessing between models.** Logistic regression is trained on
  scaled features while the trees and SVMs use unscaled ones. The trees do not
  care; the SVMs do, which handicaps them in this comparison.
- **Single split.** One 80/20 holdout of 61 records is a weak estimate of
  generalisation, and two-record differences between models are not meaningful
  without cross-validation and reported variance.
- **Metric labelling.** The notebook computes `fbeta_score(beta=0.5)` — an F0.5
  score, which weights precision above recall — and labels it "R2-Score" in its
  output and "F2" in the README. The figure is real; the name is not, and this
  page therefore reports accuracy and per-class recall instead.
- **Threshold at 0.5.** Given the asymmetry of error costs, the decision
  threshold should be tuned rather than left at the default.
- **No calibration, no confidence.** The scores are decisions, not calibrated
  risks.
- **Not a clinical tool.** This benchmarks methods on a public-style dataset. It
  has no external validation and makes no claim to clinical validity.

Planned work is cross-validation with variance reported, calibration and
threshold selection, a consistent preprocessing pipeline shared by all models,
and a comparison against ensembles — which would test whether added flexibility
pays for itself once the evaluation is more robust.

## Related

The same evaluation discipline — holdout sets, class-wise error analysis, and
explicit sensitivity to hyperparameters — is applied to regression in
[House Price Regression: Linear vs Polynomial Models](/projects/house-price-regression-analysis/).
