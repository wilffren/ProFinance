
const apiEndPoint = 'http://localhost:3001';

// Function to fetch data from API
export async function fetchData(endpoint) {
    try {
        const response = await fetch(`${apiEndPoint}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
    }
}

// Function to format numbers as currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Function to format date to month
function formatMonth(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
    });
}

// Function to calculate category totals
function calculateCategoryTotals(movements, categories) {
    const totals = {};
    
    categories.forEach(category => {
        totals[category.id] = {
            name: category.name,
            sales: 0,
            purchases: 0
        };
    });
    
    movements.forEach(movement => {
        const amount = parseFloat(movement.amount);
        const categoryId = movement.categoryId;
        
        if (totals[categoryId]) {
            if (movement.type === 'profit') {
                totals[categoryId].sales += amount;
            } else if (movement.type === 'expense') {
                totals[categoryId].purchases += amount;
            }
        }
    });
    
    return totals;
}

// Function to calculate month totals
function calculateMonthTotals(movements) {
    const totals = {};
    
    movements.forEach(movement => {
        const amount = parseFloat(movement.amount);
        const month = formatMonth(movement.date);
        
        if (!totals[month]) {
            totals[month] = {
                sales: 0,
                purchases: 0
            };
        }
        
        if (movement.type === 'profit') {
            totals[month].sales += amount;
        } else if (movement.type === 'expense') {
            totals[month].purchases += amount;
        }
    });
    
    return totals;
}

// Function to find top selling product
function getTopSellingProduct(movements) {
    const productCounts = {};
    
    movements
        .filter(movement => movement.type === 'profit')
        .forEach(movement => {
            const description = movement.description;
            productCounts[description] = (productCounts[description] || 0) + 1;
        });
    
    let topProduct = { name: 'N/A', count: 0 };
    Object.entries(productCounts).forEach(([product, count]) => {
        if (count > topProduct.count) {
            topProduct = { name: product, count: count };
        }
    });
    
    return topProduct;
}

// Function to find top purchased product
function getTopPurchasedProduct(movements) {
    const productCounts = {};
    
    movements
        .filter(movement => movement.type === 'expense')
        .forEach(movement => {
            const description = movement.description;
            productCounts[description] = (productCounts[description] || 0) + 1;
        });
    
    let topProduct = { name: 'N/A', count: 0 };
    Object.entries(productCounts).forEach(([product, count]) => {
        if (count > topProduct.count) {
            topProduct = { name: product, count: count };
        }
    });
    
    return topProduct;
}

// Function to update report cards
function updateReportCards(movements, categories) {
    let totalSales = 0;
    let totalPurchases = 0;
    
    movements.forEach(movement => {
        const amount = parseFloat(movement.amount);
        if (movement.type === 'profit') {
            totalSales += amount;
        } else if (movement.type === 'expense') {
            totalPurchases += amount;
        }
    });
    
    const balance = totalSales - totalPurchases;
    console.log(balance);
    
    
    // Update basic values
    document.getElementById('total-sales').textContent = formatCurrency(totalSales);
    document.getElementById('total-purchases').textContent = formatCurrency(totalPurchases);
    document.getElementById('balance').textContent = formatCurrency(balance);
    
    // Calculate category totals
    const categoryTotals = calculateCategoryTotals(movements, categories);
    
    // Find top sales category
    let topSalesCategory = { name: 'N/A', amount: 0 };
    Object.values(categoryTotals).forEach(category => {
        if (category.sales > topSalesCategory.amount) {
            topSalesCategory = { name: category.name, amount: category.sales };
        }
    });
    
    // Find top purchases category
    let topPurchasesCategory = { name: 'N/A', amount: 0 };
    Object.values(categoryTotals).forEach(category => {
        if (category.purchases > topPurchasesCategory.amount) {
            topPurchasesCategory = { name: category.name, amount: category.purchases };
        }
    });
    
    // Update top categories
    document.getElementById('top-category-sales').textContent = topSalesCategory.name;
    document.getElementById('top-category-sales-amount').textContent = formatCurrency(topSalesCategory.amount);
    document.getElementById('top-category-purchases').textContent = topPurchasesCategory.name;
    document.getElementById('top-category-purchases-amount').textContent = formatCurrency(topPurchasesCategory.amount);
    
    // Top products
    const topSellingProduct = getTopSellingProduct(movements);
    const topPurchasedProduct = getTopPurchasedProduct(movements);
    
    document.getElementById('top-product-sold').textContent = topSellingProduct.name;
    document.getElementById('top-product-sold-amount').textContent = `${topSellingProduct.count} sales`;
    document.getElementById('top-product-purchased').textContent = topPurchasedProduct.name;
    document.getElementById('top-product-purchased-amount').textContent = `${topPurchasedProduct.count} purchases`;
    
    // Calculate month totals
    const monthTotals = calculateMonthTotals(movements);
    
    // Find top sales month
    let topSalesMonth = { name: 'N/A', amount: 0 };
    Object.entries(monthTotals).forEach(([month, data]) => {
        if (data.sales > topSalesMonth.amount) {
            topSalesMonth = { name: month, amount: data.sales };
        }
    });
    
    // Find top purchases month
    let topPurchasesMonth = { name: 'N/A', amount: 0 };
    Object.entries(monthTotals).forEach(([month, data]) => {
        if (data.purchases > topPurchasesMonth.amount) {
            topPurchasesMonth = { name: month, amount: data.purchases };
        }
    });
    
    // Update top months
    document.getElementById('top-month-sales').textContent = topSalesMonth.name;
    document.getElementById('top-month-sales-amount').textContent = formatCurrency(topSalesMonth.amount);
    document.getElementById('top-month-purchases').textContent = topPurchasesMonth.name;
    document.getElementById('top-month-purchases-amount').textContent = formatCurrency(topPurchasesMonth.amount);
}

// Function to create category table
function createCategoryTable(categoryTotals) {
    const tableContainer = document.getElementById('category-totals');
    
    let tableHTML = `
        <table class="report-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Profits</th>
                    <th>Expenses</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    Object.values(categoryTotals).forEach(category => {
        const balance = category.sales - category.purchases;
        tableHTML += `
            <tr>
                <td>${category.name}</td>
                <td>${formatCurrency(category.sales)}</td>
                <td>${formatCurrency(category.purchases)}</td>
                <td class="${balance >= 0 ? 'positive' : 'negative'}">${formatCurrency(balance)}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
}

// Function to create month table
function createMonthTable(monthTotals) {
    const tableContainer = document.getElementById('month-totals');
    
    let tableHTML = `
        <table class="report-table">
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Profits</th>
                    <th>Expenses</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    Object.entries(monthTotals).forEach(([month, data]) => {
        const balance = data.sales - data.purchases;
        tableHTML += `
            <tr>
                <td>${month}</td>
                <td>${formatCurrency(data.sales)}</td>
                <td>${formatCurrency(data.purchases)}</td>
                <td class="${balance >= 0 ? 'positive' : 'negative'}">${formatCurrency(balance)}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
}

// Main function to load reports
async function loadReports() {
    try {
        // Show loading indicator
        const reportCards = document.querySelectorAll('.report-value');
        reportCards.forEach(card => {
            card.textContent = 'Loading...';
        });
        
        // Fetch data
        const [movements, categories] = await Promise.all([
            fetchData('movements'),
            fetchData('categories')
        ]);
        
        if (movements.length === 0) {
            console.warn('No movements found');
            reportCards.forEach(card => {
                if (card.textContent === 'Loading...') {
                    card.textContent = formatCurrency(0);
                }
            });
            return;
        }
        
        // Update report cards
        updateReportCards(movements, categories);
        
        // Create detailed tables
        const categoryTotals = calculateCategoryTotals(movements, categories);
        const monthTotals = calculateMonthTotals(movements);
        
        createCategoryTable(categoryTotals);
        createMonthTable(monthTotals);
        
        console.log('Reports loaded successfully');
        
    } catch (error) {
        console.error('Error loading reports:', error);
        
        const reportCards = document.querySelectorAll('.report-value');
        reportCards.forEach(card => {
            card.textContent = 'Error';
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadReports();
});