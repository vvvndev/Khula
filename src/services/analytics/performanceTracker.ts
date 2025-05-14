import { format } from 'date-fns';
import { supabase } from '../supabaseClient';
import Decimal from 'decimal.js';

export interface PerformanceMetric {
  investmentId: string;
  metricType: string;
  value: number;
  periodStart: Date;
  periodEnd: Date;
}

export class PerformanceTracker {
  async trackMetric(metric: PerformanceMetric) {
    const { data, error } = await supabase
      .from('performance_metrics')
      .insert({
        investment_id: metric.investmentId,
        metric_type: metric.metricType,
        value: new Decimal(metric.value).toFixed(4),
        period_start: format(metric.periodStart, 'yyyy-MM-dd\'T\'HH:mm:ssXXX'),
        period_end: format(metric.periodEnd, 'yyyy-MM-dd\'T\'HH:mm:ssXXX')
      });

    if (error) throw error;
    return data;
  }

  async getInvestmentPerformance(investmentId: string, period: 'day' | 'week' | 'month' | 'year') {
    const { data, error } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('investment_id', investmentId)
      .gte('period_start', this.getPeriodStart(period))
      .order('period_start', { ascending: true });

    if (error) throw error;
    return this.aggregateMetrics(data);
  }

  private getPeriodStart(period: 'day' | 'week' | 'month' | 'year'): string {
    const now = new Date();
    switch (period) {
      case 'day':
        return format(new Date(now.setDate(now.getDate() - 1)), 'yyyy-MM-dd');
      case 'week':
        return format(new Date(now.setDate(now.getDate() - 7)), 'yyyy-MM-dd');
      case 'month':
        return format(new Date(now.setMonth(now.getMonth() - 1)), 'yyyy-MM-dd');
      case 'year':
        return format(new Date(now.setFullYear(now.getFullYear() - 1)), 'yyyy-MM-dd');
    }
  }

  private aggregateMetrics(metrics: any[]) {
    return metrics.reduce((acc, metric) => {
      const date = format(new Date(metric.period_start), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = {
          totalValue: 0,
          count: 0
        };
      }
      acc[date].totalValue += parseFloat(metric.value);
      acc[date].count += 1;
      return acc;
    }, {});
  }
}

export const performanceTracker = new PerformanceTracker();