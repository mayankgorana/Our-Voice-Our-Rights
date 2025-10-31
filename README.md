# 🧭 MGNREGA Data Dashboard: *Our Voice, Our Rights* 🇮🇳

## 🏗️ Project Overview
The **MGNREGA Data Dashboard** is a full-stack data visualization platform designed to provide actionable insights into the **Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)** district-wise performance across India.

This dashboard aggregates and visualizes high-volume, publicly available data from the official **data.gov.in API**, offering **interactive filtering**, **real-time KPIs**, and **responsive data visualizations** for citizens, researchers, and policymakers.

---

## 🚀 Key Features

- **🎚️ Interactive Filtering** – Dynamically filter data by *State*, *Financial Year*, and *Sorting criteria*.
- **📊 Performance Metrics** – Displays real-time KPIs (e.g., *Total Wages*, *Households Worked*) with compact number formatting (e.g., `15T Cr`, `56L`).
- **📈 Advanced Visualization** – Uses **Recharts** to render comparative **Bar Charts** (Wages vs. Households) and **Pie Charts** (Wage Share Distribution).
- **⚡ Optimized Data Fetching** – Backend includes **in-memory caching** to reduce latency and API load.
- **📱 Responsive UI** – Works seamlessly on all screen sizes with adaptive layouts and scrollable tables.

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Role |
|-------------|------|
| React | Component-based UI and state management |
| Recharts | Data visualization and responsive chart rendering |
| Vanilla CSS | Layout and responsive styling (Flexbox/Grid) |

### **Backend**
| Technology | Role |
|-------------|------|
| Node.js / Express | RESTful API layer for data proxy and processing |
| Axios | HTTP client for fetching data from external API |
| dotenv | Secure management of environment variables (API keys, ports) |

---

## 📁 Directory Structure

├── backend/
│ ├── controllers/
│ │ └── mgnregaController.js # 🎯 Core logic, caching, and sorting
│ ├── routes/
│ │ └── mgnrega.js # API route setup
│ ├── services/
│ │ └── dataGovService.js # External API connection handler
│ └── server.js # Express server entry point
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ │ └── api.js # Frontend API fetch methods
│ │ ├── components/
│ │ │ └── Dashboard.js # 🌟 Main dashboard UI and logic
│ │ └── styles.css # Global and component-level CSS
│ └── ...
│
├── .env # Environment variables (API Key, Ports)
└── README.md



---

## ⚙️ Setup and Installation

### **Prerequisites**
- Node.js **v14+**
- API Key from [data.gov.in](https://data.gov.in) (MGNREGA dataset access)

---

### 🧩 **1. Backend Setup**

Navigate to the backend directory:
```bash
cd backend


Install dependencies:
npm install


Create a .env file in the project root and add your API key:
# .env (in the root folder)
DATA_GOV_API_KEY=YOUR_SECRET_API_KEY
PORT=5000


Start the backend server:
npm start
# Server running on http://localhost:5000


💻 2. Frontend Setup

Navigate to the frontend directory:
cd ../frontend

Install dependencies:
npm install

Start the React app:
npm start
# Application running on http://localhost:3000

📊 Example Use

Select a State and Financial Year from dropdowns.

Instantly view:

KPIs such as total wages and households worked.

Bar & Pie charts for comparative insights.

District-wise detailed data table.

🔒 Environment Variables
Variable	Description
DATA_GOV_API_KEY	API key from data.gov.in
PORT	Backend server port (default: 5000)
```

    
## 🧑‍💻 Author
Mayank Gorana
🌐 Our Voice, Our Rights – Empowering citizens through open data transparency.
