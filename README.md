# Order Management System

A full-stack web application for managing product orders. Customers can place orders via a public form. Admins can manage these orders through a protected dashboard with real-time updates.

---

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, Redux Toolkit, Ant Design
- **Backend**: Node.js, MongoDB, Mongoose, JWT

---

## Features

### Customer

- Public order form with validation
- Fields: Name, Email, Contact, Address, Product Name, Quantity, Image Upload (.jpg/.png, max 2MB)

### Admin

- Login with JWT authentication
- View, filter, edit, and delete orders
- Real-time updates when new orders are placed

---

## Setup

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/order-management-system.git
cd order-management-system
```

### 2. Install Dependencies

```bash
cd order-management-system
npm install
```

### 3. Environment Variables

```
JWT_SECRET=your-secret-key
MONGO_URI=mongodb://localhost:27017/orders
EMAIL=v3p51435@gmail.com
```

### 4. Run the App

```bash
npm run dev
```

---

## Admin Credentials

```
Email: v3p51435@gmail.com
Password: test
```

_(Add manually to DB if not seeded, you can create more admin users using an admin **account**)_

---

## API Endpoints

- `POST /api/orders` – Create order
- `GET /api/orders` – Get all orders
- `GET /api/orders/:id` – Get order by ID
- `PATCH /api/orders/:id` – Update quantity
- `DELETE /api/orders/:id` – Delete order
- `POST /api/admin/login` – Admin login

---

## Notes

- Backend follows MVC structure with centralized error handling.
- Admin routes are protected using middleware.

