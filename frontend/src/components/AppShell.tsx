import { NavLink } from 'react-router-dom';
import type { PropsWithChildren } from 'react';

const navItems = [
  { to: '/clientes', label: 'Consultar Clientes' },
  { to: '/transferencias', label: 'Transferencias' },
  { to: '/historial', label: 'Histórico' },
];

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">Banco 2026</p>
          <h1>Portal Operativo</h1>
        </div>
        <p className="app-subtitle">Gestión de clientes, transferencias y seguimiento de movimientos.</p>
      </header>

      <nav className="app-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="app-main">{children}</main>
    </div>
  );
}
