export type ApiError = {
  timestamp: string;
  status: number;
  error: string;
  code: string;
  message: string;
  path: string;
};

export type Customer = {
  id: number;
  accountNumber: string;
  firstName: string;
  lastName: string;
  balance: number | string;
};

export type UpdateCustomerInput = {
  accountNumber: string;
  firstName: string;
  lastName: string;
  balance: number;
};

export type Transaction = {
  id: number;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number | string;
  timestamp: string;
};

export type CreateTransferInput = {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
};