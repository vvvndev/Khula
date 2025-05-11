import React from 'react';
import { TrendingUp, Users, Building, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/currencyFormatter';

interface Investment {
  id: string;
  name: string;
  type: 'business' | 'property' | 'fund';
  description: string;
  amount: number;
  raised: number;
  currency: string;
  returnRate: number;
  term: number;
  risk: 'low' | 'medium' | 'high';
  category?: string;
  backers?: number;
}

const OpportunitiesList: React.FC = () => {
  const investments: Investment[] = [
    {
      id: 'INV-001',
      name: 'Sunrise Farms Expansion',
      type: 'business',
      description: 'Agricultural business expanding operations in Mashonaland East',
      amount: 25000,
      raised: 18500,
      currency: 'USD',
      returnRate: 14,
      term: 24,
      risk: 'medium',
      category: 'Agriculture',
      backers: 32
    },
    {
      id: 'INV-002',
      name: 'Harare Tech Hub',
      type: 'property',
      description: 'Office space development for tech startups in Harare CBD',
      amount: 50000,
      raised: 32000,
      currency: 'USD',
      returnRate: 12,
      term: 36,
      risk: 'low',
      category: 'Real Estate',
      backers: 58
    },
    {
      id: 'INV-003',
      name: 'Zimbabwe Growth Fund',
      type: 'fund',
      description: 'Diversified fund investing in high-growth SMEs across Zimbabwe',
      amount: 100000,
      raised: 85000,
      currency: 'USD',
      returnRate: 10,
      term: 48,
      risk: 'low',
      category: 'Diversified',
      backers: 124
    }
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case 'business':
        return <TrendingUp size={20} />;
      case 'property':
        return <Building size={20} />;
      case 'fund':
        return <Users size={20} />;
      default:
        return <TrendingUp size={20} />;
    }
  };

  const getRiskBadge = (risk: string) => {
    const riskMap: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${riskMap[risk]}`}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
      </span>
    );
  };

  return (
    <Card title="Investment Opportunities" className="mb-6">
      <div className="divide-y divide-gray-100">
        {investments.map((investment) => (
          <div key={investment.id} className="py-4">
            <div className="flex items-start">
              <div className={`mr-3 p-2 rounded-lg text-blue-600 bg-blue-100`}>
                {getIconForType(investment.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-base font-medium text-gray-900">{investment.name}</h4>
                  {getRiskBadge(investment.risk)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{investment.description}</p>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Return Rate</p>
                    <p className="text-sm font-medium text-green-600">{investment.returnRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Term</p>
                    <p className="text-sm font-medium">{investment.term} months</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-medium">{investment.category}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>
                      {formatCurrency(investment.raised, investment.currency)} of {formatCurrency(investment.amount, investment.currency)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(investment.raised / investment.amount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span>{Math.round((investment.raised / investment.amount) * 100)}% funded</span>
                    {investment.backers && <span className="ml-2">• {investment.backers} backers</span>}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight size={16} />}
                >
                  View Opportunity
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Button variant="text" size="sm">
          View All Opportunities
        </Button>
      </div>
    </Card>
  );
};

export default OpportunitiesList;