# ProFinance
this is an MPA built with html, css and javascript, for managing personal finances with an administrative user who will be in charge of adding or evaluating your expenses and entries.

## **Project Status**
✅ Complete ✅

## **🔨 Project Features 🔨**

* `Authentication System`: Secure login functionality with user validation
* `Category Management`: Create, read, update, and delete product categories
* `Financial Movements`: Track sales and purchases with detailed information
* `Interactive Reports`: Generate comprehensive reports with totals, top categories, and monthly analysis
* `Dashboard Interface`: Clean and modern UI for easy navigation
* `Data Persistence`: JSON Server integration for data storage and retrieval
* `Responsive Design`: Optimized for different screen sizes

## **Table of Contents**

* **database/** - JSON database files and configuration
  * `dbFinance.json` - Main database file
  * `README.md` - Database documentation
* **src/** - Source code directory
  * **css/** - Stylesheets
    * `categories.css` - Category management styles
    * `dashboard.css` - Dashboard interface styles
    * `login.css` - Authentication page styles
    * `reports.css` - Reports page styles
  * **js/** - JavaScript files
    * `categories.js` - Category management logic
    * `dashboard.js` - Dashboard Balance funcionallity
    * `guardian.js` - Authentication guard
    * `login.js` - Login system logic
    * `report.js` - Reports generation and display
    * `reportsBalance.js` - balance, profit and expense
  * **services/** - API service layer
    * `categoriesService.js` - Category API calls
    * `dashboardService.js` - Movements API calls
  * **views/** - HTML templates
    * `categories.html` - Category management page
    * `dashboard.html` - Main dashboard and balance page
    * `report.html` - Reports and analytics page
* **public/** - Static assets and resources
* **node_modules/** - Dependencies (generated)
* `index.html` - Main entry point
* `package.json` - Project configuration and dependencies
* `README.md` - Project documentation

## **Technologies**

* **HTML5** and **CSS3** for structure and styling
* **JavaScript (ES6+)** for application logic and interactivity
* **JSON Server** for REST API simulation and data persistence
* **Node.js** for development environment and package management
* **Fetch API** for HTTP requests and data communication

## **Installation & Setup**

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start JSON Server:
   ```bash
   json-server --watch database/dbManager.json --port 3001
   ```
4. Open `index.html` in your browser or serve with a local server

## **API Endpoints**

### **User Authentication**
* `GET /user` - User authentication data

### **Categories**
* `GET /categories` - Retrieve all categories
* `GET /categories/:id` - Retrieve specific category
* `POST /categories` - Create new category
* `PUT /categories/:id` - Update existing category
* `DELETE /categories/:id` - Delete category

### **Operations**
* `GET /movements` - Retrieve all financial movements
* `GET /movements/:id` - Retrieve specific movement
* `POST /movements` - Create new financial movement
* `PUT /movements/:id` - Update existing movement
* `DELETE /movements/:id` - Delete movement


### **Filters**
* `Category` - Filter for category
* `Type` - Filter for a type of (profit/expense)
* `Sort By` - Filter for very options of order

## **Author**

**Wilffren Efrain Muñoz Velasquez** 

Email: munozwilffren@gmail.com

Coder by Clan Malecon

---

*This project demonstrates modern web development practices with clean architecture, RESTful API integration, and responsive user interface design.*
