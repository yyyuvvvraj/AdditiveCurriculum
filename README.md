# Additive Curriculum - Smart Manufacturing Dashboard

A comprehensive Inventory and Machine Management System designed for Additive Manufacturing workflows. This application integrates real-time inventory tracking, machine monitoring, and AI-driven analytics to optimize production efficiency.

## 🚀 Key Features

* **🔐 Secure Authentication**: Role-based access control using **NextAuth.js** (Google OAuth & Credentials).
* **📦 Inventory Management**: Track parts, current stock, reorder points (ROP), and vendors with real-time updates.
* **🤖 AI-Powered Analytics**: Integrated **Google Gemini AI** for predictive maintenance, inventory insights, and an intelligent chatbot assistant.
* **⚙️ Machine Monitoring**: Track OEE (Overall Equipment Effectiveness), machine status, and maintenance history.
* **📊 Interactive Dashboards**: Visual data representation using dynamic charts for consumption, stock levels, and alerts.
* **🧠 Genetic Algorithm Optimization**: Advanced logic for maintenance scheduling and resource optimization.
* **🔔 Smart Alerts**: Automated warnings for low stock and maintenance requirements.

## 🛠️ Tech Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Database**: [MongoDB](https://www.mongodb.com/) (Atlas)
* **ORM**: [Prisma](https://www.prisma.io/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Authentication**: [NextAuth.js](https://next-auth.js.org/)
* **AI Provider**: [Google Gemini API](https://ai.google.dev/)
* **Visualization**: Recharts

## 🏗️ Architecture

The project follows a modern, modular architecture:

```text
├── src/
│   ├── app/              # Next.js App Router pages (Dashboard, Inventory, Machines)
│   ├── components/       # Reusable UI components (Charts, AI Panels, Modals)
│   ├── lib/              # Backend utilities (Prisma client, AI logic, Email)
│   ├── hooks/            # Custom React hooks (useRealtime, etc.)
│   └── data/             # Mock data and seed templates
├── prisma/               # Database schema and migrations
└── public/               # Static assets
````

## 🏁 Getting Started

Follow these steps to set up the project locally.

### 1\. Prerequisites

Ensure you have the following installed:

  * [Node.js](https://nodejs.org/) (v18+ recommended)
  * A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
  * A [Google Cloud](https://console.cloud.google.com/) project (for OAuth)

### 2\. Clone the Repository

```bash
git clone [https://github.com/your-username/additive-curriculum.git](https://github.com/your-username/additive-curriculum.git)
cd additive-curriculum
```

### 3\. Install Dependencies

```bash
npm install
```

### 4\. Configure Environment Variables

Create a `.env` file in the root directory and add the following keys:

```env
# Database
DATABASE_URL="mongodb+srv://<user>:<password>@cluster0.abcd.mongodb.net/additive_curriculum?retryWrites=true&w=majority"

# Authentication (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Integration
GEMINI_API_KEY="your-google-gemini-api-key"

# Application Settings
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 5\. Setup Database

Push the Prisma schema to your MongoDB database:

```bash
npx prisma generate
npx prisma db push
```

*(Optional) Seed the database with initial data:*

```bash
npx prisma db seed
```

### 6\. Run the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

## 🚢 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the environment variables from your `.env` file to the Vercel Project Settings.
4.  **Important**: Ensure your `DATABASE_URL` in Vercel includes the database name (e.g., `/additive_curriculum`) to avoid connection errors.

## 🤝 Contributing

Contributions are welcome\! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

```
