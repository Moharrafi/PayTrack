
# 💸 PayTrack - Employee Loan Management System

**PayTrack** (formerly KasbonKu) is a modern web application designed to manage employee loans and repayments efficiently. It features a responsive UI, real-time data tracking, and a secure cloud database backend.

![PayTrack Banner](https://via.placeholder.com/1200x400?text=PayTrack+Employee+Loan+System)

## ✨ Features

- **Dashboard**: Visual summary of total loans, active borrowers, and recent transactions.
- **Employee Management**: Add, view, and manage employee profiles including salary and contact info.
- **Loan Tracking**:
  - Request new loans with customizable terms.
  - Track remaining balances and repayment progress.
  - Status badges (Active, Paid, Rejected).
- **Transaction History**: Record repayments and view detailed loan history.
- **PWA Ready**: Installable on mobile and desktop devices.
- **Cloud Database**: Data is securely stored in a MySQL database (Aiven).

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/) (Hosted on Aiven)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm
- MySQL Database credentials (or use the provided `db.sql` to set up your own).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Moharrafi/PayTrack.git
    cd PayTrack
    ```

2.  **Install Dependencies**
    ```bash
    pnpm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your database credentials:
    ```env
    DB_HOST=your-db-host.com
    DB_USER=your-db-user
    DB_PASSWORD=your-db-password
    DB_NAME=kasbon
    DB_PORT=3306
    ```

4.  **Database Setup**
    If setting up a new database, run the SQL commands found in `db.sql` in your MySQL client to create the necessary tables.

5.  **Run the Application**
    Start both the frontend and backend concurrently:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.
    The server works at `http://localhost:3001`.

## 📱 Screenshots

| Dashboard | Employee Detail | Loan List |
|:---:|:---:|:---:|
| *(Add Screenshot)* | *(Add Screenshot)* | *(Add Screenshot)* |

## 📄 License

This project is licensed under the MIT License.
