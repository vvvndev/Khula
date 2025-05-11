import React from 'react';
import OpportunitiesList from '../components/investments/OpportunitiesList';
import PortfolioSummary from '../components/investments/PortfolioSummary';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { TrendingUp, Building, Users, ArrowRight, BadgeDollarSign } from 'lucide-react';

const Investments: React.FC = () => {
  const investmentCategories = [
    { name: 'Businesses', icon: <TrendingUp size={20} />, color: 'blue', count: 12 },
    { name: 'Property', icon: <Building size={20} />, color: 'green', count: 8 },
    { name: 'Funds', icon: <Users size={20} />, color: 'purple', count: 4 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Investments</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-6 text-white mb-6">
            <h2 className="text-xl font-bold mb-2">Grow Your Wealth</h2>
            <p className="mb-4 text-blue-50">Discover investment opportunities with potential returns of 10-15% per annum.</p>
            <div className="flex space-x-3">
              <Button variant="secondary">Browse Opportunities</Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">How It Works</Button>
            </div>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-4">Featured Opportunities</h2>
          <OpportunitiesList />

          <h2 className="text-lg font-medium text-gray-900 mb-4">Investment Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {investmentCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 rounded-full bg-${category.color}-100 text-${category.color}-600 mb-3`}>
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-medium mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{category.count} opportunities</p>
                  <Button
                    variant="text"
                    size="sm"
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Browse
                  </Button>
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
                  title: 'Browse Projects', 
                  description: 'Explore diverse investment opportunities across Zimbabwe.',
                  icon: <TrendingUp size={24} />
                },
                { 
                  step: 2, 
                  title: 'Invest Any Amount', 
                  description: 'Start with as little as $50 USD in your chosen ventures.',
                  icon: <BadgeDollarSign size={24} />
                },
                { 
                  step: 3, 
                  title: 'Track Performance', 
                  description: 'Monitor your investments and receive regular updates.',
                  icon: <Users size={24} />
                }
              ].map((step) => (
                <div key={step.step} className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
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
          <PortfolioSummary />
          
          <Card title="Success Stories">
            <div className="space-y-4">
              {[
                { 
                  name: 'Sunrise Farms', 
                  description: 'Agricultural business that expanded operations and increased yield by 40% with Khula investment.',
                  returnRate: 14,
                  image: 'SF'
                },
                { 
                  name: 'Tech Hub Harare', 
                  description: 'Office space development that now hosts 20+ tech startups in the capital city.',
                  returnRate: 12,
                  image: 'TH'
                }
              ].map((story, index) => (
                <div key={index} className="flex">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 flex-shrink-0">
                    {story.image}
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{story.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">{story.description}</p>
                    <p className="text-sm text-green-600 font-medium">{story.returnRate}% return</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card title="FAQs" className="mt-6">
            <div className="space-y-3">
              {[
                { 
                  question: 'How are investments vetted?', 
                  answer: 'Our team conducts thorough due diligence on all investment opportunities, including financial analysis, site visits, and background checks.' 
                },
                { 
                  question: 'What are the minimum investment amounts?', 
                  answer: 'Most opportunities start from $50 USD, making them accessible to all investors.' 
                },
                { 
                  question: 'How do I receive returns?', 
                  answer: 'Returns are paid directly to your Khula account based on the terms of each investment.' 
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

export default Investments;