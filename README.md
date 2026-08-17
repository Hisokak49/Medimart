# MediMart 💊

MediMart is a full-stack pharmacy/e-commerce application built as a practical web-development project. It combines a React client with an Express/MongoDB backend and includes authentication, medicine catalog management, ordering, payments, inventory, and administrative workflows.

## ✨ Highlights

- User registration, login, and protected workflows
- Medicine catalog and search experience
- Medicine details and shopping cart
- Order placement and order history
- Online/offline payment flow and invoice support
- User profile management
- Admin dashboard and medicine management
- Inventory and low-stock management
- Email/event automation with Inngest and Nodemailer
- MongoDB persistence with Mongoose
- Clerk-based authentication integration
- Vercel deployment configuration

## 🧱 Tech Stack

**Frontend:** React, JavaScript, Tailwind CSS

**Backend:** Node.js, Express.js

**Database:** MongoDB, Mongoose

**Authentication:** Clerk

**Automation / Email:** Inngest, Nodemailer

**Deployment:** Vercel

## 📁 Project Structure

```text
Medimart/
├── client/          # React frontend
├── controllers/     # Request/business logic
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Shared server utilities
├── inngest/         # Event-driven workflows
├── api/             # Deployment/API entry points
├── configs/         # Application configuration
├── seed.js          # Sample data seeding
├── server.js        # Express server entry point
└── vercel.json      # Vercel deployment configuration
```

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Hisokak49/Medimart.git
cd Medimart
```

### 2. Install dependencies

```bash
npm install
cd client
npm install
cd ..
```

### 3. Configure environment variables

Create the environment files required by the server and client. Keep secrets such as database credentials, Clerk keys, email credentials, and API keys out of Git.

### 4. Start the development server

```bash
npm run server
```

For the frontend, use the scripts defined in `client/package.json`.

## 🔐 Security Notes

- Never commit `.env` files or API secrets.
- Use separate development and production credentials.
- Keep payment and authentication secrets server-side.
- Validate user-controlled input at API boundaries.

## 🎯 Project Goals

MediMart is designed to demonstrate practical full-stack engineering: component-based frontend development, REST API design, database modelling, authentication, event-driven workflows, deployment, and maintainable project structure.

## 📌 Status

This is an actively evolving project. Features and implementation details may change as the application is improved.

## 👤 Author

**Amit Krishna Kumar Yadav** — [GitHub](https://github.com/Hisokak49)
