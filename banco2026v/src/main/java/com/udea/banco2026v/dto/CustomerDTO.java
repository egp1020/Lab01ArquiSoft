package com.udea.banco2026v.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
}

