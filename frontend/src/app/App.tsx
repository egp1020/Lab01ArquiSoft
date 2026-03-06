import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { CustomersPage } from '../features/customers/CustomersPage';
import { TransfersPage } from '../features/transfers/TransfersPage';
import { HistoryPage } from '../features/history/HistoryPage';

function NotFoundPage() {
  return (
    <section className="panel">
      <h2>Página no encontrada</h2>
      <p>La ruta solicitada no existe.</p>
    </section>
  );
}

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/clientes" replace />} />
        <Route path="/clientes" element={<CustomersPage />} />
        <Route path="/transferencias" element={<TransfersPage />} />
        <Route path="/historial" element={<HistoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
