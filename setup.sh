#!/bin/bash

# Financial Projections ARIMA-GARCH Setup Script
# This script sets up the virtual environment and installs all dependencies

echo "🚀 Setting up Financial Projections ARIMA-GARCH Environment..."
echo "=================================================================="

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    if [ $? -eq 0 ]; then
        echo "✅ Virtual environment created successfully"
    else
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing dependencies from requirements.txt..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        echo "✅ All dependencies installed successfully"
    else
        echo "❌ Error installing dependencies"
        exit 1
    fi
else
    echo "⚠️  requirements.txt not found, installing core packages..."
    pip install pandas numpy matplotlib seaborn statsmodels arch jupyter ipykernel
fi

# Register Jupyter kernel
echo "🔧 Registering Jupyter kernel..."
python -m ipykernel install --user --name=financial_projections --display-name="Financial Projections ARIMA-GARCH"

echo ""
echo "🎉 Setup completed successfully!"
echo "=================================================================="
echo ""
echo "To get started:"
echo "1. Activate the environment: source venv/bin/activate"
echo "2. Launch Jupyter: jupyter lab"
echo "3. Open: financial_projections.ipynb"
echo ""
echo "Or run: ./run_analysis.sh"
echo "" 