import React from 'react';
import { LineChart, PieChart, DollarSign, TrendingUp } from 'lucide-react';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/currencyFormatter';

const PortfolioSummary: React.FC = () => {
  const portfolioData = {
    totalInvested: 4500,
    returns: 642.50,
    currency: 'USD',
    returnRate: 14.3,
    investments: [
      { name: 'Businesses', amount: 2500, percentage: 55.6, color: 'bg-blue-500' },
      { name: 'Property', amount: 1500, percentage: 33.3, color: 'bg-green-500' },
      { name: 'Funds', amount: 500, percentage: 11.1, color: 'bg-purple-500' }
    ]
  };

  return (
    <Card title="Investment Portfolio" className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600 mr-3">
              <DollarSign size={20} />
            </div>
            <p className="text-sm font-medium text-gray-700">Total Invested</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(portfolioData.totalInvested, portfolioData.currency)}
          </p>
          <div className="mt-2 flex items-center text-xs">
            <p className="text-green-600 flex items-center">
              <TrendingUp size={14} className="mr-1" />
              +{portfolioData.returnRate}% ROI
            </p>
            <p className="ml-2 text-gray-500">
              Returns: {formatCurrency(portfolioData.returns, portfolioData.currency)}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-gray-100 rounded-full text-gray-600 mr-3">
              <PieChart size={20} />
            </div>
            <p className="text-sm font-medium text-gray-700">Allocation</p>
          </div>
          <div className="flex h-20">
            <div className="flex-1 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="h-4 w-full flex rounded-full overflow-hidden">
                  {portfolioData.investments.map((inv, index) => (
                    <div 
                      key={index} 
                      className={`${inv.color}`} 
                      style={{ width: `${inv.percentage}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 mt-4">
            {portfolioData.investments.map((inv, index) => (
              <div key={index} className="text-center">
                <div className={`h-3 w-3 ${inv.color} rounded-full mx-auto mb-1`}></div>
                <p className="text-xs font-medium">{inv.name}</p>
                <p className="text-xs text-gray-500">{inv.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center">
            <div className="p-1 bg-blue-100 rounded-full text-blue-600 mr-2">
              <LineChart size={16} />
            </div>
            <p className="text-sm font-medium text-gray-700">Performance History</p>
          </div>
        </div>
        <div className="p-4">
          <div className="h-40 flex items-end space-x-2">
            {[35, 45, 30, 65, 40, 75, 55, 60, 80, 90, 70, 85].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 hover:bg-blue-600 transition-all rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
                <p className="text-xs text-gray-500 mt-1">
                  {index + 1}
                </p>
              </div>
            ))}
          </div>
          <div className="text-xs text-center text-gray-500 mt-2">Last 12 Months</div>
        </div>
      </div>
    </Card>
  );
};

export default PortfolioSummary;