import React from 'react';
import { ClipboardCheck, Clock, BadgeCheck } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/currencyFormatter';

interface Loan {
  id: string;
  amount: number;
  currency: string;
  dateApplied: string;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'rejected';
  nextPayment?: {
    amount: number;
    dueDate: string;
  };
  progress?: number; // percentage completed
}

const LoanStatus: React.FC = () => {
  const loans: Loan[] = [
    {
      id: 'L-2025-0012',
      amount: 2500,
      currency: 'USD',
      dateApplied: '2025-02-18',
      status: 'active',
      nextPayment: {
        amount: 438.75,
        dueDate: '2025-04-18'
      },
      progress: 33
    },
    {
      id: 'L-2025-0008',
      amount: 500,
      currency: 'USD',
      dateApplied: '2025-03-10',
      status: 'pending'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: <Clock size={14} className="mr-1" /> 
      },
      approved: { 
        color: 'bg-green-100 text-green-800', 
        icon: <BadgeCheck size={14} className="mr-1" /> 
      },
      active: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: <ClipboardCheck size={14} className="mr-1" /> 
      },
      completed: { 
        color: 'bg-gray-100 text-gray-800', 
        icon: <BadgeCheck size={14} className="mr-1" /> 
      },
      rejected: { 
        color: 'bg-red-100 text-red-800', 
        icon: <Clock size={14} className="mr-1" /> 
      }
    };

    const { color, icon } = statusMap[status] || statusMap.pending;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${color}`}>
        {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Card title="Your Loans" className="mb-6">
      {loans.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You don't have any active loans</p>
          <Button variant="primary" size="sm">Apply for a Loan</Button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {loans.map((loan) => (
            <div key={loan.id} className="py-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">Loan {loan.id}</p>
                  <p className="text-xs text-gray-500">Applied: {loan.dateApplied}</p>
                </div>
                <div>
                  {getStatusBadge(loan.status)}
                </div>
              </div>
              
              <div className="text-lg font-bold mb-2">
                {formatCurrency(loan.amount, loan.currency)}
              </div>
              
              {loan.status === 'active' && loan.progress !== undefined && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{loan.progress}% paid</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${loan.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {loan.status === 'active' && loan.nextPayment && (
                <div className="bg-blue-50 rounded p-3 mt-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-blue-700">Next Payment</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(loan.nextPayment.amount, loan.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-700">Due Date</p>
                      <p className="text-sm font-medium">{loan.nextPayment.dueDate}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-3">
                <Button
                  variant={loan.status === 'active' ? 'primary' : 'outline'}
                  size="sm"
                  fullWidth
                >
                  {loan.status === 'active' ? 'Make Payment' : 'View Details'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default LoanStatus;