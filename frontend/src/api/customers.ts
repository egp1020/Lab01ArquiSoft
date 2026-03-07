import { http } from './http';
import type { Customer, UpdateCustomerInput } from "./types";

// fetchCustomers
export async function fetchCustomers() {
}

// fetchCustomerById
export async function fetchCustomerById() {
}

// updateCustomer
export async function updateCustomer(
    id: number,
    input: UpdateCustomerInput
): Promise<Customer> {
    return http.put<Customer>(`/customers/${id}`, input)
}

// deleteCustomer
export async function deleteCustomer(id: number): Promise<void> {
    return http.delete<void>(`/customers/${id}`)
}
