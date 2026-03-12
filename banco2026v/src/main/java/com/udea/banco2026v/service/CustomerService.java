package com.udea.banco2026v.service;

import com.udea.banco2026v.dto.CustomerDTO;
import com.udea.banco2026v.entity.Customer;
import com.udea.banco2026v.exception.NotFoundException;
import com.udea.banco2026v.mapper.CustomerMapper;
import com.udea.banco2026v.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Autowired
    public CustomerService(CustomerRepository customerRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    public List<CustomerDTO>  getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toDTO).toList();
    }

    public CustomerDTO getCustomerById(Long id) {
        return customerRepository.findById(id).map(customerMapper::toDTO)
                .orElseThrow(()-> new RuntimeException("Customer not found"));
    }

    //Servicio para encontrar el cliente a traves de su numero de cuenta
    public CustomerDTO getCustomerByAccountNumber(String accountNumber) {
    Customer customer = customerRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new NotFoundException("Account not found"));
    return customerMapper.toDTO(customer);
    }


    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Customer customer = customerMapper.toEntity(customerDTO);
        return customerMapper.toDTO(customerRepository.save(customer));
    }

    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        validateAccountNumberUnique(customerDTO.getAccountNumber(), id);

        customer.setAccountNumber(customerDTO.getAccountNumber());
        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setBalance(customerDTO.getBalance());

        Customer updatedCustomer = customerRepository.save(customer);
        return customerMapper.toDTO(updatedCustomer);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        if (customer.getBalance() != null && customer.getBalance() > 0) {
            throw new IllegalStateException("Cannot delete customer with positive balance");
        }

        customerRepository.delete(customer);
    }

    private void validateAccountNumberUnique(String accountNumber, Long currentCustomerId) {
        customerRepository.findByAccountNumber(accountNumber).ifPresent(existing -> {
            if (!existing.getId().equals(currentCustomerId)) {
                throw new IllegalArgumentException("Account number already exists");
            }
        });
    }
    
}
