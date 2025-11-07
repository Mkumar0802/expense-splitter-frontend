# Expense Splitter Frontend

A modern, responsive Svelte-based application for managing shared expenses among friends and roommates. Split bills effortlessly with real-time calculations, balance tracking, and an intuitive user interface.

## ✨ Features

- **👥 User Management** — Add, edit, and manage users with comprehensive validation
- **💰 Expense Tracking** — Create and categorize expenses with flexible participant selection
- **⚖️ Balance Calculation** — View settlement balances and understand who owes whom at a glance
- **🎨 Modern UI** — Clean, responsive design built with Tailwind CSS
- **📱 Real-time Updates** — Instant calculations and live feedback across all pages
- **🔔 Smart Notifications** — Toast notifications for all user actions and errors
- **🔍 Enhanced Search** — Searchable user selection with multi-select capabilities
- **📊 Expense History** — Complete history of all transactions with details

## 📋 Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** v16 or higher ([download here](https://nodejs.org/))
- **npm** v7 or higher (comes with Node.js)
- **Backend API** running on `http://localhost:5000` (Expense Splitter backend)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense-splitter-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Backend Connection

Ensure your backend API is accessible at `http://localhost:5000`. The API configuration is located in `src/api/api.js` and can be modified if your backend runs on a different URL.

### 4. Start Development Server

```bash
npm run dev
```

The application will automatically open at `http://localhost:5173` with hot-reload enabled.

## 📁 Project Structure

```
expense-splitter-frontend/
├── src/
│   ├── api/
│   │   └── api.js                    # Axios instance and API endpoints
│   ├── components/
│   │   ├── ExpenseForm.svelte        # Expense creation form
│   │   ├── ExpenseList.svelte        # Expense display list
│   │   ├── MultiSelectCheckbox.svelte # Reusable multi-select component
│   │   ├── Navbar.svelte             # Navigation header
│   │   └── UserForm.svelte           # User addition form
│   ├── pages/
│   │   ├── Balance.svelte            # Balance overview and settlements
│   │   ├── Expenses.svelte           # Expense management interface
│   │   └── Users.svelte              # User management interface
│   ├── stores/                       # Svelte stores for global state
│   ├── utils/                        # Helper functions and utilities
│   ├── App.svelte                    # Root application component
│   ├── main.js                       # Application entry point
│   └── app.css                       # Global styles and Tailwind imports
├── public/                           # Static assets
├── package.json
├── tailwind.config.js                # Tailwind CSS configuration
├── vite.config.js                    # Vite bundler configuration
├── svelte.config.js                  # Svelte compiler configuration
└── README.md                         # This file
```

## ⚡ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot module reloading |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code with Prettier |

## 🎯 Core Components

### Pages

**Users Page** — Manage all users in your expense group. Add new users, view existing ones, and delete users if needed.

**Expenses Page** — Create new expenses and view complete transaction history. Specify the payer, amount, date, and participants for each expense.

**Balance Page** — View settlement status between all users. See who owes whom and calculate optimal settlement payments.

### Components

**ExpenseForm** — Intelligent form component that automatically includes the payer in the expense participants list. Includes date selection, amount entry, and multi-user selection.

**UserForm** — Add new users to your expense group with built-in validation for names and phone numbers. Includes automatic phone number formatting.

**MultiSelectCheckbox** — Reusable component for selecting multiple users with search functionality, select-all option, and clear selection button.

**ExpenseList** — Displays all expenses in a sortable, readable format with expense amount, date, payer, and participant information.

**Navbar** — Navigation component for seamless movement between pages with visual indicators of the current page.

## 🔌 API Integration

The frontend communicates with your backend through RESTful endpoints:

### Users Endpoints
- `GET /api/users` — Retrieve all users
- `POST /api/users` — Create a new user
- `DELETE /api/users/:id` — Delete a user

### Expenses Endpoints
- `GET /api/expenses` — Retrieve all expenses
- `POST /api/expenses` — Create a new expense
- `DELETE /api/expenses/:id` — Delete an expense

### Balances Endpoints
- `GET /api/balances` — Calculate and retrieve current balances

## 🎨 Styling & Design

**Framework** — Tailwind CSS for utility-first, maintainable styling

**Responsive Design** — Mobile-first approach ensuring perfect display on all devices

**Color Scheme** —
- Primary: `#083D77` (Deep Blue)
- Secondary: `#DA4167` (Coral Red)
- Accent: `#F4D35E` (Golden Yellow)
- Background: `#F4F4F4` (Light Gray)

**Typography** — Clean, readable font stack optimized for web

## ✅ Validation & Error Handling

**Form Validation** — Real-time validation with inline error messages for all input fields

**Error Boundaries** — Comprehensive error handling for failed API requests with user-friendly messages

**User Feedback** — Toast notifications inform users of successful actions, errors, and warnings

**Loading States** — Visual indicators (spinners, disabled buttons) during API operations

## 🔧 Configuration

### Tailwind CSS (`tailwind.config.js`)

```javascript
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
```

### Vite Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
})
```

## 🌐 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚨 Troubleshooting

### Backend Connection Error

If you see "Connection refused" errors:

```bash
# Verify backend is running
curl http://localhost:5000/api/users

# Check if backend is accessible
# Backend should return a list of users (possibly empty)
```

### Dependencies Installation Issues

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Styling Not Loading

```bash
# Restart development server to rebuild Tailwind
npm run dev
```

### API Endpoint Errors

- Verify backend API is running on the correct port (default: 5000)
- Check backend CORS configuration allows requests from `http://localhost:5173`
- Review browser console for detailed error messages
- Use browser DevTools Network tab to inspect API requests

## 💡 Development Tips

- **Use DevTools** — Open browser DevTools to inspect network requests and console messages
- **Check Logs** — Frontend and backend logs provide valuable debugging information
- **Hot Reload** — Changes to component files automatically reload without losing state
- **Code Quality** — Run `npm run lint` before committing code
- **Testing Locally** — Use different browsers to verify responsive design

## 📦 Production Build

### Create Production Bundle

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

Built files are generated in the `dist/` directory and ready for deployment to any static hosting service.

### Deployment Considerations

- Update API base URL in `src/api/api.js` to point to your production backend
- Ensure CORS headers are properly configured on your backend
- Set appropriate environment variables for production
- Test all features before deploying

## 🔄 State Management

The application uses multiple approaches for state management:

- **Svelte Stores** — Global reactive state for user and expense data
- **Component State** — Local state management using `$state` within components
- **Props** — Data flows down through component hierarchy
- **API Integration** — Centralized API calls through `src/api/api.js`

## 📝 Code Quality

- **ESLint** — Linting with Svelte-specific rules for code consistency
- **Prettier** — Automatic code formatting for uniform style
- **Svelte Type Checking** — Type safety across components

## 🤝 Contributing Guidelines

- Follow existing code structure and naming conventions
- Write descriptive commit messages
- Run `npm run lint` and `npm run format` before committing
- Test all user workflows thoroughly
- Ensure responsive design works across devices
- Verify API integration and error handling

## 📄 License

This project is part of the Expense Splitter application suite.

---

**Happy expense splitting!** 💰✨

For issues or questions, please check the backend repository or open an issue in the project repository.
