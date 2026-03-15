import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from 'react-router-dom';
import { fetchTransactionsByAccount } from "../../api/transactions";
import { ErrorNotice } from "../../components/ErrorNotice";
import { HistorySearch } from "../../components/HistorySearch";
import { TransactionsTable } from "../../components/TransactionsTable";

export function HistoryPage() {
  const [searchParams] = useSearchParams();
  const presetAccount = searchParams.get('account') ?? '';

  const [account, setAccount] = useState(presetAccount);
  const [searchAccount, setSearchAccount] = useState<string | null>(presetAccount);
  const [inputError, setInputError] = useState<string | null>(null);

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ["transactions", searchAccount],
    queryFn: () => fetchTransactionsByAccount(searchAccount!),
    enabled: !!searchAccount
  });

  const hasResults = transactions.length > 0;
  const showEmptyState = !isLoading && searchAccount && !hasResults;

  return (
    <section className="panel">
      <header className="panel__header">
        <h2>Histórico por Cliente</h2>
        <p>Consulta de movimientos asociados a una cuenta.</p>
      </header>

      <HistorySearch
        account={account}
        setAccount={setAccount}
        searchAccount={searchAccount}
        setSearchAccount={setSearchAccount}
        inputError={inputError}
        setInputError={setInputError}
      />

      {isLoading && (
        <p className="skeleton">Cargando transacciones...</p>
      )}

      {error && <ErrorNotice error={error} />}

      {showEmptyState && (
        <p className="notice notice--info">
          No se encontraron movimientos para la cuenta <strong>{searchAccount}</strong>.
        </p>
      )}

      {hasResults && (
        <TransactionsTable
            transactions={transactions}
            searchAccount={searchAccount}
        />
      )}
    </section>
  );
}