package com.udea.banco2026v.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name="customers")
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String accountNumber;
    
    @Column(nullable = false, length = 50)
    private String firstName;  //firstName VARCHAR(50)  NOT NULL;
    @Column(nullable = false, length = 50)
    private String lastName;
    @Column(nullable = false)
    private Double balance;

    public Customer() {
    }
    
    /*
    *   Customer{
    *      "id":1233,
    *      "accountNumber": "44433345454",
    *      "firstName":"Diego",
    *      "lastName": "Botia",
    *      "balance": 3233
    * }  
    * 
    * */
    @JsonCreator
    public Customer(@JsonProperty("id") Long id,
                    @JsonProperty("accountNumber") String accountNumber, 
                    @JsonProperty("firstName") String firstName,
                    @JsonProperty("lastName") String lastName, 
                    @JsonProperty("balance") Double balance) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.firstName = firstName; 
        this.lastName = lastName;
        this.balance = balance;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}


