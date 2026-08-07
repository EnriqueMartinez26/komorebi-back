# Komorebi Home — Backend

API REST del e-commerce **Komorebi Home**, mi proyecto final para el curso de Desarrollo Web Full Stack de **Rolling Code School**.

## Demo

- **API en producción:** https://komorebi-back.onrender.com (Render) — chequeo rápido: [`/api/health`](https://komorebi-back.onrender.com/api/health)
- **Sitio:** https://komorebi-front.netlify.app/ (Netlify)

> Está en el plan gratuito de Render: si el servicio estuvo inactivo, la primera request puede demorar unos segundos mientras despierta.

## Qué contiene

- Catálogo de productos con búsqueda por texto, destacados, paginado y filtrado por categoría.
- Autenticación con JWT, contraseñas hasheadas con bcrypt y recuperación por email.
- Carrito persistido por usuario.
- Favoritos por usuario.
- Órdenes de compra con snapshot de precios al momento de comprar.
- Formulario de contacto que envía mail vía SMTP.
- Banners administrables para las publicidades del sitio.
- Seed automático: al arrancar carga categorías, productos y banners de demo si la base está vacía.

## Stack

| Qué | Con qué |
| --- | --- |
| Runtime | Node.js 18+ (ES Modules) |
| Framework | Express 4 |
| Base de datos | MongoDB + Mongoose 8 |
| Auth | JSON Web Tokens + bcrypt |
| Validación | express-validator |
| Mails | Nodemailer |
| Logs | Morgan |

## Arquitectura

La API está armada en capas, cada una con una sola responsabilidad:

```
Ruta → Validator → Controller → Service → Repository → Modelo Mongoose
```

```
src/
├── app.js              # armado de Express, CORS y middlewares
├── server.js           # arranque: conexión a Mongo + seed + listen
├── classes/            # BaseRepository (CRUD genérico)
├── config/             # env y conexión a la base
├── controllers/        # reciben el request, devuelven el response
├── data/               # datos de la semilla
├── dtos/               # qué campos salen hacia el cliente
├── middlewares/        # auth, validación, manejo de errores
├── models/             # esquemas de Mongoose
├── repositories/       # acceso a datos
├── routes/             # definición de endpoints
├── services/           # reglas de negocio
├── utils/              # ApiError, asyncHandler, hash, jwt, mailer, pagination
└── validators/         # reglas de express-validator
```

## Endpoints

Todos cuelgan de `/api`.

### Auth — `/api/auth`

| Método | Ruta | Auth | Qué hace |
| --- | --- | --- | --- |
| POST | `/register` | — | Crea la cuenta |
| POST | `/login` | — | Devuelve el token y setea la cookie |
| POST | `/logout` | — | Cierra la sesión |
| POST | `/forgot-password` | — | Envía el mail de recuperación |
| POST | `/reset-password` | — | Cambia la contraseña con el token |
| GET | `/me` | Sí | Devuelve el usuario logueado |

### Productos y categorías

| Método | Ruta | Auth | Qué hace |
| --- | --- | --- | --- |
| GET | `/products` | — | Listado paginado |
| GET | `/products/featured` | — | Destacados del home |
| GET | `/products/search` | — | Búsqueda por texto |
| GET | `/products/:slug` | — | Detalle |
| GET | `/categories` | — | Todas las categorías |
| GET | `/categories/:slug` | — | Una categoría |

### Carrito — `/api/cart` (requiere sesión)

| Método | Ruta | Qué hace |
| --- | --- | --- |
| GET | `/` | Carrito del usuario |
| POST | `/items` | Agrega un producto |
| PATCH | `/items/:itemId` | Cambia la cantidad |
| DELETE | `/items/:itemId` | Saca un ítem |
| DELETE | `/` | Vacía el carrito |

### Favoritos — `/api/favorites` (requiere sesión)

| Método | Ruta | Qué hace |
| --- | --- | --- |
| GET | `/` | Lista los favoritos |
| POST | `/:productId` | Agrega |
| DELETE | `/:productId` | Quita |

