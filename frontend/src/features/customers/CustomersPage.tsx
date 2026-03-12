import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { deleteCustomer, updateCustomer, fetchCustomers, fetchCustomerById } from '../../api/customers';
import { UpdateCustomerInput, Customer } from '../../api/types';
import { ErrorNotice } from '../../components/ErrorNotice';
import { formatCurrency } from '../../lib/format';

// ─── Schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
    accountNumber: z.string().regex(/^[0-9]{6,20}$/, 'La cuenta debe tener entre 6 y 20 dígitos'),
    firstName:     z.string().min(1, 'Nombre requerido').max(50, 'Máximo 50 caracteres'),
    lastName:      z.string().min(1, 'Apellido requerido').max(50, 'Máximo 50 caracteres'),
    balance:       z.coerce.number().min(0, 'El saldo no puede ser negativo'),
});

type CustomerForm = z.infer<typeof schema>;

// ─── Sub-componente: fila con confirmación inline ──────────────────────────────
interface CustomerRowProps {
    customer:        Customer;
    onEdit:          (c: Customer) => void;
    onDelete:        (id: number) => void;
    isDeleting:      boolean;
}

function CustomerRow({ customer, onEdit, onDelete, isDeleting }: CustomerRowProps) {
    const [confirming, setConfirming] = useState(false);

    // Cancela la confirmación si el cursor sale de la fila
    const handleMouseLeave = () => setConfirming(false);

    return (
        <tr onMouseLeave={handleMouseLeave} className={isDeleting ? 'row--deleting' : ''}>
            <td>{customer.id}</td>
            <td><code>{customer.accountNumber}</code></td>
            <td>{customer.firstName} {customer.lastName}</td>
            <td>{formatCurrency(customer.balance)}</td>
            <td>
                <div className="row-actions">
                    <Link
                        className="btn btn--tiny"
                        to={`/historial?account=${encodeURIComponent(customer.accountNumber)}`}
                    >
                        Histórico
                    </Link>

                    <button
                        className="btn btn--tiny btn--edit"
                        onClick={() => onEdit(customer)}
                        disabled={isDeleting}
                    >
                        Editar
                    </button>

                    {confirming ? (
                        /* ── Confirmación inline: reemplaza window.confirm ── */
                        <>
                            <button
                                className="btn btn--tiny btn--danger"
                                onClick={() => { onDelete(customer.id); setConfirming(false); }}
                                disabled={isDeleting}
                                autoFocus
                                aria-label={`Confirmar eliminación de ${customer.firstName} ${customer.lastName}`}
                            >
                                {isDeleting ? 'Eliminando…' : '¿Confirmar?'}
                            </button>
                            <button
                                className="btn btn--tiny btn--ghost"
                                onClick={() => setConfirming(false)}
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn--tiny btn--danger"
                            onClick={() => setConfirming(true)}
                            disabled={isDeleting}
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

// ─── Sub-componente: empty state ───────────────────────────────────────────────
function EmptyState({ isFiltered }: { isFiltered: boolean }) {
    return (
        <tr>
            <td colSpan={5} className="table-empty">
                {isFiltered
                    ? 'No se encontró ningún cliente con ese ID.'
                    : 'No hay clientes registrados.'}
            </td>
        </tr>
    );
}

// ─── Componente principal ──────────────────────────────────────────────────────
export function CustomersPage() {
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [searchInput,     setSearchInput]     = useState('');
    const [searchId,        setSearchId]        = useState<number | null>(null);
    const [deletingId,      setDeletingId]      = useState<number | null>(null); // ← tracking por ID
    const queryClient  = useQueryClient();
    const firstInputRef = useRef<HTMLInputElement | null>(null);

    // ─── Queries ─────────────────────────────────────────────────────────────────
    const { data: customers = [], isLoading, error } = useQuery({
        queryKey: ['customers'],
        queryFn:  fetchCustomers,
    });

    const { data: customerById } = useQuery({
        queryKey: ['customer', searchId],
        queryFn:  () => fetchCustomerById(searchId!),
        enabled:  searchId !== null,
    });

    // ─── Form ─────────────────────────────────────────────────────────────────────
    const form = useForm<CustomerForm>({
        resolver:      zodResolver(schema),
        defaultValues: { accountNumber: '', firstName: '', lastName: '', balance: 0 },
    });

    // ─── Mutaciones ───────────────────────────────────────────────────────────────
    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateCustomerInput }) =>
            updateCustomer(id, payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['customers'] });
            setEditingCustomer(null);
            form.reset();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCustomer(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['customers'] });
            setDeletingId(null);
        },
        onError: () => setDeletingId(null),
    });

    // ─── Acciones ─────────────────────────────────────────────────────────────────
    const startEditing = (customer: Customer) => {
        setEditingCustomer(customer);
        form.reset({
            accountNumber: customer.accountNumber,
            firstName:     customer.firstName,
            lastName:      customer.lastName,
            balance:       Number(customer.balance),
        });
    };

    const submitEdit = form.handleSubmit((values) => {
        if (!editingCustomer) return;
        updateMutation.mutate({ id: editingCustomer.id, payload: values });
    });

    const handleDelete = (id: number) => {
        setDeletingId(id);
        deleteMutation.mutate(id);
    };

    const handleSearch = () => {
        const parsed = parseInt(searchInput, 10);
        if (!isNaN(parsed)) setSearchId(parsed);
    };

    const clearSearch = () => {
        setSearchId(null);
        setSearchInput('');
    };

    // ─── Escape para cerrar modal ──────────────────────────────────────────────
    useEffect(() => {
        if (!editingCustomer) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setEditingCustomer(null);
                form.reset();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [editingCustomer, form]);

    // ─── Focus automático al abrir modal ──────────────────────────────────────
    useEffect(() => {
        if (editingCustomer) {
            setTimeout(() => firstInputRef.current?.focus(), 50);
        }
    }, [editingCustomer]);

    // ─── Estados de carga y error de la lista ─────────────────────────────────
    if (isLoading) {
        return (
            <section className="panel">
                <header className="panel__header">
                    <h2>Consultar Clientes</h2>
                    <p>Consulta, edición y eliminación de datos de clientes.</p>
                </header>
                <p className="loading-text" aria-live="polite">Cargando clientes…</p>
            </section>
        );
    }

    if (error) return <ErrorNotice error={error} />;

    const customersToShow = customerById ? [customerById] : customers;
    const isFiltered      = searchId !== null;

    return (
        <section className="panel">
            <header className="panel__header">
                <h2>Consultar Clientes</h2>
                <p>Consulta, edición y eliminación de datos de clientes.</p>
            </header>

            {/* ── Barra de búsqueda ── */}
            <div className="customer-search">
                <input
                    className="customer-search__input"
                    type="text"                    /* ← text en vez de number (sin flechas, mejor móvil) */
                    inputMode="numeric"
                    placeholder="Buscar por ID…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}  /* ← Enter para buscar */
                    aria-label="Buscar cliente por ID"
                />
                <button
                    className="btn btn--tiny"
                    onClick={handleSearch}
                    disabled={!searchInput}
                >
                    🔎 Buscar
                </button>
                {isFiltered && (
                    <button className="btn btn--tiny btn--ghost" onClick={clearSearch}>
                        Ver todos
                    </button>
                )}
            </div>

            {/* ── Conteo de resultados ── */}
            <p className="table-count" aria-live="polite">
                {isFiltered
                    ? `Mostrando resultado para ID ${searchId}`
                    : `${customers.length} cliente${customers.length !== 1 ? 's' : ''} registrado${customers.length !== 1 ? 's' : ''}`
                }
            </p>

            {updateMutation.error && <ErrorNotice error={updateMutation.error} />}
            {deleteMutation.error && <ErrorNotice error={deleteMutation.error} />}

            {/* ── Tabla ── */}
            <div className="table-wrap">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cuenta</th>
                        <th>Nombre</th>
                        <th>Saldo</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customersToShow.length === 0
                        ? <EmptyState isFiltered={isFiltered} />
                        : customersToShow.map((customer) => (
                            <CustomerRow
                                key={customer.id}
                                customer={customer}
                                onEdit={startEditing}
                                onDelete={handleDelete}
                                isDeleting={deletingId === customer.id}
                            />
                        ))
                    }
                    </tbody>
                </table>
            </div>

            {/* ── Modal de edición ── */}
            {editingCustomer && (
                <div
                    className="modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    onClick={(e) => {
                        // Clic en backdrop cierra el modal
                        if (e.target === e.currentTarget) {
                            setEditingCustomer(null);
                            form.reset();
                        }
                    }}
                >
                    <div className="modal-card">
                        <h3 id="modal-title">Editar cliente #{editingCustomer.id}</h3>

                        <form className="form-grid" onSubmit={submitEdit} noValidate>

                            <label>
                                Cuenta
                                <input
                                    {...form.register('accountNumber')}
                                    inputMode="numeric"
                                    ref={(el) => {
                                        form.register('accountNumber').ref(el);
                                        firstInputRef.current = el;  // foco automático
                                    }}
                                />
                                {form.formState.errors.accountNumber && (
                                    <small className="error" role="alert">
                                        {form.formState.errors.accountNumber.message}
                                    </small>
                                )}
                            </label>

                            <label>
                                Nombre
                                <input {...form.register('firstName')} />
                                {form.formState.errors.firstName && (
                                    <small className="error" role="alert">
                                        {form.formState.errors.firstName.message}
                                    </small>
                                )}
                            </label>

                            <label>
                                Apellido
                                <input {...form.register('lastName')} />
                                {form.formState.errors.lastName && (
                                    <small className="error" role="alert">
                                        {form.formState.errors.lastName.message}
                                    </small>
                                )}
                            </label>

                            <label>
                                Saldo
                                <input {...form.register('balance')} type="number" min="0" step="0.01" />
                                {form.formState.errors.balance && (
                                    <small className="error" role="alert">
                                        {form.formState.errors.balance.message}
                                    </small>
                                )}
                            </label>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn--ghost"
                                    onClick={() => { setEditingCustomer(null); form.reset(); }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn"
                                    disabled={updateMutation.isPending}
                                    aria-busy={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? 'Guardando…' : 'Guardar cambios'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
