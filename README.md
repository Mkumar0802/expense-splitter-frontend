💸 Expense Splitter Frontend

A modern, responsive Svelte-based web app for splitting expenses among friends, roommates, or groups — designed for simplicity, accuracy, and great user experience.

🚀 Overview

The Expense Splitter Frontend is the client-side application of the Expense Splitter system.
It helps users add friends, record shared expenses, and calculate who owes whom automatically — all with real-time feedback and a clean, mobile-friendly interface.

✨ Features
👥 User Management

Add, edit, and view users with real-time validation.

Optional phone numbers with auto-formatting and Indian mobile validation.

💰 Expense Tracking

Create expenses with automatic equal split calculations.

Auto-includes the payer in the participants list.

⚖️ Balance Calculation

Displays clear settlement overviews of who owes whom.

Automatically recalculates balances after each expense.

🎨 Modern UI

Built with Svelte + Tailwind CSS.

Clean, intuitive interface with responsive design.

🔔 Notifications

Toast-based feedback using svelte-french-toast.

Smooth user feedback for every action (success, warning, error).

🔍 Smart Search

Powerful search and filter options in the participant selector.

🧩 Project Structure
expense-splitter-frontend/
├── src/
│   ├── api/
│   │   └── api.js                 # Axios configuration & API abstraction
│   ├── components/
│   │   ├── ExpenseForm.svelte     # Create new expenses
│   │   ├── ExpenseList.svelte     # List and view expenses
│   │   ├── MultiSelectCheckbox.svelte # Smart participant selector
│   │   ├── Navbar.svelte          # Navigation bar
│   │   └── UserForm.svelte        # Add new users with validation
│   ├── pages/
│   │   ├── Balance.svelte         # Balance overview
│   │   ├── Expenses.svelte        # Expenses page
│   │   └── Users.svelte           # Users page
│   ├── stores/                    # (Optional) Svelte writable stores
│   ├── utils/                     # Utility helpers
│   ├── App.svelte                 # Root component
│   ├── main.js                    # Application entry point
│   └── app.css                    # Global styles
├── package.json
├── tailwind.config.js             # Tailwind setup
├── vite.config.js                 # Vite bundler config
└── svelte.config.js               # Svelte compiler config

🛠️ Prerequisites

Before running this project, ensure you have:

Node.js ≥ 16.x → Download here

Backend API → Expense Splitter Backend running at
http://localhost:5000

⚡ Quick Start
1️⃣ Install Dependencies
npm install

2️⃣ Start Backend Server

Ensure your backend (Node.js/Express or similar) is running at:

http://localhost:5000

3️⃣ Run Frontend
npm run dev


Then open: http://localhost:5173

📋 Available Scripts
Command	Description
npm run dev	Start development server with hot reload
npm run build	Build optimized production bundle
npm run preview	Preview production build locally
npm run lint	Lint code using ESLint
npm run format	Auto-format code using Prettier
🎯 Key Components
Component	Description
ExpenseForm.svelte	Smart form for creating expenses with payer auto-inclusion
MultiSelectCheckbox.svelte	Searchable user selector with select-all toggle
UserForm.svelte	Add users with name/phone validation and toast feedback
ExpenseList.svelte	Displays expense history and summaries
Balance.svelte	Calculates and displays settlements
Navbar.svelte	Responsive navigation bar
🔌 API Integration

The frontend communicates with the backend using centralized API helpers (src/api/api.js) via Axios.

Users API
Method	Endpoint	Description
GET	/users	Fetch all users
POST	/users	Create a new user
Expenses API
Method	Endpoint	Description
GET	/expenses	Get all expenses
POST	/expenses	Create a new expense
Balances API
Method	Endpoint	Description
GET	/balances	Fetch calculated balances
🎨 Styling & UI

Framework: Tailwind CSS

Colors:

Primary: #083D77

Secondary: #DA4167

Accent: #F4D35E

Background: #F4F4F4

Typography: Clean, readable fonts

Responsive: Fully mobile-friendly design

Icons: Lightweight SVG icons for consistency

🚦 Validation & Error Handling

Client-side validation with real-time feedback.

Form-level error messages for each input.

Toast notifications for all API outcomes.

Comprehensive API error catching using Axios interceptors.

Loading states for async actions.

🧰 Configuration Files
Tailwind (tailwind.config.js)
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte}'],
  theme: {
    extend: {
      colors: {
        primary: '#083D77',
        secondary: '#DA4167',
        accent: '#F4D35E',
        background: '#F4F4F4',
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          muted: '#9CA3AF'
        },
        border: '#E5E7EB'
      }
    },
  },
  plugins: [],
}

Vite (vite.config.js)
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
})

🌐 Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

🧩 Component Communication

Props → Data flows down from parent to child

Events → Child components communicate upward via createEventDispatcher

Stores → (Optional) Global shared state

API Module → Centralized Axios instance for all HTTP calls

🧪 Troubleshooting
❌ Connection Refused

Make sure the backend is running:

curl http://localhost:5000/api/users

⚠️ Build Errors
rm -rf node_modules package-lock.json
npm install

🎨 Styles Not Loading
npm run dev

🧠 Tips

Open browser dev tools → Network tab for failed requests

Check console logs for Axios errors

Verify CORS configuration in backend

Run npm run lint before committing

📦 Production Build

Build and preview:

npm run build
npm run preview


The production-ready output will be in /dist.

Deploy the /dist folder to any static hosting service (e.g., Netlify, Vercel, or Nginx).

🧑‍💻 Contributing

Follow existing code and naming conventions.

Run npm run lint and npm run format before committing.

Test all user flows and ensure responsiveness.

Validate API integration and error handling thoroughly.

Use clear, descriptive commit messages.

🧾 License

This project is part of the Expense Splitter application suite.
All rights reserved © 2025.

💡 Developer Note

The goal of this project is to make expense tracking simple and transparent — whether you’re splitting rent, food bills, or travel costs.

Built with ❤️ using Svelte + Tailwind CSS + Axios.

Happy Expense Splitting! 💰✨

