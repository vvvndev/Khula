import React from 'react';
import AccountSummary from '../components/banking/AccountSummary';
import TransferForm from '../components/banking/TransferForm';
import Card from '../components/common/Card';
import { CreditCard, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency } from '../utils/currencyFormatter';

const Banking: React.FC = () => {
  const scheduledPayments = [
    { id: 1, name: 'Rent Payment', amount: 650, currency: 'USD', date: '2025-04-01', recurrent: true },
    { id: 2, name: 'Internet Bill', amount: 85, currency: 'USD', date: '2025-03-25', recurrent: true },
    { id: 3, name: 'Loan Repayment', amount: 438.75, currency: 'USD', date: '2025-04-18', recurrent: true }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Banking</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AccountSummary />

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { id: 1, name: 'Transfer to John M.', date: '2025-03-17', category: 'Transfer Out', amount: -250, currency: 'USD', type: 'debit' },
                      { id: 2, name: 'Grocery Shopping', date: '2025-03-16', category: 'Shopping', amount: -125.35, currency: 'USD', type: 'debit' },
                      { id: 3, name: 'Deposit from EcoCash', date: '2025-03-15', category: 'Deposit', amount: 850, currency: 'USD', type: 'credit' },
                      { id: 4, name: 'Internet Bill', date: '2025-03-10', category: 'Utilities', amount: -85, currency: 'USD', type: 'debit' },
                      { id: 5, name: 'Salary Deposit', date: '2025-03-01', category: 'Income', amount: 2800, currency: 'USD', type: 'credit' },
                    ].map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`mr-3 p-2 rounded-full ${
                              transaction.type === 'credit' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {transaction.type === 'credit' 
                                ? <ArrowDownLeft size={16} /> 
                                : <ArrowUpRight size={16} />
                              }
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {transaction.category}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                          transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount >= 0 ? '+' : ''}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        <div>
          <TransferForm />

          <Card title="Scheduled Payments" className="mb-6">
            {scheduledPayments.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No scheduled payments</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {scheduledPayments.map((payment) => (
                  <div key={payment.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-full mr-3">
                        {payment.recurrent ? <Clock size={16} /> : <CreditCard size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payment.name}</p>
                        <p className="text-xs text-gray-500">Due: {payment.date}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Banking Services">
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Statement', icon: <CreditCard size={20} /> },
                { name: 'Card Management', icon: <CreditCard size={20} /> },
                { name: 'Standing Orders', icon: <Clock size={20} /> },
                { name: 'Currency Exchange', icon: <ArrowUpRight size={20} /> }
              ].map((service, idx) => (
                <button
                  key={idx}
                  className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <div className="mx-auto w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                    {service.icon}
                  </div>
                  <p className="text-sm font-medium">{service.name}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Banking;