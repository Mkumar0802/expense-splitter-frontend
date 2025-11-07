Based on your project structure, here's the complete README.md file tailored for your Expense Splitter Frontend:

Expense Splitter Frontend
A modern Svelte-based frontend application for splitting expenses between friends and roommates with a clean, intuitive interface.

🚀 Features
👥 User Management - Add and manage users with validation

💰 Expense Tracking - Create expenses with automatic splitting

⚖️ Balance Calculation - View who owes whom and clear settlement overview

🎨 Modern UI - Clean, responsive design with Tailwind CSS

📱 Real-time Updates - Instant calculations and feedback

🔔 Toast Notifications - User-friendly feedback with svelte-french-toast

🔍 Smart Search - Search and filter users in multi-select components

📁 Project Structure
text
expense-splitter-frontend/
├── src/
│   ├── api/
│   │   └── api.js                 # Axios configuration and API calls
│   ├── components/
│   │   ├── ExpenseForm.svelte     # Form for creating new expenses
│   │   ├── ExpenseList.svelte     # Display list of expenses
│   │   ├── MultiSelectCheckbox.svelte # User selection component
│   │   ├── Navbar.svelte          # Navigation component
│   │   └── UserForm.svelte        # Form for adding new users
│   ├── pages/
│   │   ├── Balance.svelte         # Balance calculations page
│   │   ├── Expenses.svelte        # Expenses management page
│   │   └── Users.svelte           # Users management page
│   ├── stores/                    # Svelte stores (if any)
│   ├── utils/                     # Utility functions
│   ├── App.svelte                 # Root component
│   ├── main.js                    # Application entry point
│   └── app.css                    # Global styles
├── package.json
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.js                # Vite configuration
└── svelte.config.js              # Svelte configuration
🛠️ Prerequisites
Before running this project, make sure you have:

Node.js (version 16 or higher) - Download here

Backend API - The Expense Splitter backend should be running on http://localhost:5000

⚡ Quick Start
1. Install Dependencies
bash
npm install
2. Start Backend Server
Make sure your backend API is running on http://localhost:5000 before starting the frontend.

3. Run Development Server
bash
npm run dev
The application will be available at http://localhost:5173

📋 Available Scripts
npm run dev - Start development server with hot reload

npm run build - Build for production

npm run preview - Preview production build locally

npm run lint - Run ESLint to check code quality

npm run format - Format code with Prettier

🎯 Key Components Overview
🔧 Core Components
ExpenseForm - Smart form with auto-inclusion of payer in participants

MultiSelectCheckbox - Searchable user selection with select-all functionality

UserForm - Add users with phone number formatting and validation

📄 Pages
Users - Manage all users in the system

Expenses - Create and view expense history

Balance - See calculated balances and settlements

🔌 API Integration
The frontend integrates with these backend endpoints:

Users API
GET /users - Fetch all users

POST /users - Create new user

Expenses API
GET /expenses - Fetch all expenses

POST /expenses - Create new expense

Balances API
GET /balances - Calculate and fetch balances between users

🎨 Styling & Design
Framework: Tailwind CSS for utility-first styling

Colors: Custom color scheme with primary, secondary, and accent colors

Responsive: Mobile-first responsive design

Icons: SVG icons for consistent styling

🚦 Validation & Error Handling
Form Validation: Real-time field validation with error messages

Error Boundaries: Comprehensive error handling for API calls

User Feedback: Toast notifications for all user actions

Loading States: Visual feedback during API operations

🔧 Configuration Files
Tailwind Config (tailwind.config.js)
javascript
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
Vite Config (vite.config.js)
javascript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
})
🌐 Browser Support
Chrome 90+

Firefox 88+

Safari 14+

Edge 90+

🚨 Troubleshooting
Common Issues
Connection Refused

bash
# Ensure backend is running
curl http://localhost:5000/api/users
Build Errors

bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install
Styling Not Loading

bash
# Restart development server
npm run dev
Development Tips
Use browser dev tools to check network requests

Check console for API error messages

Verify backend CORS configuration

Use npm run lint before committing code

📦 Production Build
bash
# Create production build
npm run build

# Preview production build
npm run preview
The built files will be in the dist directory, ready for deployment.

🔄 Component Communication
Events: Components communicate via Svelte's event system

Props: Data flows down through props

Stores: Global state management (if implemented in stores/)

API: Centralized API calls through api.js

📝 Code Quality
ESLint: Code linting with Svelte-specific rules

Prettier: Code formatting for consistent style

Svelte Checks: Type checking for Svelte components

🤝 Contributing
Follow the existing code structure and naming conventions

Run npm run lint and npm run format before committing

Test all user flows thoroughly

Ensure responsive design works on different screen sizes

Verify API integration and error handling

📄 License
This project is part of the Expense Splitter application.

Happy expense splitting! 💰✨

