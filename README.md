# BancoUdea

Aplicación bancaria de ejemplo construida como parte del Laboratorio 1 del
curso de Arquitectura de Software — Universidad de Antioquia.

Permite gestionar clientes, realizar transferencias entre cuentas y consultar
el historial de movimientos. El sistema está dividido en tres componentes
independientes: un backend REST con Spring Boot, un frontend SPA con React y
una suite de pruebas de API con HTTPie.

---

## Características

- CRUD completo de clientes con validación de unicidad de número de cuenta
- Transferencias con idempotencia por clave UUID — reintentos seguros ante
  fallos de red
- Historial de transacciones filtrado por número de cuenta
- Manejo centralizado de errores con estructura uniforme (`timestamp`, `status`,
  `code`, `message`, `path`)
- Validación declarativa con Bean Validation (backend) y Zod (frontend)
- Suite de pruebas de API con HTTPie: colecciones, ambientes y smoke test

---

## Requisitos

| Herramienta | Versión mínima |
|-------------|---------------|
| Java        | 17            |
| Maven       | 3.8 (o usar `./mvnw`) |
| Node.js     | 18            |
| MySQL       | 8.0           |
| HTTPie CLI  | 3.x           |

---

## Estructura del repositorio

```
Lab01ArquiSoft/
├── banco2026v/          # Backend Spring Boot
├── frontend/            # Frontend React + TypeScript
└── api-testing/         # Suite de pruebas con HTTPie
    ├── environments/    # Variables de entorno por contexto
    ├── bodies/          # JSON bodies reutilizables
    ├── requests/        # Helpers reutilizables (funciones base)
    ├── collections/     # Endpoints organizados por recurso
    │   ├── customers/
    │   └── transactions/
    └── scripts/         # smoke-test.sh
```

---

## Instalación y configuración

### 1. Base de datos

```sql
CREATE DATABASE banco2026v;
CREATE USER 'banco_user'@'localhost' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON banco2026v.* TO 'banco_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend

Edita `banco2026v/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/banco2026v?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=banco_user
spring.datasource.password=tu_password
```

### 3. Frontend

```bash
cd frontend
npm install
```

### 4. API Testing

```bash
cd api-testing
cp environments/local.env environments/local.env.bak  # opcional
```

Edita `environments/local.env` con los valores de tu entorno local:

```bash
export BASE_URL=http://localhost:8080/api
export CUSTOMER_ID=1
export ACCOUNT_ORIGIN=123456
export ACCOUNT_DEST=654321
```

---

## Ejecución

### Backend

```bash
cd banco2026v
./mvnw spring-boot:run
# disponible en http://localhost:8080
```

### Frontend

```bash
cd frontend
npm run dev
# disponible en http://localhost:5173
```

### API Testing

Primero asegúrate de que el backend esté corriendo.

**Ejecutar una colección individual:**

```bash
cd api-testing

# Listar todos los clientes
./collections/customers/list.sh

# Obtener cliente por número de cuenta
./collections/customers/get-by-account.sh 123456

# Crear cliente (usa el body por defecto)
./collections/customers/create.sh

# Realizar una transferencia
./collections/transactions/transfer.sh

# Verificar idempotencia (ejecutar dos veces con la misma clave)
./collections/transactions/transfer-idempotent.sh

# Ver casos de error esperados
./collections/customers/error-cases.sh
./collections/transactions/error-cases.sh
```

**Ejecutar el smoke test completo:**

```bash
cd api-testing
./scripts/smoke-test.sh
```

El smoke test crea clientes de prueba, ejecuta una transferencia, verifica
idempotencia y comprueba los errores esperados. Al final imprime cuántas
pruebas pasaron y cuántas fallaron, y retorna código de salida `0` si todo
está correcto o `1` si alguna falla.

---

## Endpoints disponibles

### Clientes — `/api/customers`

| Método | Ruta                          | Descripción                        |
|--------|-------------------------------|------------------------------------|
| GET    | `/api/customers`              | Listar todos los clientes          |
| GET    | `/api/customers/{id}`         | Obtener cliente por ID             |
| GET    | `/api/customers/account/{n}`  | Obtener cliente por número de cuenta |
| POST   | `/api/customers`              | Crear cliente                      |
| PUT    | `/api/customers/{id}`         | Actualizar cliente                 |
| DELETE | `/api/customers/{id}`         | Eliminar cliente (requiere saldo 0)|

### Transacciones — `/api/transactions`

| Método | Ruta                              | Descripción                     |
|--------|-----------------------------------|---------------------------------|
| POST   | `/api/transactions`               | Realizar transferencia          |
| GET    | `/api/transactions/{accountNumber}`| Historial de una cuenta        |

---

## Códigos de error

| Código HTTP | `code`                    | Causa                                  |
|-------------|---------------------------|----------------------------------------|
| 400         | `VALIDATION_ERROR`        | Campo inválido en el DTO               |
| 400         | `BUSINESS_RULE_VIOLATION` | Dato duplicado o inconsistente         |
| 404         | `NOT_FOUND`               | Recurso no encontrado                  |
| 409         | `DATA_INTEGRITY_VIOLATION`| Restricción de integridad en base de datos |
| 422         | `BUSINESS_RULE_VIOLATION` | Regla de negocio violada (saldo, etc.) |
| 500         | `INTERNAL_ERROR`          | Error inesperado del servidor          |

---

## Autores

- Manuel Felipe Álvarez Rúa — manuel.alvarez2@udea.edu.co
- Estefanía Garcés Pérez — estefania.garces@udea.edu.co
- Andrés Eduardo Pabón Roldán — andres.pabon@udea.edu.co

Curso: Arquitectura de Software — Facultad de Ingeniería, Universidad de Antioquia
