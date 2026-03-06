# Banco 2026 Frontend (React)

Frontend en `React + TypeScript + Vite`, preparado para consumir el backend de este mismo repositorio.

## Estructura

- `src/app`: composición principal de aplicación y rutas.
- `src/api`: cliente HTTP tipado y endpoints.
- `src/features/customers`: vista de consulta de clientes.
- `src/features/transfers`: formulario de transferencias.
- `src/features/history`: tabla de histórico por cuenta.
- `src/components`: componentes compartidos.
- `src/styles`: tema y estilos globales.

## Rutas

- `/clientes`: consulta de clientes con paginación.
- `/transferencias`: crear transferencia entre cuentas.
- `/historial`: historial por cuenta.

## Variables de entorno

Opcional (`.env`):

```bash
VITE_API_BASE_URL=/api/v1
```

Por defecto usa `/api/v1` y `vite` hace proxy a `http://localhost:8080`.

## Levantar localmente

```bash
cd frontend
npm install
npm run dev
```
