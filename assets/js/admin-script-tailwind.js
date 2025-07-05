// Admin Dashboard JavaScript with Tailwind CSS
// Integrated with Backend API Service

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initializeDashboard();
});

// Check if user is authenticated
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // Update user info in navbar
    updateUserInfo(userEmail);
}

// Update user information in the navbar
function updateUserInfo(email) {
    const userDropdown = document.querySelector('#dropdownMenuButton span');
    if (userDropdown && email) {
        userDropdown.textContent = email.split('@')[0];
    }
}

// Logout functionality
function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }
}

// Initialize dashboard when DOM is loaded
function initializeDashboard() {
    setupSidebarToggle();
    setupNavigation();
    setupDropdown();
    initializeBackendConnection();
    loadDashboardData();
}

// Initialize backend connection
async function initializeBackendConnection() {
    // API Service will automatically initialize and check connection
    // Add backend status indicator to header
    const header = document.querySelector('.main-content .bg-white.shadow-sm');
    if (header) {
        const statusContainer = document.createElement('div');
        statusContainer.id = 'backend-status';
        statusContainer.className = 'inline-block ml-4';
        header.querySelector('.flex.items-center.justify-between').appendChild(statusContainer);
    }
}

// Load dashboard data from backend
async function loadDashboardData() {
    if (typeof apiService !== 'undefined') {
        // Load products and update stats
        const products = await apiService.getProducts();
        updateDashboardStats(products);
    } else {
        console.warn('API Service not loaded, using sample data');
        initializeSampleData();
    }
}

// Sidebar toggle functionality
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('show');
            } else {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            }
        });
    }
    
    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });
}

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding page
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);
            }
        });
    });
}

// Dropdown functionality
function setupDropdown() {
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('dropdownMenu');
        const button = document.getElementById('dropdownMenuButton');
        
        if (!button.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('hidden');
}

// Show specific page
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Load data when switching to products page
        if (pageId === 'products' && typeof apiService !== 'undefined') {
            setTimeout(() => apiService.loadProductsTable(), 100);
        }
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('show');
    }
}

// Modal functionality
function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('addProductForm').reset();
}

/* ========================================
   PRODUCT MANAGEMENT FUNCTIONS
======================================== */

// Show add product modal
function showAddProductModal() {
    document.getElementById('product-id').value = '';
    document.getElementById('productForm').reset();
    document.getElementById('modal-title').textContent = 'Tambah Produk Baru';
    showModal('productModal');
}

// Refresh products table
async function refreshProducts() {
    if (typeof apiService !== 'undefined') {
        await apiService.loadProductsTable();
        apiService.showNotification('Data produk telah di-refresh', 'success');
    }
}

// Modal management functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Update dashboard stats with real data
function updateDashboardStats(products) {
    if (!products || !Array.isArray(products)) return;

    // Update total products
    const totalProductsElement = document.getElementById('total-products');
    if (totalProductsElement) {
        totalProductsElement.textContent = products.length;
    }

    // Update total revenue (simulated based on products)
    const totalRevenue = products.reduce((sum, product) => {
        return sum + (product.price * Math.floor(Math.random() * 10 + 1));
    }, 0);
    
    const totalRevenueElement = document.getElementById('total-revenue');
    if (totalRevenueElement && typeof apiService !== 'undefined') {
        totalRevenueElement.textContent = apiService.formatPrice(totalRevenue);
    }

    // Update orders (simulated)
    const totalOrdersElement = document.getElementById('total-orders');
    if (totalOrdersElement) {
        totalOrdersElement.textContent = Math.floor(products.length * 2.5);
    }

    // Update customers (simulated)
    const totalCustomersElement = document.getElementById('total-customers');
    if (totalCustomersElement) {
        totalCustomersElement.textContent = Math.floor(products.length * 1.8);
    }
}

// Legacy function names for compatibility
function openAddProductModal() {
    showAddProductModal();
}

function closeAddProductModal() {
    hideModal('productModal');
}

function addProduct() {
    saveProduct();
}

// Initialize backend connection status on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof apiService !== 'undefined' && apiService.isConnected) {
            console.log('✅ Dashboard connected to backend successfully');
        } else {
            console.warn('⚠️ Dashboard running in offline mode');
        }
    }, 1000);
});

