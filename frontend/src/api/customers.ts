import { http } from './http';
import type { Customer, UpdateCustomerInput } from "./types";

// fetchCustomers
export async function fetchCustomers() : Promise<Customer[]> {
    const response = await fetch("/api/customers", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    

    if (!response.ok) {
        throw new Error("Error al obtener los clientes");
    }

    const data: Customer[] = await response.json();
    return data;
}

// fetchCustomerById
export async function fetchCustomerById(id: number): Promise<Customer> {
    const response = await fetch(`/api/customers/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Error al obtener el cliente");
    }

    const data: Customer = await response.json();
    return data;
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
