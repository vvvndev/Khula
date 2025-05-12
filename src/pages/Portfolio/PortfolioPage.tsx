import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../services/supabaseClient';
import useAuthStore from '../../store/authStore';
import { TrendingUp, ArrowUpRight, Wallet } from 'lucide-react';

interface Investment {
  id: string;
  type: 'pool' | 'venture';
  name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  estimated_value?: number;
}

function PortfolioPage() {
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalValue, setTotalValue] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) return;

      try {
        const { data: poolInvestments, error: poolError } = await supabase
          .from('pool_contributions')
          .select(`
            id,
            amount,
            currency,
            status,
            created_at,
            capital_pools (name)
          `)
          .eq('user_id', user.id);

        if (poolError) throw poolError;

        const { data: ventureInvestments, error: ventureError } = await supabase
          .from('venture_investments')
          .select(`
            id,
            amount,
            currency,
            status,
            created_at,
            direct_ventures (name)
          `)
          .eq('user_id', user.id);

        if (ventureError) throw ventureError;

        const formattedInvestments = [
          ...(poolInvestments || []).map((inv: any) => ({
            id: inv.id,
            type: 'pool' as const,
            name: inv.capital_pools?.name || 'Unknown Pool',
            amount: inv.amount,
            currency: inv.currency,
            status: inv.status,
            created_at: inv.created_at,
            estimated_value: inv.amount // Simple 1:1 for now
          })),
          ...(ventureInvestments || []).map((inv: any) => ({
            id: inv.id,
            type: 'venture' as const,
            name: inv.direct_ventures?.name || 'Unknown Venture',
            amount: inv.amount,
            currency: inv.currency,
            status: inv.status,
            created_at: inv.created_at,
            estimated_value: inv.amount // Simple 1:1 for now
          }))
        ];

        setInvestments(formattedInvestments);
        
        const invested = formattedInvestments.reduce((sum, inv) => sum + inv.amount, 0);
        const value = formattedInvestments.reduce((sum, inv) => sum + (inv.estimated_value || inv.amount), 0);
        
        setTotalInvested(invested);
        setTotalValue(value);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">{t('loading')}...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('portfolio.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{t('portfolio.totalInvested')}</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            USD {totalInvested.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{t('portfolio.currentValue')}</h2>
          </div>
          <p className="text-3xl font-bold text-green-600">
            USD {totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{t('portfolio.investments')}</h2>
        </div>

        {investments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('portfolio.investment')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('portfolio.type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('portfolio.invested')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('portfolio.currentValue')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('portfolio.status')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {investments.map((investment) => (
                  <tr key={investment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{investment.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(investment.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {investment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.currency} {investment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.currency} {(investment.estimated_value || investment.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {investment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/${investment.type}s/${investment.id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        {t('common.viewDetails')} <ArrowUpRight className="inline h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{t('portfolio.noInvestments')}</p>
            <div className="space-x-4">
              <Link
                to="/pools"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                {t('portfolio.explorePools')}
              </Link>
              <Link
                to="/ventures"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {t('portfolio.exploreVentures')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;