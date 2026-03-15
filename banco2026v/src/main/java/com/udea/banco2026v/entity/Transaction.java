package com.udea.banco2026v.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "sender_account_number", nullable = false)
    private String senderAccountNumber;
    @Column(name = "receiver_account_number", nullable = false)
    private String receiverAccountNumber;
    @Column(nullable = false)
    private Double amount;
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
    @Column(name = "idempotency_key", unique = true, nullable = false, length = 36)
    private String idempotencyKey;
}


