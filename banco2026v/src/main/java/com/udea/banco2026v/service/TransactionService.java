package com.udea.banco2026v.service;


import com.udea.banco2026v.dto.TransactionDTO;
import com.udea.banco2026v.entity.Customer;
import com.udea.banco2026v.entity.Transaction;
import com.udea.banco2026v.repository.CustomerRepository;
import com.udea.banco2026v.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CustomerRepository customerRepository; // Para validar cuentas

    public TransactionDTO transferMoney(TransactionDTO transactionDTO) {
        // Validar que los números de cuenta no sean nulos
        if (transactionDTO.getSenderAccountNumber() == null || transactionDTO.getReceiverAccountNumber() == null) {
            throw new IllegalArgumentException("Los números de cuenta del remitente y receptor son obligatorios.");
        }

        // Buscar los clientes por número de cuenta
        Customer sender = customerRepository.findByAccountNumber(transactionDTO.getSenderAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("La cuenta del remitente no existe."));
        Customer receiver = customerRepository.findByAccountNumber(transactionDTO.getReceiverAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("La cuenta del receptor no existe."));
//    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));

        //Nueva verificacion 
        //Validar que el remitente no ingrese un saldo negativo
        if (transactionDTO.getAmount() <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor que cero");
        }

        // Validar que el remitente no ingrese un numero negativo y tenga saldo suficiente
        
        if (sender.getBalance() < transactionDTO.getAmount()) {
            throw new IllegalArgumentException("Saldo insuficiente en la cuenta del remitente.");
            //throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient balance");
        }

        // Realizar la transferencia
        sender.setBalance(sender.getBalance() - transactionDTO.getAmount());
        receiver.setBalance(receiver.getBalance() + transactionDTO.getAmount());

        // Guardar los cambios en las cuentas
        customerRepository.save(sender);
        customerRepository.save(receiver);


        // Crear y guardar la transacción
        Transaction transaction = new Transaction();
        transaction.setSenderAccountNumber(sender.getAccountNumber());
        transaction.setReceiverAccountNumber(receiver.getAccountNumber());
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setTimestamp(transactionDTO.getTimestamp());

        transaction = transactionRepository.save(transaction);

        // Devolver la transacción creada como DTO
        TransactionDTO savedTransaction = new TransactionDTO();
        savedTransaction.setId(transaction.getId());
        savedTransaction.setSenderAccountNumber(transaction.getSenderAccountNumber());
        savedTransaction.setReceiverAccountNumber(transaction.getReceiverAccountNumber());
        savedTransaction.setAmount(transaction.getAmount());
        savedTransaction.setTimestamp(transaction.getTimestamp());

        return savedTransaction;
    }

    public List<TransactionDTO> getTransactionsForAccount(String accountNumber) {
        List<Transaction> transactions = transactionRepository.findBySenderAccountNumberOrReceiverAccountNumber(accountNumber, accountNumber);
        return transactions.stream().map(transaction -> {
            TransactionDTO dto = new TransactionDTO();
            dto.setId(transaction.getId());
            dto.setSenderAccountNumber(transaction.getSenderAccountNumber());
            dto.setReceiverAccountNumber(transaction.getReceiverAccountNumber());
            dto.setAmount(transaction.getAmount());
            dto.setTimestamp(transaction.getTimestamp());
            return dto;
        }).collect(Collectors.toList());
    }
}