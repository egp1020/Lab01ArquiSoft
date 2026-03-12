import { http } from './http';
import type { Customer, UpdateCustomerInput } from "./types";

// fetchCustomers
export async function fetchCustomers() : Promise<Customer[]> {
    return http.get<Customer[]>("/customers");
}

// fetchCustomerById
export async function fetchCustomerById(id: number): Promise<Customer> {
    return http.get<Customer>(`/customers/${id}`);
}

// fetchCustomerByAccount
export async function fetchCustomerByAccount(accountNumber: string): Promise<Customer> {
    return http.get<Customer>(`/customers/account/${accountNumber}`);
}

// updateCustomer
export async function updateCustomer(
    id: number,
    input: UpdateCustomerInput
): Promise<Customer> {
    return http.put<Customer>(`/customers/${id}`, input);
}

// deleteCustomer
export async function deleteCustomer(id: number): Promise<void> {
    return http.delete<void>(`/customers/${id}`);
}
