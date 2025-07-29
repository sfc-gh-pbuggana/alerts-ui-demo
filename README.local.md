# Financial Projections: Business-Constrained ARIMA-GARCH Credit Usage Forecasting

This project implements a sophisticated **business-constrained ARIMA-GARCH model** for forecasting credit usage over the next 12 months. The methodology follows academic best practices while enforcing critical business constraints to ensure realistic, actionable forecasts.

## 🎯 Project Overview

- **Model Type**: Hybrid Log-ARIMA-GARCH with Business Constraints
- **Forecast Horizon**: 12 months (52 weeks)
- **Key Features**: Non-negativity constraints, trend controls, volatility modeling
- **Data Period**: Weekly credit usage from July 2024 to July 2025
- **Business Focus**: Realistic forecasts that respect operational constraints

## 🛡️ Business Constraints Implemented

### 1. **Non-Negativity Constraint**
- **Requirement**: Credit usage cannot go below zero
- **Solution**: Log-transformation ensures all forecasts are positive
- **Impact**: Eliminates unrealistic negative predictions

### 2. **No Secular Decline Constraint**
- **Requirement**: Credit usage should not show systematic decline
- **Solution**: Drift constraints prevent unrealistic downward trends
- **Impact**: Forecasts hold constant or show modest growth

### 3. **Economic Realism**
- **Requirement**: Forecasts must be business-appropriate
- **Solution**: Trend analysis and constraint enforcement
- **Impact**: Reliable forecasts for capacity planning

## 🚀 Quick Setup

### 1. Activate Virtual Environment

```bash
# Activate the existing virtual environment
source venv/bin/activate
```

### 2. Install Dependencies (if needed)

```bash
# If starting fresh, install all dependencies
pip install -r requirements.txt
```

### 3. Launch Jupyter Notebook

```bash
# Start Jupyter Lab
jupyter lab

# Or start classic Jupyter Notebook
jupyter notebook
```

### 4. Run the Analysis

Open `financial_projections.ipynb` and run all cells sequentially.

## 📦 Required Dependencies

The project requires the following key packages:

- **pandas** (2.3.1) - Data manipulation and analysis
- **numpy** (2.3.2) - Numerical computing
- **matplotlib** (3.10.3) - Plotting and visualization
- **seaborn** (0.13.2) - Statistical data visualization
- **statsmodels** (0.14.5) - Statistical modeling and econometrics
- **arch** (7.2.0) - GARCH modeling and volatility analysis
- **jupyter** (1.1.1) - Interactive notebook environment

All dependencies with exact versions are listed in `requirements.txt`.

## 🔬 Methodology

### Business-Constrained ARIMA-GARCH Model

1. **Data Preprocessing**: Structural break detection and analysis
2. **Stationarity Testing**: ADF and KPSS tests for unit roots
3. **Log-Scale ARIMA**: Grid search for optimal parameters on log-transformed data
4. **Business Constraints**: Drift constraints to prevent secular decline
5. **ARCH Testing**: Volatility clustering detection
6. **GARCH Modeling**: Conditional volatility modeling (when applicable)
7. **Constrained Forecasting**: 12-month forecasts with business logic
8. **Non-Negativity Enforcement**: Ensures all forecasts are positive

### Key Improvements Over Standard ARIMA-GARCH

- **❌ Problem**: Standard ARIMA(0,2,1) produced negative forecasts (-271,666 avg)
- **✅ Solution**: Log-ARIMA with constraints produces positive forecasts (~55,000 avg)
- **❌ Problem**: Original model showed secular decline
- **✅ Solution**: Drift constraints prevent unrealistic downward trends
- **❌ Problem**: Economically meaningless results
- **✅ Solution**: Business-appropriate forecasts for planning

### Key Findings

- Major structural break detected in December 2024
- Credit usage increased ~51x after the break (1,088 → 55,915 credits/week)
- Post-break regime shows stable high usage with moderate volatility
- Business-constrained model generates realistic forecasts: 50,000-60,000 credits/week

## 📊 Output

The refined analysis produces:

- **Business-Appropriate Forecasts**: All positive, no secular decline
- **Constrained Forecast DataFrame**: 52 weeks with confidence intervals
- **Comprehensive Visualizations**: Original vs constrained forecast comparisons
- **Model Diagnostics**: Log-ARIMA and GARCH parameter estimates
- **Business Insights**: Monthly projections and capacity planning recommendations

## 🔧 Troubleshooting

### Virtual Environment Issues

```bash
# If venv doesn't exist, create it
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Package Installation Issues

```bash
# Upgrade pip if needed
pip install --upgrade pip

# Install packages individually if bulk install fails
pip install pandas numpy matplotlib seaborn statsmodels arch jupyter
```

### Jupyter Kernel Issues

```bash
# Register the venv as a Jupyter kernel
python -m ipykernel install --user --name=venv --display-name="Financial Projections"
```

## 📈 Project Structure

```
financial_projections__alerts/
├── venv/                          # Virtual environment
├── requirements.txt               # Package dependencies
├── financial_projections.ipynb   # Main analysis notebook (business-constrained)
├── fin_proj_credits__raw.csv     # Credit usage data
├── README.md                      # This file
├── setup.sh                       # Setup automation script
└── Mathematical Problems...pdf    # Research reference
```

## 📋 Business Results Summary

### ✅ Constraints Satisfied
- **Non-negative forecasts**: All 52 forecasts are positive
- **No secular decline**: Slight upward trend (not downward)
- **Economic realism**: Forecasts in 50,000-60,000 range

### 📊 12-Month Forecast Summary
- **Average weekly usage**: ~55,000 credits
- **Total projected usage**: ~2.86 million credits
- **Monthly average**: ~238,000 credits
- **Forecast range**: 52,000 - 58,000 credits/week

### 🎯 Business Recommendations
1. Use constrained forecasts for capacity planning
2. Monitor for deviations from 50,000-60,000 weekly range
3. Update model monthly with new data
4. Alert if usage drops below 40,000 or exceeds 80,000
5. Consider external factors driving usage changes

## 🎓 Academic References

The methodology is based on established ARIMA-GARCH literature with business constraint enhancements:
- Engle, R.F. (1982) - ARCH modeling
- Bollerslev, T. (1986) - GARCH extensions
- Box-Jenkins methodology for ARIMA modeling
- Log-transformation techniques for non-negative time series

## 📝 License

This project is for research and educational purposes. 