# FinanceApp — Sistema de Login con JWT

Sistema de autenticación para una aplicación web financiera. **No incluye registro de usuarios**: existe un único usuario predeterminado, configurado mediante variables de entorno en el backend.

## Stack

| Capa      | Tecnología                              |
|-----------|------------------------------------------|
| Frontend  | Angular 17 (standalone components) + TypeScript |
| Backend   | Node.js + Express + TypeScript           |
| Auth      | JSON Web Tokens (JWT) + bcrypt           |

## Estructura del proyecto

```
financial-login-app/
├── backend/                 # API REST (Node.js + TypeScript)
│   ├── src/
│   │   ├── config/env.ts            # Variables de entorno y usuario único
│   │   ├── controllers/auth.controller.ts
│   │   ├── middleware/auth.middleware.ts
│   │   ├── routes/auth.routes.ts
│   │   ├── types/express.d.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                # Aplicación Angular
    └── src/
        ├── app/
        │   ├── core/auth/
        │   │   ├── auth.service.ts       # Login + manejo del token
        │   │   ├── auth.guard.ts         # Protección de rutas privadas
        │   │   └── auth.interceptor.ts   # Adjunta el JWT a cada request
        │   ├── features/
        │   │   ├── login/                # Única vista pública
        │   │   └── dashboard/            # Vista privada de ejemplo
        │   ├── app.component.ts
        │   ├── app.config.ts
        │   └── app.routes.ts
        ├── environments/
        └── styles.scss
```

## 1. Backend — instalación y ejecución

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

El servidor arranca por defecto en `http://localhost:3000`.

### Variables de entorno (`backend/.env`)

```
PORT=3000
JWT_SECRET=change_this_super_secret_key_before_deploying
JWT_EXPIRES_IN=1h
ADMIN_EMAIL=admin@financeapp.com
ADMIN_PASSWORD=Admin123!
CORS_ORIGIN=http://localhost:4200
```

> El usuario único del sistema se define aquí. La contraseña se transforma en un hash `bcrypt` en memoria al iniciar el servidor; nunca se compara en texto plano.

### Endpoints

| Método | Ruta               | Descripción                                   | Protegido |
|--------|--------------------|------------------------------------------------|-----------|
| POST   | `/api/auth/login`  | Valida credenciales y devuelve un JWT           | No        |
| GET    | `/api/auth/me`     | Devuelve los datos del usuario autenticado      | Sí (JWT)  |
| GET    | `/api/health`      | Verificación de estado del servidor             | No        |

**Ejemplo de request de login:**

```json
POST /api/auth/login
{
  "email": "admin@financeapp.com",
  "password": "Admin123!"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "email": "admin@financeapp.com" }
}
```

## 2. Frontend — instalación y ejecución

```bash
cd frontend
npm install
npm start
```

La aplicación arranca por defecto en `http://localhost:4200`.

Si el backend corre en un host/puerto distinto, edita:
`frontend/src/environments/environment.ts` → propiedad `apiUrl`.

## Flujo de autenticación

1. El usuario ingresa correo y contraseña en la vista de login (`/`).
2. El `AuthService` envía la petición `POST /api/auth/login` al backend.
3. El backend valida las credenciales contra el único usuario definido en `.env` y, si son correctas, firma y devuelve un JWT.
4. El frontend guarda el token en `localStorage` y navega a `/dashboard`.
5. El `authInterceptor` adjunta automáticamente el header `Authorization: Bearer <token>` en las peticiones subsecuentes hacia la API.
6. El `authGuard` bloquea el acceso a `/dashboard` (y a cualquier otra ruta privada que se agregue) si no existe un token válido y no expirado, redirigiendo al login.
7. "Cerrar sesión" elimina el token del navegador.

## Notas de seguridad

- Las contraseñas nunca se almacenan ni comparan en texto plano (se usa `bcrypt`).
- El JWT tiene expiración configurable (`JWT_EXPIRES_IN`), por defecto 1 hora.
- El guard de Angular valida la expiración del token de forma local (decodificando el JWT) antes de permitir el acceso a vistas privadas.
- CORS está restringido al origen configurado en `CORS_ORIGIN`.
- Para producción: usar un `JWT_SECRET` largo y aleatorio, servir el frontend sobre HTTPS y considerar `HttpOnly` cookies como alternativa a `localStorage` si el nivel de seguridad requerido es más alto.
