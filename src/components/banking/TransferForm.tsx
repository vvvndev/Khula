import React, { useState } from 'react';
import { Send, ChevronsRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const TransferForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // Reset form or show success
      setAmount('');
      setRecipient('');
      setPurpose('');
      // Here we'd handle the actual transfer logic
    }, 1500);
  };

  const recentRecipients = [
    { id: 1, name: 'John Makoni', account: '••3945', avatar: 'JM' },
    { id: 2, name: 'Sarah Moyo', account: '••1284', avatar: 'SM' },
    { id: 3, name: 'David Tande', account: '••7623', avatar: 'DT' }
  ];

  return (
    <Card title="Transfer Funds" className="mb-6">
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3">Recent Recipients</p>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {recentRecipients.map(recipient => (
            <button
              key={recipient.id}
              className="flex flex-col items-center min-w-[80px]"
              onClick={() => setRecipient(recipient.name)}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                {recipient.avatar}
              </div>
              <p className="text-xs font-medium text-gray-900 whitespace-nowrap">{recipient.name}</p>
              <p className="text-xs text-gray-500">{recipient.account}</p>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Name or account number"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="w-24">
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD</option>
                <option value="ZWL">ZWL</option>
                <option value="ZAR">ZAR</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
              Purpose (optional)
            </label>
            <input
              type="text"
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Rent payment"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              leftIcon={<Send size={16} />}
              isLoading={isProcessing}
            >
              Transfer Funds
            </Button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Secure transfer via Bhadala <ChevronsRight size={12} className="inline" />
            </p>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default TransferForm;