import {useState} from "react";

export function TransfersPage() {

  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

  const [fromCustomer, setFromCustomer] = useState("");
  const [toCustomer, setToCustomer] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  //Validacion 1 todos los campos estan llens
  if (!fromAccount || !toAccount || !amount) {
    setMessage("Todos los campos son obligatorios");
    return;
  }

  // VALIDACION 2: misma cuenta
  if (fromAccount === toAccount) {
    setMessage("No puedes transferir a la misma cuenta");
    return;
  }

  // VALIDACION 3: monto mayor que 0  
  if (Number(amount) <= 0) {
    setMessage("El monto debe ser mayor que cero");
    return;
  }
 
  
  try {

    const response = await fetch(
      "http://localhost:8080/transactions/transfer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          senderAccountNumber: fromAccount,
          receiverAccountNumber: toAccount,
          amount: Number(amount)
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      setMessage(errorText);
      return;
    }

    setMessage("Transferencia realizada correctamente");

    // limpiar formulario
    setFromAccount("");
    setToAccount("");
    setAmount("");
    setFromCustomer("");
    setToCustomer("");

  } catch (error) {
    setMessage("Error conectando con el servidor");
  }
};

  const checkAccount = async (accountNumber: string, type: "from" | "to") => {

    if (!accountNumber) return;

    try {

      const response = await fetch(
        `http://localhost:8080/customers/account/${accountNumber}`
      );

      if (!response.ok) {
        if (type === "from") setFromCustomer("Cuenta no encontrada");
        else setToCustomer("Cuenta no encontrada");
        return;
      }

      const data = await response.json();
      const fullName = data.firstName + " " + data.lastName;

      if (type === "from") setFromCustomer(fullName);
      else setToCustomer(fullName);

    } catch (error) {
      setMessage("Error conectando con el servidor");
    }

  };


  return (
    <section className="panel">

      <header className="panel__header">
        <h2>Realizar Transferencia</h2>
        <p>Módulo base implementar el flujo transaccional.</p>
      </header>

      <form className="form-grid" onSubmit={handleSubmit}>

        <label>
          Número de cuenta origen

          <input
            type="text"
            value={fromAccount}
            inputMode="numeric"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setFromAccount(value);
              checkAccount(value, "from");
            }}
          />

          {fromCustomer && (
            <small>Titular: {fromCustomer}</small>
          )}

        </label>


        <label>
          Número de cuenta destino

          <input
            type="text"
            value={toAccount}
            inputMode="numeric"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setToAccount(value);
              checkAccount(value, "to");
            }}
          />

          {toCustomer && (
            <small>Titular: {toCustomer}</small>
          )}

        </label>


        <label>
          Monto

          <input
            type="number"
            value={amount}
            min="0"
            step="0.01"
            onChange={(e) => setAmount(e.target.value)}
          />

        </label>


        <div className="row-actions">
          <button
              type="submit"
              className="btn"
              disabled={Number(amount) <= 0}
          >
            Transferir
          </button>
        </div>

      </form>

      {message && (
        <p style={{marginTop:"10px"}}>
          {message}
        </p>
      )}

    </section>
  );
}