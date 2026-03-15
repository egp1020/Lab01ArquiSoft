package com.udea.banco2026v.controller;

import com.udea.banco2026v.dto.CustomerDTO;
import com.udea.banco2026v.service.CustomerService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerFacade;

    public CustomerController(CustomerService customerFacade) {
        this.customerFacade = customerFacade;
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        return ResponseEntity.ok(customerFacade.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable @Positive Long id) {
        return ResponseEntity.ok(customerFacade.getCustomerById(id));
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> createCustomer(
            @Valid @RequestBody CustomerDTO customerDTO
    ) {
        return ResponseEntity.ok(customerFacade.createCustomer(customerDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(
            @PathVariable @Positive Long id,
            @Valid @RequestBody CustomerDTO customerDTO
    ) {
        return ResponseEntity.ok(customerFacade.updateCustomer(id, customerDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable @Positive Long id){
        customerFacade.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<CustomerDTO> getCustomerByAccountNumber(
            @PathVariable String accountNumber
    ) {
        CustomerDTO customer = customerFacade.getCustomerByAccountNumber(accountNumber);
        return ResponseEntity.ok(customer);
    }
}