// Product Management Functions
function addProduct() {
    const form = document.getElementById('addProductForm');
    const formData = new FormData(form);
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form values
    const inputs = form.querySelectorAll('input, select, textarea');
    const product = {
        id: generateId(),
        name: inputs[0].value,
        category: inputs[1].value,
        price: inputs[2].value,
        stock: inputs[3].value,
        description: inputs[4].value,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    // Save product (in real app, this would be an API call)
    saveProduct(product);
    
    // Update table
    loadProducts();
    
    // Close modal
    closeAddProductModal();
    
    // Show success message
    showAlert('Produk berhasil ditambahkan!', 'success');
}

function editProduct(productId) {
    // Load product data and show edit modal
    const product = getProductById(productId);
    if (product) {
        // Populate edit form with product data
        // This would open an edit modal similar to add modal
        showAlert('Fitur edit akan segera tersedia!', 'info');
    }
}

function deleteProduct(productId) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        // Delete from storage
        removeProduct(productId);
        
        // Reload table
        loadProducts();
        
        showAlert('Produk berhasil dihapus!', 'success');
    }
}

// Product data management (localStorage simulation)
function saveProduct(product) {
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}

function getProductById(id) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    return products.find(p => p.id == id);
}

function removeProduct(id) {
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    products = products.filter(p => p.id != id);
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const tableBody = document.getElementById('productsTableBody');
    
    if (tableBody && products.length > 0) {
        // Add new products to table
        products.forEach(product => {
            const existingRow = tableBody.querySelector(`tr[data-product-id="${product.id}"]`);
            if (!existingRow) {
                addProductToTable(product);
            }
        });
    }
}

function addProductToTable(product) {
    const tableBody = document.getElementById('productsTableBody');
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-200 hover:bg-gray-50';
    row.setAttribute('data-product-id', product.id);
    
    row.innerHTML = `
        <td class="py-3 px-4 text-sm">${product.id}</td>
        <td class="py-3 px-4">
            <img src="https://via.placeholder.com/50" class="w-12 h-12 object-cover rounded" alt="Product">
        </td>
        <td class="py-3 px-4 text-sm font-medium">${product.name}</td>
        <td class="py-3 px-4 text-sm">${product.category}</td>
        <td class="py-3 px-4 text-sm">Rp ${parseInt(product.price).toLocaleString('id-ID')}</td>
        <td class="py-3 px-4 text-sm">${product.stock}</td>
        <td class="py-3 px-4">
            <span class="bg-success-100 text-success-800 text-xs font-medium px-2.5 py-0.5 rounded">Aktif</span>
        </td>
        <td class="py-3 px-4">
            <button onclick="editProduct(${product.id})" class="text-warning-600 hover:text-warning-800 mr-2">
                <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteProduct(${product.id})" class="text-danger-600 hover:text-danger-800">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    tableBody.appendChild(row);
}

// Order Management Functions
function viewOrder(orderId) {
    showAlert(`Melihat detail pesanan #${orderId}`, 'info');
}

function updateOrderStatus(orderId) {
    const newStatus = prompt('Masukkan status baru (pending/processing/shipped/delivered):');
    if (newStatus && ['pending', 'processing', 'shipped', 'delivered'].includes(newStatus.toLowerCase())) {
        showAlert(`Status pesanan #${orderId} berhasil diupdate ke ${newStatus}`, 'success');
    } else if (newStatus) {
        showAlert('Status tidak valid!', 'error');
    }
}

// Customer Management Functions
function viewCustomer(customerId) {
    showAlert(`Melihat detail pelanggan ID: ${customerId}`, 'info');
}

function editCustomer(customerId) {
    showAlert(`Edit pelanggan ID: ${customerId} - Fitur akan segera tersedia!`, 'info');
}

// Utility Functions
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.toast-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Color mapping for different alert types
    const colors = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700'
    };
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `toast-alert fixed top-4 right-4 z-50 ${colors[type]} border px-4 py-3 rounded-lg shadow-lg max-w-md`;
    alert.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert && alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Initialize sample data if none exists
function initializeSampleData() {
    const products = localStorage.getItem('products');
    if (!products) {
        const sampleProducts = [
            {
                id: 1001,
                name: 'MacBook Pro M3',
                category: 'laptop',
                price: 25999000,
                stock: 5,
                description: 'Laptop powerful untuk profesional',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 1002,
                name: 'iPad Air M2',
                category: 'tablet',
                price: 8999000,
                stock: 12,
                description: 'Tablet untuk produktivitas dan kreativitas',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
}

// Export functions for external use
window.showPage = showPage;
window.addProduct = addProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.toggleDropdown = toggleDropdown;
window.logout = logout;
window.openAddProductModal = openAddProductModal;
window.closeAddProductModal = closeAddProductModal;
window.viewOrder = viewOrder;
window.updateOrderStatus = updateOrderStatus;
window.viewCustomer = viewCustomer;
window.editCustomer = editCustomer;

// Handle window resize
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('show');
        if (sidebar.classList.contains('collapsed')) {
            mainContent.classList.add('expanded');
        } else {
            mainContent.classList.remove('expanded');
        }
    } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }
});

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('addProductModal');
    if (e.target === modal) {
        closeAddProductModal();
    }
});
