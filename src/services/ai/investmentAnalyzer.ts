import * as tf from '@tensorflow/tfjs';

export class InvestmentAnalyzer {
  private model: tf.LayersModel | null = null;

  async initialize() {
    this.model = await tf.loadLayersModel('/models/investment-analyzer.json');
  }

  async analyzeInvestment(data: {
    amount: number;
    term: number;
    sector: string;
    historicalReturns: number[];
    marketConditions: number[];
  }): Promise<{
    riskScore: number;
    expectedReturn: number;
    confidence: number;
  }> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const input = tf.tensor2d([
      [
        data.amount,
        data.term,
        ...this.encodeSector(data.sector),
        ...data.historicalReturns,
        ...data.marketConditions
      ]
    ]);

    const prediction = this.model.predict(input) as tf.Tensor;
    const [riskScore, expectedReturn, confidence] = await prediction.data();

    return {
      riskScore: Math.round(riskScore * 100) / 100,
      expectedReturn: Math.round(expectedReturn * 100) / 100,
      confidence: Math.round(confidence * 100) / 100
    };
  }

  private encodeSector(sector: string): number[] {
    const sectors = ['agriculture', 'technology', 'real-estate', 'energy', 'finance'];
    return sectors.map(s => s === sector.toLowerCase() ? 1 : 0);
  }
}

export const investmentAnalyzer = new InvestmentAnalyzer();