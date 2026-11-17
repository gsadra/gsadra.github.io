---
title: "House Price Regression: Linear vs Polynomial Models"
description: "A regression study on 3,479 real estate listings. A cubic in floor area reaches R² 0.61 and a mean absolute error near $80,000, beating a two-feature linear model at 0.57."
category: "Machine Learning and AI"
technologies:
  - Python
  - Scikit-learn
  - Pandas
  - NumPy
  - Regression
  - Matplotlib
github: "https://github.com/gsadra/house-price-regression-analysis"
featured: false
status: "Completed"
date: 2025-12-11
---

## Overview

This project asks how much predictive structure a housing dataset actually
contains, using three regression models of increasing complexity on the same
3,479 listings: simple linear regression on area, multiple linear regression on
area and room count, and polynomial regression of degree three on area.

The measured answer is that model **form** matters more than model **count**. The
cubic in area reaches **R² 0.61** on the held-out set with a mean absolute error
of **$79,868**. Adding room count to a linear model instead yields **R² 0.57** —
worse with two features than the cubic achieves with one. The relationship
between size and price is curved, and no second predictor compensates for
ignoring that.

## Problem and motivation

Housing price is the standard entry point to regression, and the usual treatment
stops at fitting a line and reporting R². That leaves the more useful question
unasked: what is the *shape* of the relationship between size and price, and
where does a linear assumption break down?

Real listings also carry the mess textbook examples omit — implausible areas,
sparse categorical fields, prices recorded in two currencies, and a long tail of
unusual properties. Handling that before modelling is a substantial part of the
work.

## Data

The dataset holds **3,479 rows and 8 columns**: `Area`, `Room`, `Parking`,
`Warehouse`, `Elevator`, `Address`, `Price` (Iranian rial), and `Price(USD)`. The
target is price in USD, which keeps a single currency in the response but embeds
the conversion convention of the source.

A typical record is 63 m², one room, in Shahran, at 1,850,000,000 rial —
$61,666.67. The listings come from a single market, so the relationships found
here reflect that market's conventions about size and layout rather than a
general housing model.

## Method

- **Exploratory analysis**, including scatter plots of price against area. These
  showed a visibly non-linear relationship, which is what motivated a polynomial
  form rather than a more complex model.
- **80/20 train/test split**, with the polynomial features fitted on the training
  data only.
- **Three models**: `LinearRegression` on area; `LinearRegression` on area and
  rooms; and `PolynomialFeatures(degree=3)` on area followed by
  `LinearRegression`.
- **Metrics**: MAE, MSE, and R² on the held-out set.

## Results

| Model                      | Features    | MAE (USD)  | MSE (USD²) | R²       |
| -------------------------- | ----------- | ---------: | ---------: | -------: |
| Polynomial (degree 3)      | Area        | 79,868.06  | 2.22 × 10¹⁰ | **0.61** |
| Multiple linear            | Area, Room  | —          | 8.87 × 10¹⁰ | 0.57     |
| Simple linear              | Area        | —          | —          | see note |

The simple linear model is characterised in the notebook rather than scored: the
scatter plot shows it underfitting the curve systematically, and the notebook's
comparison table records it as moderate R² against the polynomial's best. No R²
value is printed for it, so none is quoted here.

The fitted cubic gives the shape directly. Its coefficients are
3,056.79 · area + 2.61 · area² − 0.0052 · area³ with an intercept of −167,261.
The negative cubic term is the substantive finding: **the marginal price of extra
floor area declines as properties get larger**, which a straight line cannot
express.

The multiple regression puts a coefficient of 2,370.56 on area and 58,824.41 on
each additional room. It fits worse than the one-feature cubic, which suggests
room count is acting as a coarse proxy for size rather than adding independent
information.

## Limitations and future work

- **A third of the variance is unexplained.** R² 0.61 leaves 39% to location,
  condition, floor, age, and the amenities the models ignore.
- **Address is unused.** It is a high-cardinality categorical, and almost
  certainly the strongest available predictor after size. Encoding it (one-hot or
  target encoding) is the single highest-value change available.
- **No outlier treatment.** A cubic is sensitive to extreme listings, and MSE of
  2.2 × 10¹⁰ implies large individual errors. Robust regression or trimming is
  the obvious next step, though the R² would then need re-baselining.
- **Single split, no cross-validation.** One 80/20 split cannot distinguish a real
  improvement from split luck.
- **Degree chosen by inspection.** Degree three was selected after looking at the
  scatter plot; regularised or cross-validated model selection would be firmer.
- **Extrapolation is unsafe.** The data covers roughly 60–220 m²; the cubic turns
  over outside that range and will produce implausible prices.
- **Currency conversion.** Prices in USD inherit a fixed rial convention, so the
  target carries an assumption the features do not.

Planned extensions are encoding address and the amenity flags, robust handling of
outliers, ridge regression over polynomial terms, cross-validation, and a
tree-based comparison to see whether interaction effects beat a hand-chosen
functional form.

## Related

[Predict-Ur-Score](/projects/predict-ur-score/) applies the same
preprocessing-and-pipeline discipline to multi-output regression, predicting seven
subject scores from six student attributes.
