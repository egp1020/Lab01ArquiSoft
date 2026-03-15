package com.udea.banco2026v.mapper;

import com.udea.banco2026v.dto.TransactionDTO;
import com.udea.banco2026v.entity.Transaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    TransactionDTO toDTO(Transaction transaction);
    Transaction toEntity(TransactionDTO transactionDTO);
}
