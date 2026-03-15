package com.udea.banco2026v.service;


import com.udea.banco2026v.dto.TransactionDTO;
import com.udea.banco2026v.dto.TransferRequestDTO;
import com.udea.banco2026v.entity.Customer;
import com.udea.banco2026v.entity.Transaction;
import com.udea.banco2026v.exception.NotFoundException;
import com.udea.banco2026v.mapper.TransactionMapper;
import com.udea.banco2026v.repository.CustomerRepository;
import com.udea.banco2026v.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class TransactionService {

    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;

    public TransactionService(
            CustomerRepository customerRepository,
            TransactionRepository transactionRepository,
            TransactionMapper transactionMapper
    ){
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
        this.transactionMapper = transactionMapper;
    }

    @Transactional
    public TransactionDTO transferMoney(TransferRequestDTO request) {
        Optional<Transaction> existing =
                transactionRepository.findByIdempotencyKey(request.getIdempotencyKey());
        if (existing.isPresent()) {
            return transactionMapper.toDTO(existing.get());
        }

        String senderAccount = request.getSenderAccountNumber().trim();
        String receiverAccount = request.getReceiverAccountNumber().trim();

        if (senderAccount.equals(receiverAccount)) {
            throw new IllegalArgumentException("La cuenta de origen y destino no pueden ser la misma");
        }

        Customer sender = customerRepository.findByAccountNumber(senderAccount)
                .orElseThrow(() -> new NotFoundException("La cuenta del remitente no existe"));

        Customer receiver = customerRepository.findByAccountNumber(receiverAccount)
                .orElseThrow(() -> new NotFoundException("La cuenta del receptor no existe"));

        if (sender.getBalance() < request.getAmount()) {
            throw new IllegalStateException("Saldo insuficiente en la cuenta del remitente");
        }

        sender.setBalance(sender.getBalance() - request.getAmount());
        receiver.setBalance(receiver.getBalance() + request.getAmount());

        customerRepository.save(sender);
        customerRepository.save(receiver);

        Transaction transaction = new Transaction();
        transaction.setSenderAccountNumber(senderAccount);
        transaction.setReceiverAccountNumber(receiverAccount);
        transaction.setAmount(request.getAmount());
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setIdempotencyKey(request.getIdempotencyKey());

        return transactionMapper.toDTO(transactionRepository.save(transaction));
    }

    public List<TransactionDTO> getTransactionsForAccount(String accountNumber) {
        return transactionRepository
                .findBySenderAccountNumberOrReceiverAccountNumber(accountNumber, accountNumber)
                .stream()
                .map(transactionMapper::toDTO)
                .toList();
    }
}
