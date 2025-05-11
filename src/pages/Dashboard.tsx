import React from 'react';
import { PiggyBank, BarChart2, CreditCard, Plus } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import AccountSummary from '../components/banking/AccountSummary';
import LoanStatus from '../components/microfinance/LoanStatus';
import PortfolioSummary from '../components/investments/PortfolioSummary';
import { formatCurrency } from '../utils/currencyFormatter';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Total Balance', value: 17850.55, currency: 'USD', icon: <CreditCard size={20} />, color: 'blue' },
    { title: 'Active Loans', value: 2500, currency: 'USD', icon: <PiggyBank size={20} />, color: 'green' },
    { title: 'Investments', value: 4500, currency: 'USD', icon: <BarChart2 size={20} />, color: 'purple' }
  ];

  const recentActivity = [
    { id: 1, type: 'transfer', description: 'Transfer to John M.', amount: -250, currency: 'USD', date: '2025-03-17' },
    { id: 2, type: 'investment', description: 'Sunrise Farms Investment', amount: -500, currency: 'USD', date: '2025-03-15' },
    { id: 3, type: 'deposit', description: 'Salary Deposit', amount: 2800, currency: 'USD', date: '2025-03-01' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button 
          variant="outline" 
          size="sm"
          leftIcon={<Plus size={16} />}
        >
          New Transaction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-xl font-bold">
                  {formatCurrency(stat.value, stat.currency)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AccountSummary />
          <PortfolioSummary />
        </div>
        <div>
          <LoanStatus />
          <Card title="Recent Activity">
            <div className="divide-y divide-gray-100">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="py-3 flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  <div className={`text-sm font-medium ${
                    activity.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(Math.abs(activity.amount), activity.currency)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <Button variant="text" size="sm">View All Activity</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;