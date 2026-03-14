import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactionsByAccount } from "../../api/transactions";
import { ErrorNotice } from "../../components/ErrorNotice";
import { HistorySearch } from "../../components/HistorySearch";
import { TransactionsTable } from "../../components/TransactionsTable";

export function HistoryPage() {

  const [account, setAccount] = useState("");
  const [searchAccount, setSearchAccount] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ["transactions", searchAccount],
    queryFn: () => fetchTransactionsByAccount(searchAccount!),
    enabled: !!searchAccount
  });

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

      {!isLoading && searchAccount && transactions.length === 0 && (
        <p className="muted">
          No se encontraron movimientos para esta cuenta.
        </p>
      )}

      {transactions.length > 0 && (
        <TransactionsTable
          transactions={transactions}
          searchAccount={searchAccount}
        />
      )}

    </section>
  );
}