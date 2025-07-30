
const apiEndPoint = 'http://localhost:3001';

// Function to fetch data from API
async function fetchData(endpoint) {
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
    
   
}

// Function to create category table



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