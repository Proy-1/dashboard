/* ========================================
   API Service untuk Backend Integration
   Dashboard Admin E-Commerce
======================================== */

class APIService {
    constructor() {
        // Use configuration from config.js
        this.baseURL = window.BackendConfig?.BACKEND_CONFIG?.API_BASE_URL || 'http://localhost:5000/api';
        this.config = window.BackendConfig?.BACKEND_CONFIG || {};
        this.endpoints = window.BackendConfig?.API_ENDPOINTS || {};
        this.messages = window.BackendConfig?.SUCCESS_MESSAGES || {};
        this.errors = window.BackendConfig?.ERROR_MESSAGES || {};
        
        this.isConnected = false;
        this.init();
    }

    /* ========================================
       INITIALIZATION & HEALTH CHECK
    ======================================== */
    
    async init() {
        // Add delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            await this.healthCheck();
            this.isConnected = true;
            console.log('✅ Backend connection established');
            this.showConnectionStatus(true);
        } catch (error) {
            this.isConnected = false;
            console.error('❌ Backend connection failed:', error.message);
            this.showConnectionStatus(false);
        }
    }

    async checkConnectionStatus() {
        try {
            await this.healthCheck();
            this.isConnected = true;
            this.showConnectionStatus(true);
            return true;
        } catch (error) {
            this.isConnected = false;
            console.error('Backend connection failed:', error.message);
            this.showConnectionStatus(false);
            return false;
        }
    }

    async healthCheck() {
        const url = `${this.baseURL}${this.endpoints.HEALTH || '/health'}`;
        
        try {
            // Use simple fetch with timeout fallback
            const fetchWithTimeout = (url, options, timeout = 5000) => {
                return Promise.race([
                    fetch(url, options),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Request timeout')), timeout)
                    )
                ]);
            };
            
            const response = await fetchWithTimeout(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Health check failed with status: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            throw error;
        }
    }

    showConnectionStatus(connected) {
        const statusElement = document.getElementById('backend-status');
        
        if (statusElement) {
            if (connected) {
                statusElement.innerHTML = `
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <i class="fas fa-check-circle mr-1"></i> Backend Connected
                    </span>
                `;
            } else {
                statusElement.innerHTML = `
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <i class="fas fa-exclamation-circle mr-1"></i> Backend Offline
                    </span>
                `;
            }
        }
    }

    /* ========================================
       PRODUCT API METHODS
    ======================================== */

    // GET: Ambil semua produk
    async getProducts() {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.PRODUCTS || '/products'}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            console.log('📦 Products loaded:', products.length);
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            this.showNotification(this.errors.NETWORK_ERROR || 'Error mengambil data produk', 'error');
            return [];
        }
    }

    // GET: Ambil satu produk berdasarkan ID
    async getProduct(productId) {
        try {
            const response = await fetch(`${this.baseURL}/products/${productId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching product:', error);
            this.showNotification('Error mengambil data produk', 'error');
            return null;
        }
    }

    // POST: Tambah produk baru
    async createProduct(productData) {
        try {
            const response = await fetch(`${this.baseURL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newProduct = await response.json();
            console.log('✅ Product created:', newProduct);
            this.showNotification('Produk berhasil ditambahkan', 'success');
            return newProduct;
        } catch (error) {
            console.error('Error creating product:', error);
            this.showNotification('Error menambahkan produk', 'error');
            return null;
        }
    }

    // PUT: Update produk
    async updateProduct(productId, productData) {
        try {
            const response = await fetch(`${this.baseURL}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedProduct = await response.json();
            console.log('✅ Product updated:', updatedProduct);
            this.showNotification('Produk berhasil diperbarui', 'success');
            return updatedProduct;
        } catch (error) {
            console.error('Error updating product:', error);
            this.showNotification('Error memperbarui produk', 'error');
            return null;
        }
    }

    // DELETE: Hapus produk
    async deleteProduct(productId) {
        try {
            const response = await fetch(`${this.baseURL}/products/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Product deleted:', result);
            this.showNotification('Produk berhasil dihapus', 'success');
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showNotification('Error menghapus produk', 'error');
            return false;
        }
    }

    // POST: Upload gambar
    async uploadImage(formData) {
        try {
            const response = await fetch(`${this.baseURL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Image uploaded:', result);
            this.showNotification('Gambar berhasil diupload', 'success');
            return result;
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showNotification('Error mengupload gambar', 'error');
            return null;
        }
    }

    /* ========================================
       UTILITY METHODS
    ======================================== */

    // Format harga untuk tampilan
    formatPrice(price) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    }

    // Format tanggal
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Validasi data produk
    validateProduct(productData) {
        const errors = [];
        
        if (!productData.name || productData.name.trim() === '') {
            errors.push('Nama produk harus diisi');
        }
        
        if (!productData.price || isNaN(productData.price) || productData.price <= 0) {
            errors.push('Harga produk harus berupa angka positif');
        }
        
        if (!productData.description || productData.description.trim() === '') {
            errors.push('Deskripsi produk harus diisi');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Tampilkan notifikasi
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} fixed top-4 right-4 z-50 min-w-64 max-w-sm fade-in`;
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <i class="fas ${this.getNotificationIcon(type)} mr-2"></i>
                    <span>${message}</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-lg">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Loading state management
    showLoading(element) {
        if (element) {
            element.classList.add('loading');
            element.disabled = true;
        }
    }

    hideLoading(element) {
        if (element) {
            element.classList.remove('loading');
            element.disabled = false;
        }
    }

    /* ========================================
       DASHBOARD INTEGRATION METHODS
    ======================================== */

    // Load dan tampilkan produk di tabel
    async loadProductsTable() {
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;

        // Show loading
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-8">
                    <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                    <p class="mt-2 text-gray-500">Memuat data produk...</p>
                </td>
            </tr>
        `;

        const products = await this.getProducts();
        
        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8">
                        <i class="fas fa-box-open text-4xl text-gray-300 mb-2"></i>
                        <p class="text-gray-500">Belum ada produk</p>
                        <button onclick="showModal('productModal')" class="btn btn-primary btn-sm mt-2">
                            <i class="fas fa-plus mr-1"></i> Tambah Produk Pertama
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        // Render products
        tbody.innerHTML = products.map((product, index) => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="text-center font-medium">${index + 1}</td>
                <td>
                    <div class="flex items-center">
                        ${product.image_url ? 
                            `<img src="${this.baseURL.replace('/api', '')}${product.image_url}" alt="${product.name}" class="w-12 h-12 object-cover rounded-lg mr-3">` :
                            `<div class="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                                <i class="fas fa-image text-gray-400"></i>
                            </div>`
                        }
                        <div>
                            <div class="font-medium text-gray-900">${product.name}</div>
                            <div class="text-sm text-gray-500 text-truncate max-w-48">${product.description}</div>
                        </div>
                    </div>
                </td>
                <td class="font-medium text-green-600">${this.formatPrice(product.price)}</td>
                <td>
                    <span class="badge badge-success">Aktif</span>
                </td>
                <td class="text-center">
                    <div class="flex justify-center space-x-2">
                        <button onclick="editProduct('${product._id}')" class="btn btn-sm bg-blue-500 text-white hover:bg-blue-600">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="confirmDeleteProduct('${product._id}', '${product.name}')" class="btn btn-sm bg-red-500 text-white hover:bg-red-600">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Update dashboard stats
        this.updateDashboardStats(products);
    }

    // Update statistik di dashboard
    updateDashboardStats(products) {
        // Total produk
        const totalProductsElement = document.getElementById('total-products');
        if (totalProductsElement) {
            totalProductsElement.textContent = products.length;
        }

        // Total revenue (simulasi)
        const totalRevenue = products.reduce((sum, product) => sum + (product.price * Math.floor(Math.random() * 10)), 0);
        const totalRevenueElement = document.getElementById('total-revenue');
        if (totalRevenueElement) {
            totalRevenueElement.textContent = this.formatPrice(totalRevenue);
        }

        // Update grafik jika ada
        this.updateCharts(products);
    }

    // Update charts (placeholder)
    updateCharts(products) {
        // Implementasi chart akan ditambahkan nanti jika diperlukan
        console.log('Charts updated with', products.length, 'products');
    }
}

// Initialize API Service
const apiService = new APIService();

/* ========================================
   GLOBAL FUNCTIONS FOR UI INTEGRATION
======================================== */

// Function untuk edit produk
async function editProduct(productId) {
    const product = await apiService.getProduct(productId);
    if (product) {
        // Populate form dengan data produk
        document.getElementById('product-id').value = product._id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-image-url').value = product.image_url || '';
        
        // Update modal title
        document.getElementById('modal-title').textContent = 'Edit Produk';
        
        // Show modal
        showModal('productModal');
    }
}

// Function untuk konfirmasi hapus produk
function confirmDeleteProduct(productId, productName) {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"?`)) {
        deleteProduct(productId);
    }
}

// Function untuk hapus produk
async function deleteProduct(productId) {
    const success = await apiService.deleteProduct(productId);
    if (success) {
        // Reload table
        await apiService.loadProductsTable();
    }
}

// Function untuk save produk (create/update)
async function saveProduct() {
    const form = document.getElementById('productForm');
    const formData = new FormData(form);
    
    const productData = {
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        image_url: formData.get('image_url')
    };

    // Validasi
    const validation = apiService.validateProduct(productData);
    if (!validation.isValid) {
        apiService.showNotification(validation.errors.join(', '), 'error');
        return;
    }

    const productId = document.getElementById('product-id').value;
    let success;

    if (productId) {
        // Update existing product
        success = await apiService.updateProduct(productId, productData);
    } else {
        // Create new product
        success = await apiService.createProduct(productData);
    }

    if (success) {
        // Close modal and reload table
        hideModal('productModal');
        form.reset();
        document.getElementById('product-id').value = '';
        await apiService.loadProductsTable();
    }
}

// Function untuk upload gambar
async function uploadProductImage() {
    const fileInput = document.getElementById('product-image');
    const file = fileInput.files[0];
    
    if (!file) {
        apiService.showNotification('Pilih file gambar terlebih dahulu', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const result = await apiService.uploadImage(formData);
    if (result && result.image_url) {
        document.getElementById('product-image-url').value = result.image_url;
        apiService.showNotification('Gambar berhasil diupload', 'success');
    }
}

// Auto-load products when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load products table if we're on the products page
    if (document.getElementById('products-table-body')) {
        apiService.loadProductsTable();
    }
});
