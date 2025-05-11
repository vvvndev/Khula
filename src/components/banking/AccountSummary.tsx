import React from 'react';
import { CreditCard, Send, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/currencyFormatter';

interface AccountSummaryProps {
  isLoading?: boolean;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ isLoading = false }) => {
  const accounts = [
    { id: 1, name: 'Main Account', balance: 2580.55, currency: 'USD', cardType: 'Visa', lastFour: '4582' },
    { id: 2, name: 'Savings', balance: 15420.00, currency: 'ZWL', cardType: 'Local', lastFour: '7291' }
  ];

  const recentTransactions = [
    { id: 1, type: 'credit', description: 'Deposit from EcoCash', amount: 850.00, currency: 'USD', date: '2025-03-15' },
    { id: 2, type: 'debit', description: 'Grocery Shopping', amount: 125.35, currency: 'USD', date: '2025-03-14' },
    { id: 3, type: 'credit', description: 'Loan Payout', amount: 1500.00, currency: 'USD', date: '2025-03-10' }
  ];

  return (
    <div className="space-y-6">
      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map(account => (
          <Card 
            key={account.id} 
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white h-44 relative overflow-hidden"
            isLoading={isLoading}
          >
            {!isLoading && (
              <>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-bl-full opacity-30"></div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">{account.name}</p>
                    <p className="text-2xl font-bold mt-1">
                      {formatCurrency(account.balance, account.currency)}
                    </p>
                  </div>
                  <CreditCard className="text-blue-200" size={24} />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-blue-100 mb-1">Card</p>
                      <p className="text-sm font-medium">{account.cardType} •••• {account.lastFour}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
                        leftIcon={<Send size={14} />}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card 
        title="Recent Transactions" 
        isLoading={isLoading}
        footer={
          <div className="flex justify-center">
            <Button variant="text" size="sm">View All Transactions</Button>
          </div>
        }
      >
        <div className="divide-y divide-gray-100">
          {recentTransactions.map(transaction => (
            <div key={transaction.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`mr-3 p-2 rounded-full ${
                  transaction.type === 'credit' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'credit' 
                    ? <ArrowDownCircle size={16} /> 
                    : <ArrowUpCircle size={16} />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'} 
                {formatCurrency(transaction.amount, transaction.currency)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AccountSummary;