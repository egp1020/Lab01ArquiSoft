import { useMemo } from 'react';
import { formatCurrency, formatDate } from "../lib/format";
import type { Transaction } from "../api/types";

type Props = {
  transactions: Transaction[];
  searchAccount: string | null;
};

export function TransactionsTable({ transactions, searchAccount }: Props) {

  const tableRows = useMemo(() => {
    return transactions.map((tx) => {
      const isEgreso = tx.senderAccountNumber === searchAccount;
      const tipo = isEgreso ? "EGRESO" : "INGRESO";

      return (
          <tr key={tx.id}>
            <td>{tx.id}</td>
            <td>{tx.senderAccountNumber}</td>
            <td>{tx.receiverAccountNumber}</td>
            <td>{formatCurrency(tx.amount)}</td>
            <td className={`badge badge--${tipo.toLowerCase()}`}>
              {tipo}
            </td>
            <td>{formatDate(tx.timestamp)}</td>
          </tr>
      );
    });
  }, [transactions, searchAccount]);

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cuenta Origen</th>
            <th>Cuenta Destino</th>
            <th>Monto</th>
            <th>Tipo</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </div>
  );
}