### Órdenes — `/api/orders` (requiere sesión)

| Método | Ruta | Qué hace |
| --- | --- | --- |
| POST | `/` | Crea la orden desde el carrito |
| GET | `/` | Historial del usuario |
| GET | `/:id` | Detalle de una orden |

### Otros

| Método | Ruta | Auth | Qué hace |
| --- | --- | --- | --- |
| GET | `/health` | — | Chequeo de estado |
| POST | `/contact` | — | Envía el mail de contacto |
| GET | `/banners` | — | Banners publicitarios |

## Modelos

| Modelo | Campos principales |
| --- | --- |
| `User` | firstName, lastName, username, email, passwordHash, role, cartId |
| `Product` | name, slug, description, price, discountPrice, images, categoryId, stock, featured, isActive, tags |
| `Category` | name, slug, description |
| `Cart` | userId, items |
| `Order` | userId, items (con snapshot de nombre y precio), amount, paymentStatus, shippingMethod, shippingAddress, orderStatus |
| `Favorite` | userId, productId |
| `Banner` | position y contenido de la publicidad |
| `PasswordResetToken` | token temporal para recuperar la contraseña |

### Roles

El modelo `User` tiene un campo `role` que **hoy siempre vale `customer`**. Es el valor por defecto del esquema y el endpoint de registro no lo acepta como campo, así que no hay forma de pedir otro rol desde afuera: todas las cuentas se crean como cliente.

Eso significa que, por ahora, la autorización es binaria. Un endpoint está abierto o requiere sesión (`authMiddleware`), y no hay ninguno que discrimine según quién sea el usuario.

La base para cambiarlo ya está puesta: `authMiddleware` deja el rol disponible en `req.user.role` y el `UserDTO` lo expone al cliente. Lo que falta es la capa de autorización propiamente dicha.

**Qué queda pendiente para sumar un rol `admin`:**

- Un middleware `requireRole("admin")` que corra después de `authMiddleware` y corte con 403 si el rol no alcanza.
- Endpoints de escritura para el catálogo: alta, edición y baja de productos, categorías y banners. Hoy todo eso solo se puede modificar desde el seed o directo en la base.
- Gestión de órdenes: listar las de todos los usuarios y cambiar el `orderStatus` y el `paymentStatus`, que por ahora quedan fijos en `created` y `pending`.
- Un `enum` en el campo `role` del esquema, para que la base rechace valores fuera de la lista permitida.
- Un panel de administración en el frontend que consuma todo eso.

## Cómo levantarlo

Necesitás Node 18 o superior y MongoDB corriendo (local o Atlas).

```bash
git clone https://github.com/EnriqueMartinez26/komorebi-back
cd komorebi-back
npm install
cp .env.example .env
npm run dev
```

Queda en `http://127.0.0.1:4000`. Para verificar: `GET http://127.0.0.1:4000/api/health`.

### Variables de entorno

| Variable | Para qué | Default |
| --- | --- | --- |
| `PORT` | Puerto de la API | `4000` |
| `MONGODB_URI` | Conexión a MongoDB | `mongodb://127.0.0.1:27017/rolling-code-ecommerce` |
| `CLIENT_URL` | Origen permitido por CORS | `http://127.0.0.1:5173` |
| `JWT_SECRET` | Clave para firmar los tokens | — |
| `JWT_EXPIRES_IN` | Duración del token | `7d` |
| `COOKIE_NAME` | Nombre de la cookie de sesión | `rolling_code_session` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Envío de mails | — |
| `SMTP_FROM` | Remitente de los mails | `no-reply@example.com` |
| `CONTACT_EMAIL` | Destinatario del formulario de contacto | `store@example.com` |

Sin credenciales SMTP la API arranca igual; lo único que no funciona es el envío real de mails.

CORS acepta la `CLIENT_URL` configurada y cualquier `localhost` / `127.0.0.1` por HTTP, con `credentials: true` para que viaje la cookie de sesión.

## Autor

**Enrique Leonel Martínez**

Proyecto final — Rolling Code School.
