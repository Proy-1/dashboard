// ========================================
// MANUAL TEST SCRIPT - CRUD Functions
// Copy paste ini ke browser console
// ========================================

console.log('🚀 Starting CRUD Function Test...');

// Test 1: Check if all required functions exist
const requiredFunctions = [
    'editProduct',
    'deleteProduct', 
    'confirmDeleteProduct',
    'saveProduct',
    'showModal',
    'hideModal',
    'showAddProductModal',
    'refreshProducts'
];

console.log('\n📋 Testing Function Availability:');
requiredFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        console.log(`✅ ${funcName} - Available`);
    } else {
        console.error(`❌ ${funcName} - MISSING!`);
    }
});

// Test 2: Check if DOM elements exist
console.log('\n🎯 Testing DOM Elements:');
const requiredElements = [
    'productModal',
    'product-id',
    'product-name', 
    'product-price',
    'product-description',
    'productForm',
    'products-table-body'
];

requiredElements.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
        console.log(`✅ ${elementId} - Found`);
    } else {
        console.error(`❌ ${elementId} - MISSING!`);
    }
});

// Test 3: Check API Service
console.log('\n🔌 Testing API Service:');
if (typeof apiService !== 'undefined') {
    console.log('✅ apiService - Available');
    console.log('📍 Base URL:', apiService.baseURL);
    console.log('🔄 Connection Status:', apiService.isConnected);
} else {
    console.error('❌ apiService - MISSING!');
}

// Test 4: Manual Modal Test
console.log('\n🎭 Testing Modal Functionality:');
try {
    if (typeof showModal === 'function') {
        console.log('📝 You can manually test modal with: showModal("productModal")');
        console.log('📝 And close it with: hideModal("productModal")');
    }
} catch (error) {
    console.error('❌ Modal test error:', error.message);
}

// Test 5: Manual Edit Test (will fail without backend but function should exist)
console.log('\n✏️ Testing Edit Function:');
try {
    if (typeof editProduct === 'function') {
        console.log('📝 You can test edit with: editProduct("test-id")');
        console.log('⚠️ This will show API error if backend not running - that\'s normal');
    }
} catch (error) {
    console.error('❌ Edit function error:', error.message);
}

// Test 6: Check if products page is active
console.log('\n📄 Testing Page Navigation:');
try {
    if (typeof showPage === 'function') {
        console.log('📝 You can switch to products page with: showPage("products")');
    }
} catch (error) {
    console.error('❌ Page navigation error:', error.message);
}

console.log('\n🎯 Test Summary:');
console.log('If all functions show ✅ - Frontend is working correctly');
console.log('If edit/delete still not working - check backend connection');
console.log('Manual test: Go to Products page → check if table loads → try edit/delete buttons');

// Test 7: Quick backend connection test
console.log('\n🔍 Quick Backend Test:');
if (typeof apiService !== 'undefined') {
    apiService.checkConnectionStatus()
        .then(connected => {
            if (connected) {
                console.log('✅ Backend is CONNECTED - CRUD should work');
            } else {
                console.log('❌ Backend is DISCONNECTED - Start backend first');
                console.log('💡 Run: python app.py in backend folder');
            }
        })
        .catch(error => {
            console.log('❌ Backend connection failed:', error.message);
            console.log('💡 Make sure backend is running on localhost:5000');
        });
} else {
    console.error('❌ Cannot test backend - apiService missing');
}
