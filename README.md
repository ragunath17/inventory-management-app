# Inventory Management App

A simple **Inventory Management System** built with **React** (frontend) and **Node.js + Express + SQLite** (backend).  
Supports product CRUD, inline editing, search & filter, import/export via CSV, and inventory history tracking.

---

## Features

- **Products Management**
  - Add, edit, delete products
  - Inline editing for quick updates
  - Stock status indicator (In Stock / Out of Stock)
- **Search & Filter**
  - Search by product name
  - Filter by category
- **Import / Export**
  - Import products via CSV
  - Export products as CSV
- **Inventory History**
  - Track stock changes per product
- **Responsive & Modern UI**
  - Mobile-friendly
  - Styled buttons, modals, and tables

---

## Project Structure

inventory-management-app/
├── backend/ # Node.js + Express + SQLite
│ ├── routes/ # API routes
│ ├── db.js # SQLite connection
│ ├── server.js # Main server
│ └── inventory.db # SQLite database (ignored in git)
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ │ ├── ProductTable/
│ │ │ ├── ProductRow/
│ │ │ ├── AddProductModal/
│ │ │ ├── InventoryHistorySidebar/
│ │ │ └── ImportExportButtons/
│ │ └── App.js
│ └── package.json
└── README.md

---

## Installation

### Backend

```bash
cd backend
npm install
node server.js

Runs server on: http://localhost:5000

cd frontend
npm install
npm start

Usage

Open the app in your browser.

Add new products, edit, or delete existing ones.

Use search bar and category filter to find products.

Import/Export CSV files using the buttons.

Click a product row to see its inventory history in the sidebar.

Notes

SQLite database (inventory.db) is auto-created.

Ensure backend is running before using the frontend.

CSV import skips duplicate products by name.