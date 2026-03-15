import { useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createTransfer } from "../../api/transactions";
import { fetchCustomerByAccount } from "../../api/customers";
import { formatCurrency } from "../../lib/format";
import {ErrorNotice} from "../../components/ErrorNotice";

// ─── Schema ────────────────────────────────────────────────────────────────────
const schema = z
    .object({
      senderAccountNumber: z.string().min(6, "Mínimo 6 dígitos").max(20, "Máximo 20 dígitos"),
      receiverAccountNumber: z.string().min(6, "Mínimo 6 dígitos").max(20, "Máximo 20 dígitos"),
      amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
    })
    .refine(
        (data) => data.senderAccountNumber !== data.receiverAccountNumber,
        { message: "No puedes transferir a la misma cuenta", path: ["receiverAccountNumber"] }
    );

type TransferForm = z.infer<typeof schema>;

// ─── Tipos del lookup ──────────────────────────────────────────────────────────
type LookupStatus = "idle" | "loading" | "found" | "error";

interface AccountLookup {
  status: LookupStatus;
  name: string;
}

const IDLE: AccountLookup = { status: "idle", name: "" };

// ─── Sub-componente: feedback del titular ──────────────────────────────────────
function AccountHint({ lookup }: { lookup: AccountLookup }) {
  if (lookup.status === "idle") return null;

  const variants: Record<Exclude<LookupStatus, "idle">, { icon: string; text: string; cls: string }> = {
    loading: { icon: "⏳", text: "Buscando…",            cls: "account-hint--loading" },
    found:   { icon: "✓",  text: lookup.name,            cls: "account-hint--found"   },
    error:   { icon: "✗",  text: "Cuenta no encontrada", cls: "account-hint--error"   },
  };

  const { icon, text, cls } = variants[lookup.status];

  return (
      <span
          className={`account-hint ${cls}`}
          role="status"
          aria-live="polite"
          aria-label={lookup.status === "found" ? `Titular: ${lookup.name}` : text}
      >
      <span aria-hidden="true">{icon}</span> {text}
    </span>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────
export function TransfersPage() {
  const [fromLookup, setFromLookup] = useState<AccountLookup>(IDLE);
  const [toLookup,   setToLookup]   = useState<AccountLookup>(IDLE);

  // Refs para debounce — no causan re-render
  const fromTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TransferForm>({
    resolver: zodResolver(schema),
    defaultValues: { senderAccountNumber: "", receiverAccountNumber: "", amount: 0 },
  });

  const watchedAmount = watch("amount");

  const mutation = useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      reset();
      setFromLookup(IDLE);
      setToLookup(IDLE);
    },
  });

  const onSubmit = handleSubmit((values) =>
      mutation.mutate({
        ...values,
        idempotencyKey: crypto.randomUUID(),
      })
  );

  // ─── Lookup con debounce 400ms ─────────────────────────────────────────────
  const checkAccount = (accountNumber: string, type: "from" | "to") => {
    const setter   = type === "from" ? setFromLookup : setToLookup;
    const timerRef = type === "from" ? fromTimer     : toTimer;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (accountNumber.length < 6) {
      setter(IDLE);
      return;
    }

    setter({ status: "loading", name: "" });

    timerRef.current = setTimeout(async () => {
      try {
        const customer = await fetchCustomerByAccount(accountNumber);
        setter({ status: "found", name: `${customer.firstName} ${customer.lastName}` });
      } catch {
        setter({ status: "error", name: "" });
      }
    }, 400);
  };

  // ─── Factory handler ───────────────────────────────────────────────────────
  const makeHandler = (
      rhfOnChange: React.ChangeEventHandler<HTMLInputElement>,
      type: 'from' | 'to'
  ) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = e.target.value.replace(/\D/g, '');
        const syntheticEvent = Object.assign({}, e, {
          target: Object.assign({}, e.target, { value: cleaned }),
        });
        rhfOnChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
        checkAccount(cleaned, type);
      };

  const senderReg   = register("senderAccountNumber");
  const receiverReg = register("receiverAccountNumber");
  const isPending   = mutation.isPending || isSubmitting;

  return (
      <section className="panel">
        <header className="panel__header">
          <h2>Realizar Transferencia</h2>
          <p>Aquí puedes transferir dinero a otra persona.</p>
        </header>

        <form className="form-grid" onSubmit={onSubmit} noValidate>

          <label>
            Número de cuenta origen
            <input
                {...senderReg}
                inputMode="numeric"
                autoComplete="off"
                aria-invalid={!!errors.senderAccountNumber}
                aria-describedby="sender-hint sender-error"
                onChange={makeHandler(senderReg.onChange, "from")}
            />
            <AccountHint lookup={fromLookup} />
            {errors.senderAccountNumber && (
                <small id="sender-error" className="error" role="alert">
                  {errors.senderAccountNumber.message}
                </small>
            )}
          </label>

          <label>
            Número de cuenta destino
            <input
                {...receiverReg}
                inputMode="numeric"
                autoComplete="off"
                aria-invalid={!!errors.receiverAccountNumber}
                aria-describedby="receiver-hint receiver-error"
                onChange={makeHandler(receiverReg.onChange, "to")}
            />
            <AccountHint lookup={toLookup} />
            {errors.receiverAccountNumber && (
                <small id="receiver-error" className="error" role="alert">
                  {errors.receiverAccountNumber.message}
                </small>
            )}
          </label>

          <label>
            Monto
            <input
                {...register("amount")}
                type="number"
                min="0"
                step="0.01"
                aria-invalid={!!errors.amount}
                aria-describedby="amount-preview amount-error"
            />
            {watchedAmount > 0 && !errors.amount && (
                <small id="amount-preview" className="account-hint account-hint--found">
                  {formatCurrency(watchedAmount)}
                </small>
            )}
            {errors.amount && (
                <small id="amount-error" className="error" role="alert">
                  {errors.amount.message}
                </small>
            )}
          </label>

          <div className="row-actions">
            <button
                type="submit"
                className="btn"
                disabled={isPending}
                aria-busy={isPending}
            >
              {isPending ? "Transfiriendo…" : "Transferir"}
            </button>
          </div>

        </form>

        {mutation.isSuccess && (
            <p className="notice notice--success" role="status" aria-live="polite" style={{ marginTop: "10px" }}>
              ✓ Transferencia realizada correctamente
            </p>
        )}

        {mutation.isError && <ErrorNotice error={mutation.error} />}

      </section>
  );
}
