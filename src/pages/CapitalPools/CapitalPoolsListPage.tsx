import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../services/supabaseClient';
import { PlusCircle, TrendingUp, Users, Building } from 'lucide-react';

interface CapitalPool {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  currency: string;
  short_description: string;
  status: string;
  created_at: string;
  ai_risk_score?: number;
  ai_risk_category?: string;
}

function CapitalPoolsListPage() {
  const { t } = useTranslation();
  const [pools, setPools] = useState<CapitalPool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('capital_pools')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setPools(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPools();
  }, []);

  const getRiskBadge = (category?: string) => {
    if (!category) return null;
    
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">{t('loading')}...</div>;
  }

  if (error) {
    return <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('capitalPools')}</h1>
        <Link
          to="/pools/propose"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          {t('pools.createTitle')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool) => {
          const progress = (pool.current_amount / pool.target_amount) * 100;
          
          return (
            <Link
              key={pool.id}
              to={`/pools/${pool.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{pool.name}</h3>
                    <p className="text-sm text-gray-500">{pool.short_description}</p>
                  </div>
                  {pool.ai_risk_category && (
                    <div className="ml-4">
                      {getRiskBadge(pool.ai_risk_category)}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">{t('pools.targetAmount')}</span>
                      <span className="font-medium">
                        {pool.currency} {pool.target_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-500">
                        {pool.currency} {pool.current_amount.toLocaleString()} {t('pools.funded')}
                      </span>
                      <span className="text-gray-500">{progress.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {new Date(pool.created_at).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center text-sm font-medium text-green-600">
                      {t('common.viewDetails')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {pools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">{t('pools.noPoolsAvailable')}</p>
          <Link
            to="/pools/propose"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            {t('pools.createTitle')}
          </Link>
        </div>
      )}
    </div>
  );
}

export default CapitalPoolsListPage;