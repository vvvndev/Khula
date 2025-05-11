import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/currencyFormatter';

const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(1000);
  const [term, setTerm] = useState<number>(6);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  // Calculate loan details when inputs change
  useEffect(() => {
    // Calculate monthly payment
    const monthlyInterestRate = interestRate / 100 / 12;
    const numerator = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, term);
    const denominator = Math.pow(1 + monthlyInterestRate, term) - 1;
    
    if (denominator === 0) {
      setMonthlyPayment(loanAmount / term);
    } else {
      const payment = numerator / denominator;
      setMonthlyPayment(payment);
      setTotalPayment(payment * term);
      setTotalInterest(payment * term - loanAmount);
    }
  }, [loanAmount, term, interestRate]);

  return (
    <Card title="Loan Calculator" className="mb-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="loan-amount" className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount (USD)
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <DollarSign size={16} />
            </div>
            <input
              type="range"
              id="loan-amount"
              min="100"
              max="10000"
              step="100"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 mt-6"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$100</span>
              <span>${loanAmount}</span>
              <span>$10,000</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
              Term (months)
            </label>
            <select
              id="term"
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
            </select>
          </div>

          <div>
            <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (%)
            </label>
            <select
              id="interest-rate"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="8">8%</option>
              <option value="10">10%</option>
              <option value="12">12%</option>
              <option value="15">15%</option>
              <option value="18">18%</option>
            </select>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Summary</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-white rounded border border-gray-100">
              <p className="text-xs text-gray-500">Monthly</p>
              <p className="text-lg font-bold text-blue-600">{formatCurrency(monthlyPayment, 'USD')}</p>
            </div>
            <div className="text-center p-2 bg-white rounded border border-gray-100">
              <p className="text-xs text-gray-500">Total Interest</p>
              <p className="text-lg font-bold text-amber-600">{formatCurrency(totalInterest, 'USD')}</p>
            </div>
            <div className="text-center p-2 bg-white rounded border border-gray-100">
              <p className="text-xs text-gray-500">Total Payment</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(totalPayment, 'USD')}</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            fullWidth
            leftIcon={<Calculator size={16} />}
          >
            Apply for This Loan
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">
            Instant decision • Funds delivered within 24hrs
          </p>
        </div>
      </div>
    </Card>
  );
};

export default LoanCalculator;