package com.udea.banco2026v.dto;
import jakarta.validation.constraints.*;

public class CustomerDTO {

    private Long id;

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 50)
    private String firstName;

    @NotBlank(message = "El apellido es requerido")
    @Size(max = 50)
    private String lastName;

    @NotBlank(message = "El número de cuenta es requerido")
    @Pattern(regexp = "^[0-9]{6,20}$", message = "La cuenta debe tener entre 6 y 20 dígitos")
    private String accountNumber;

    @NotNull(message = "El saldo no puede ser nulo")
    @Min(value = 0, message = "El saldo no puede ser negativo")
    private Double balance;

    public CustomerDTO() {
    }

    public CustomerDTO(Long id, String firstName, String lastName, String accountNumber, Double balance) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}

