# Finance Dashboard

A clean, modern React-based finance dashboard showcasing income, expenses, and transaction management. Built for a technical assignment.

## Features

- **Dashboard Overview**: Summary cards displaying total balance, income, and expenses. Includes a dynamic pie chart for category spending and a line chart for balance trends over time.
- **Transaction Management**: View, filter, search, and manage a list of financial transactions. Includes pagination/limit logic for the dashboard view.
- **Role-Based Access Control**: Simulate `Admin` and `Viewer` roles. Admins can add, edit, or delete transactions, while Viewers can only consume data.
- **Smart Insights**: Automatically highlights the highest spending category, provides immediate savings observations, flags largest expenses, and gives monthly comparison percent changes.
- **Persistent Data**: Changes made are temporarily persisted in `localStorage`. 

### 🔥 Added Optional Enhancements
- **Dark Mode Support**: Context state handles saving theme preference across reloads. Sleek toggle available in the header.
- **Export Functionality**: A "Download CSV" button generates and downloads a `.csv` format payload of currently filtered transactions safely.
- **Edit Capabilities**: Admins can not just add/delete, but also modify existing payload.
- **UX Polish**: Graceful state boundaries, hover micro-interactions, responsive flex/grid wrappers everywhere.

## Tech Stack

- **React 18** (Context API for State Management)
- **Vite** (Build Tool)
- **Recharts** (Data Visualization)
- **Lucide React** (Open-source Iconography)
- **Vanilla CSS** (Variables, Modern Reset, Custom Theming)

## Setup Instructions

1. **Clone or Extract the folder**
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Start the Development Server**
   ```bash
   npm run dev
   ```
4. **View in Browser**
   Open the browser link (usually `http://localhost:5173`) displayed in your terminal.

## Explanation of Technical Choices

- **State Management**: Opted for **React Context API** instead of heavier libraries like Redux to maintain a practical, assignment-appropriate level of complexity. 
- **Styling**: Went with **Vanilla CSS variables** instead of Tailwind CSS to prove core stylistic capability and to keep the DOM tree clean while maintaining a very modern, premium look.
- **Components**: Components are scoped logically (`DashboardOverview`, `Insights`, `Sidebar`, `TransactionList`), keeping file sizes small and readable without excessive atomization.
- **Role Simulation**: Added an easy dropdown in the Header to demonstrate how UI dynamically adapts to permission levels.
