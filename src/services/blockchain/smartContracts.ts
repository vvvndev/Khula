import Web3 from 'web3';

export class SmartContractService {
  private web3: Web3;
  private contractABI: any;
  private contractAddress: string;

  constructor() {
    this.web3 = new Web3(import.meta.env.VITE_BLOCKCHAIN_RPC_URL);
    this.contractAddress = import.meta.env.VITE_SMART_CONTRACT_ADDRESS;
    this.contractABI = {
      // Contract ABI would be defined here
    };
  }

  async createInvestmentPool(poolData: {
    name: string;
    target: number;
    minInvestment: number;
    maxInvestment: number;
    duration: number;
  }) {
    const contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
    
    return await contract.methods.createPool(
      poolData.name,
      this.web3.utils.toWei(poolData.target.toString()),
      this.web3.utils.toWei(poolData.minInvestment.toString()),
      this.web3.utils.toWei(poolData.maxInvestment.toString()),
      poolData.duration
    ).send({
      from: await this.web3.eth.getCoinbase(),
      gas: 3000000
    });
  }

  async investInPool(poolId: string, amount: number) {
    const contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
    
    return await contract.methods.invest(poolId).send({
      from: await this.web3.eth.getCoinbase(),
      value: this.web3.utils.toWei(amount.toString()),
      gas: 200000
    });
  }

  async getPoolDetails(poolId: string) {
    const contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
    return await contract.methods.getPool(poolId).call();
  }

  async withdrawReturns(poolId: string) {
    const contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
    
    return await contract.methods.withdrawReturns(poolId).send({
      from: await this.web3.eth.getCoinbase(),
      gas: 200000
    });
  }
}

export const smartContractService = new SmartContractService();