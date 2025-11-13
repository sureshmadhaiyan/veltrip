# Veltrip Backend API

Smart travel and mobility platform backend built with NestJS, PostgreSQL, and Prisma.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- Redis (optional, for caching and queues)

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api/docs`

## 📁 Project Structure

```
src/
├── auth/           # Authentication & Authorization
├── company/        # Multi-tenant company management
├── user/           # User management
├── driver/         # Driver management
├── booking/        # Booking management
├── payment/        # Payment processing
├── prisma/         # Prisma service & module
└── main.ts         # Application entry point
```

## 🔐 Authentication

The API uses JWT tokens for authentication:

1. **Register**: `POST /auth/register`
2. **Login**: `POST /auth/login`
3. **Refresh Token**: `POST /auth/refresh`

Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

### Companies
- `GET /companies` - List all companies
- `GET /companies/:id` - Get company details
- `POST /companies` - Create company (Admin only)
- `PATCH /companies/:id` - Update company (Admin only)
- `DELETE /companies/:id` - Delete company (Admin only)

### Users
- `GET /users` - List users (Admin only)
- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin only)

### Drivers
- `GET /drivers` - List all drivers
- `GET /drivers/available` - Get available drivers near location
- `GET /drivers/:id` - Get driver details
- `POST /drivers` - Create driver (Admin only)
- `PATCH /drivers/:id` - Update driver
- `DELETE /drivers/:id` - Remove driver (Admin only)

### Bookings
- `GET /bookings` - List bookings
- `GET /bookings/:id` - Get booking details
- `POST /bookings` - Create new booking
- `PATCH /bookings/:id` - Update booking
- `POST /bookings/:id/cancel` - Cancel booking

### Payments
- `GET /payments` - List payments
- `GET /payments/:id` - Get payment details
- `POST /payments` - Create payment
- `POST /payments/:id/verify` - Verify Razorpay payment

## 🗄️ Database

The application uses PostgreSQL with Prisma ORM. Key models:

- **Company** - Multi-tenant company information
- **User** - User accounts with roles (ADMIN, DRIVER, CUSTOMER)
- **Driver** - Driver profiles and vehicle information
- **Booking** - Trip bookings with status tracking
- **Payment** - Payment records with Razorpay integration
- **Transaction** - Financial transactions and wallet operations

## 🔧 Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/veltrip"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🧪 Development

```bash
# Run in development mode
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run tests
npm test

# Run linting
npm run lint
```

## 📝 Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## 🐳 Docker

Use the docker-compose file in the `devops/` directory to run PostgreSQL and Redis:

```bash
cd ../devops
docker-compose up -d
```

## 📖 Documentation

Full API documentation is available via Swagger UI at `/api/docs` when the server is running.

## 🔒 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation with class-validator
- CORS enabled

## 🚧 Next Steps

- [ ] Add Redis caching
- [ ] Implement BullMQ for background jobs
- [ ] Add Socket.IO for real-time updates
- [ ] Integrate Razorpay payment gateway
- [ ] Add email/SMS notifications
- [ ] Implement rate limiting
- [ ] Add request logging
