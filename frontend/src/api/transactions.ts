import { http } from './http';
import type { CreateTransferInput, Transaction } from './types';

export async function createTransfer(input: CreateTransferInput): Promise<Transaction> {
    return http.post<Transaction>('/transactions', input);
}

export async function fetchTransactionsByAccount(accountNumber: string): Promise<Transaction[]> {
    return http.get<Transaction[]>(`/transactions/${accountNumber}`);
}
