import React from 'react';
import LoanCalculator from '../components/microfinance/LoanCalculator';
import LoanStatus from '../components/microfinance/LoanStatus';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/currencyFormatter';
import { FileText, BadgeCheck, Clock, BarChartHorizontal } from 'lucide-react';

const Microfinance: React.FC = () => {
  const loanProducts = [
    { 
      id: 1, 
      name: 'Personal Loan', 
      description: 'Quick access to funds for personal needs',
      minAmount: 200,
      maxAmount: 5000,
      currency: 'USD',
      interestRate: 12,
      maxTerm: 24,
      requirements: ['Valid ID', 'Proof of income', '3 months bank statements']
    },
    { 
      id: 2, 
      name: 'Business Loan', 
      description: 'Financing for business growth and operations',
      minAmount: 1000,
      maxAmount: 50000,
      currency: 'USD',
      interestRate: 15,
      maxTerm: 36,
      requirements: ['Business registration', 'Financial statements', 'Business plan']
    },
    { 
      id: 3, 
      name: 'Agricultural Loan', 
      description: 'Specialized loans for farming and agriculture',
      minAmount: 500,
      maxAmount: 25000,
      currency: 'USD',
      interestRate: 10,
      maxTerm: 24,
      requirements: ['Proof of land ownership/lease', 'Farming history', 'Harvest projections']
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Microfinance</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-xl p-6 text-white mb-6">
            <h2 className="text-xl font-bold mb-2">Need financial support?</h2>
            <p className="mb-4 text-green-50">Access quick loans with competitive rates and flexible terms.</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="flex items-center justify-center mb-2">
                  <Clock size={24} />
                </div>
                <p className="text-sm text-center">Fast approval</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="flex items-center justify-center mb-2">
                  <BadgeCheck size={24} />
                </div>
                <p className="text-sm text-center">Low interest</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="flex items-center justify-center mb-2">
                  <BarChartHorizontal size={24} />
                </div>
                <p className="text-sm text-center">Flexible terms</p>
              </div>
            </div>
            <Button variant="secondary">Apply Now</Button>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-4">Loan Products</h2>

          <div className="space-y-4 mb-6">
            {loanProducts.map((product) => (
              <Card key={product.id}>
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:flex-1 mb-4 md:mb-0 md:mr-4">
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
                        <FileText size={20} />
                      </div>
                      <h3 className="text-lg font-medium">{product.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-3">{product.description}</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-medium">
                          {formatCurrency(product.minAmount, product.currency)} - {formatCurrency(product.maxAmount, product.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Interest Rate</p>
                        <p className="font-medium">{product.interestRate}% p.a.</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Term</p>
                        <p className="font-medium">Up to {product.maxTerm} months</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-40 flex md:flex-col gap-2">
                    <Button variant="primary" size="sm" className="flex-1">Apply</Button>
                    <Button variant="outline" size="sm" className="flex-1">Details</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-4">How It Works</h2>
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  step: 1, 
                  title: 'Apply Online', 
                  description: 'Fill out our simple application form with your details.',
                  icon: <FileText size={24} />
                },
                { 
                  step: 2, 
                  title: 'Quick Approval', 
                  description: 'Get a decision within 24 hours of application.',
                  icon: <Clock size={24} />
                },
                { 
                  step: 3, 
                  title: 'Receive Funds', 
                  description: 'Funds disbursed directly to your Khula account.',
                  icon: <BadgeCheck size={24} />
                }
              ].map((step) => (
                <div key={step.step} className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-medium mb-2">Step {step.step}: {step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <LoanStatus />
          <LoanCalculator />
          
          <Card title="FAQs">
            <div className="space-y-3">
              {[
                { 
                  question: 'What documents do I need to apply?', 
                  answer: 'You will need a valid ID, proof of income, and 3 months of bank statements for most loans.' 
                },
                { 
                  question: 'How long does approval take?', 
                  answer: 'Most applications are processed within 24 hours, with funds available immediately after approval.' 
                },
                { 
                  question: 'Can I repay my loan early?', 
                  answer: 'Yes, you can repay your loan early with no prepayment penalties.' 
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-3">
                  <h4 className="font-medium mb-1">{faq.question}</h4>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Microfinance;