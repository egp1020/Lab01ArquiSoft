package com.udea.banco2026v.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequestDTO {

    @NotBlank(message = "La cuenta del remitente es obligatoria")
    private String senderAccountNumber;

    @NotBlank(message = "La cuenta del receptor es obligatoria")
    private String receiverAccountNumber;

    @NotNull(message = "El monto es obligatorio")
    @Positive(message = "El monto debe ser mayor que cero")
    private Double amount;

    @NotBlank(message = "La clave de idempotencia es obligatoria")
    @Size(min = 36, max = 36, message = "La clave de idempotencia debe ser un UUID v4 (36 caracteres)")
    private String idempotencyKey;
}