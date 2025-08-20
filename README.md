# Use Team Proyect

¡Bienvenido/a! Este repositorio contiene dos proyectos principales:

- **Backend:** API construida con NestJS y Prisma.
- **Frontend:** Aplicación web construida con Next.js.

---

## 🚀 Requisitos previos

- Node.js v18+ recomendado
- npm v9+ o yarn/pnpm/bun
- Acceso a una base de datos **MongoDB** (local o remota)

---

## 📦 Instalación general

Clona el repositorio y entra en la carpeta raíz:

```bash
git clone https://github.com/EmiiGonzalez/use-team-proyect.git
cd use-team-proyect
```

---

## ⚙️ Backend (NestJS + Prisma + MongoDB)

### 1. Configura las variables de entorno

Copia el archivo de ejemplo y edítalo:

```bash
cd backend
cp example.env .env
```

Edita `.env` y completa los valores:

```env
PORT=3030
DATABASE_URL="mongodb+srv://usuario:contraseña@cluster.mongodb.net/tu_db?retryWrites=true&w=majority"
JWT_SECRET="tu_secreto_jwt"
JWT_EXPIRES_IN="30d"
CORS_ORIGIN="http://localhost:3000"
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura la base de datos con Prisma

Genera el cliente de Prisma y aplica el esquema a la base de datos:

```bash
npx prisma generate
npx prisma db push
```

### 4. Levanta el servidor

```bash
npm run start:dev
```

El backend estará disponible en `http://localhost:3030` (o el puerto que definas).

---

## 💻 Frontend (Next.js)

### 1. Configura variables de entorno (opcional)

Debes crear un archivo `.env` en la carpeta `frontend` con las siguientes variables de ejemplo:

```env
#Apis
NEXT_PUBLIC_BACKEND_URL=http://localhost:3030
#Para los websocket
NEXT_PUBLIC_API_URL=http://localhost:3030
#Url del front
FRONTEND_URL=http://localhost:3000
```

### 2. Instala dependencias

```bash
cd ../frontend
npm install
```

### 3. Levanta el servidor de desarrollo

```bash
npm run dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Comandos útiles

### Backend

- `npm run start:dev` — Levanta el backend en modo desarrollo.
- `npx prisma generate` — Genera el cliente de Prisma.
- `npx prisma db push` — Aplica el esquema Prisma a la base de datos.

### Frontend

- `npm run dev` — Levanta el frontend en modo desarrollo.
- `npm run build` — Compila la app para producción.
- `npm run start` — Sirve la app compilada.

---

## 📝 Notas

- Asegúrate de que el backend y la base de datos estén corriendo antes de usar el frontend.
- Para MongoDB Atlas, puedes obtener tu cadena de conexión desde el panel de tu clúster.

---

## 📚 Recursos

- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs (MongoDB)](https://www.prisma.io/docs/orm/databases/mongodb)
- [Next.js Docs](https://nextjs.org/docs)
