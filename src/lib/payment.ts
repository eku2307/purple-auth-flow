import { apiClient } from './api';

export interface SendPaymentRequest {
  recipientUpiId: string;
  amount: number;
  description?: string;
}

export interface Transaction {
  transactionId: string;
  senderId: string;
  recipientId: string;
  amount: number;
  status: string;
  timestamp: string;
  description?: string;
}

export const paymentService = {
  async sendPayment(payment: SendPaymentRequest): Promise<any> {
    return apiClient.post('/payments/send', payment);
  },

  async getTransactions(): Promise<Transaction[]> {
    return apiClient.get<Transaction[]>('/payments/transactions');
  }
};
