type Props = {
  account: string;
  setAccount: (value: string) => void;
  searchAccount: string | null;
  setSearchAccount: (value: string | null) => void;
  inputError: string | null;
  setInputError: (value: string | null) => void;
};

export function HistorySearch({
  account,
  setAccount,
  searchAccount,
  setSearchAccount,
  inputError,
  setInputError
}: Props) {

  const handleSearch = () => {

    if (account.length < 6) {
      setInputError("La cuenta debe tener mínimo 6 dígitos");
      return;
    }

    setInputError(null);
    setSearchAccount(account);
  };

  const handleClear = () => {
    setAccount("");
    setSearchAccount(null);
    setInputError(null);
  };

  return (
    <div className="customer-search">
      <input
        className={`customer-search__input ${inputError ? 'input--error' : ''}`}
        placeholder="Número de cuenta"
        value={account}
        inputMode="numeric"
        maxLength={20}

        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            setAccount(value);
            if (inputError) setInputError(null);
          }
        }}

        onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
        }}
      />

      <button
        className="btn btn--tiny"
        onClick={handleSearch}
        disabled={account.length < 6}
      >
        Buscar
      </button>

      {(account || searchAccount) && (
        <button
          className="btn btn--tiny btn--ghost"
          onClick={handleClear}
        >
          Limpiar
        </button>
      )}

      {inputError && (
        <p role="alert" className="notice notice--error">{inputError}</p>
      )}
    </div>
  );
}