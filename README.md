# Baruch Textbook Trading Platform

A web-based platform for Baruch College students to trade second-hand textbooks.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (v14+ recommended).
- **MySQL**: You need a local MySQL server running.
  - **Database**: `app`
  - **User**: `app`
  - **Password**: `app`
  - **Port**: `3306`

## Project Structure

- `Back-End/`: Express.js backend API.
- `Front-End/`: React + Vite frontend application.

## How to Run

You need to run the backend and frontend in separate terminal windows.

### 1. Start the Backend

The backend connects to the database and serves the API.

```bash
cd Back-End
npm install  # Install dependencies (only first time)
npm start    # Starts the server on http://localhost:3000
```

*Note: The backend will automatically attempt to initialize the database tables (`users`, `textbooks`, `posts`) if they don't exist.*

### 2. Start the Frontend

The frontend is the user interface.

```bash
cd Front-End
npm install  # Install dependencies (only first time)
npm run dev  # Starts the development server
```

After running the command, open the URL shown in the terminal (usually `http://localhost:5173`) in your browser.

## Features

- **Home Page**: View recent textbook listings.
- **Sell Page**: List a textbook for sale.
- **Community**: Discuss with other students.
