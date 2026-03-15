package com.udea.banco2026v.service;

import com.udea.banco2026v.dto.CustomerDTO;
import com.udea.banco2026v.entity.Customer;
import com.udea.banco2026v.exception.NotFoundException;
import com.udea.banco2026v.mapper.CustomerMapper;
import com.udea.banco2026v.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(CustomerRepository customerRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    public List<CustomerDTO>  getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toDTO).toList();
    }

    public CustomerDTO getCustomerById(Long id) {
        return customerRepository.findById(id)
                .map(customerMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Cliente con id " + id + " no encontrado"));
    }

    public CustomerDTO getCustomerByAccountNumber(String accountNumber) {
        Customer customer = customerRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new NotFoundException("Cuenta " + accountNumber + " no encontrada"));
        return customerMapper.toDTO(customer);
    }

    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        customerRepository.findByAccountNumber(customerDTO.getAccountNumber())
                .ifPresent(c -> {
                    throw new IllegalArgumentException("El número de cuenta ya está en uso");
                });
        Customer customer = customerMapper.toEntity(customerDTO);
        return customerMapper.toDTO(customerRepository.save(customer));
    }

    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente con id " + id + " no encontrado"));

        customerRepository.findByAccountNumber(customerDTO.getAccountNumber())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> {
                    throw new IllegalArgumentException("El número de cuenta ya está en uso");
                });

        customer.setAccountNumber(customerDTO.getAccountNumber());
        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setBalance(customerDTO.getBalance());

        return customerMapper.toDTO(customerRepository.save(customer));
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente con id " + id + " no encontrado"));

        if (customer.getBalance() != null && customer.getBalance() > 0) {
            throw new IllegalStateException("No se puede eliminar un cliente con saldo positivo");
        }

        customerRepository.delete(customer);
    }
}
