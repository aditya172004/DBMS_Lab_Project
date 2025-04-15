document.addEventListener('DOMContentLoaded', function() {
    const productBtn = document.getElementById('products-btn');
    const categoriesBtn = document.getElementById('categories-btn');
    const suppliersBtn = document.getElementById('suppliers-btn');
    const sectionTitle = document.getElementById('section-title');
    const addBtn = document.getElementById('add-btn');
    const dataTable = document.getElementById('data-table');
    
    // Modals
    const productModal = document.getElementById('product-modal');
    const categoryModal = document.getElementById('category-modal');
    const supplierModal = document.getElementById('supplier-modal');
    const confirmModal = document.getElementById('confirm-modal');
    
    // Forms
    const productForm = document.getElementById('product-form');
    const categoryForm = document.getElementById('category-form');
    const supplierForm = document.getElementById('supplier-form');
    
    // Close buttons
    const closeButtons = document.querySelectorAll('.close');
    const cancelBtn = document.getElementById('cancel-btn');
    const categoryCancelBtn = document.getElementById('category-cancel-btn');
    const supplierCancelBtn = document.getElementById('supplier-cancel-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    
    // Current state
    let currentSection = 'products';
    let deleteItemId = null;
    let deleteItemType = null;
    
    // Initialize the app
    loadProducts();
    
    // Event Listeners for navigation
    productBtn.addEventListener('click', function() {
        setActiveButton(productBtn);
        currentSection = 'products';
        sectionTitle.textContent = 'Products';
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add New Product';
        loadProducts();
    });
    
    categoriesBtn.addEventListener('click', function() {
        setActiveButton(categoriesBtn);
        currentSection = 'categories';
        sectionTitle.textContent = 'Categories';
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add New Category';
        loadCategories();
    });
    
    suppliersBtn.addEventListener('click', function() {
        setActiveButton(suppliersBtn);
        currentSection = 'suppliers';
        sectionTitle.textContent = 'Suppliers';
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add New Supplier';
        loadSuppliers();
    });
    
    // Add button click handler
    addBtn.addEventListener('click', function() {
        if (currentSection === 'products') {
            document.getElementById('modal-title').textContent = 'Add New Product';
            productForm.reset();
            document.getElementById('product-id').value = '';
            loadCategoriesForSelect();
            loadSuppliersForSelect();
            showModal(productModal);
        } else if (currentSection === 'categories') {
            document.getElementById('category-modal-title').textContent = 'Add New Category';
            categoryForm.reset();
            document.getElementById('category-id').value = '';
            showModal(categoryModal);
        } else if (currentSection === 'suppliers') {
            document.getElementById('supplier-modal-title').textContent = 'Add New Supplier';
            supplierForm.reset();
            document.getElementById('supplier-id').value = '';
            showModal(supplierModal);
        }
    });
    
    // Close modal buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal);
        });
    });
    
    // Cancel buttons
    cancelBtn.addEventListener('click', function() {
        hideModal(productModal);
    });
    
    categoryCancelBtn.addEventListener('click', function() {
        hideModal(categoryModal);
    });
    
    supplierCancelBtn.addEventListener('click', function() {
        hideModal(supplierModal);
    });
    
    cancelDeleteBtn.addEventListener('click', function() {
        hideModal(confirmModal);
    });
    
    // // Form submit handlers
    // productForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     const productId = document.getElementById('product-id').value;
    //     const productData = {
    //         product_name: document.getElementById('product-name').value,
    //         category_id: document.getElementById('category-select').value,
    //         supplier_id: document.getElementById('supplier-select').value,
    //         sku: document.getElementById('product-sku').value,
    //         quantity: document.getElementById('product-quantity').value,
    //         unit_price: document.getElementById('product-price').value,
    //         reorder_level: document.getElementById('product-reorder').value,
    //         description: document.getElementById('product-description').value
    //     };
        
    //     if (productId) {
    //         // Update existing product
    //         updateProduct(productId, productData);
    //     } else {
    //         // Create new product
    //         createProduct(productData);
    //     }
    // });
    // ----------------------------------------------------------------------------------------------

    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const productId = document.getElementById('product-id').value;
        const productData = {
          product_name: document.getElementById('product-name').value,
          category_id: document.getElementById('category-select').value || null,
          supplier_id: document.getElementById('supplier-select').value || null,
          sku: document.getElementById('product-sku').value,
          quantity: parseInt(document.getElementById('product-quantity').value),
          unit_price: parseFloat(document.getElementById('product-price').value),
          reorder_level: parseInt(document.getElementById('product-reorder').value),
          description: document.getElementById('product-description').value
        };
        
        if (productId) {
          // Update existing product
          updateProduct(productId, productData);
        } else {
          // Create new product
          createProduct(productData);
        }
      });

    // ---------------------------------------------------------------------------------
    
    categoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const categoryId = document.getElementById('category-id').value;
        const categoryData = {
            category_name: document.getElementById('category-name').value,
            description: document.getElementById('category-description').value
        };
        
        if (categoryId) {
            // Update existing category
            updateCategory(categoryId, categoryData);
        } else {
            // Create new category
            createCategory(categoryData);
        }
    });
    
    supplierForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const supplierId = document.getElementById('supplier-id').value;
        const supplierData = {
            supplier_name: document.getElementById('supplier-name').value,
            contact_person: document.getElementById('contact-person').value,
            phone: document.getElementById('supplier-phone').value,
            email: document.getElementById('supplier-email').value,
            address: document.getElementById('supplier-address').value
        };
        
        if (supplierId) {
            // Update existing supplier
            updateSupplier(supplierId, supplierData);
        } else {
            // Create new supplier
            createSupplier(supplierData);
        }
    });
    
    // Delete confirmation
    confirmDeleteBtn.addEventListener('click', function() {
        if (deleteItemType === 'product') {
            deleteProduct(deleteItemId);
        } else if (deleteItemType === 'category') {
            deleteCategory(deleteItemId);
        } else if (deleteItemType === 'supplier') {
            deleteSupplier(deleteItemId);
        }
        
        hideModal(confirmModal);
    });
    
    // Utility Functions
    function setActiveButton(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to clicked button
        button.classList.add('active');
    }
    
    function showModal(modal) {
        modal.style.display = 'block';
    }
    
    function hideModal(modal) {
        modal.style.display = 'none';
    }
    
    // API Functions - Products
    function loadProducts() {
        fetch('/api/products')
            .then(response => response.json())
            .then(products => {
                // Generate table headers
                const headers = `
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Supplier</th>
                        <th>SKU</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                `;
                
                // Generate table rows
                let rows = '';
                products.forEach(product => {
                    const stockStatus = getStockStatus(product.quantity, product.reorder_level);
                    rows += `
                        <tr>
                            <td>${product.product_id}</td>
                            <td>${product.product_name}</td>
                            <td>${product.category_name || 'N/A'}</td>
                            <td>${product.supplier_name || 'N/A'}</td>
                            <td>${product.sku}</td>
                            <td>
                                <span class="badge ${stockStatus.class}">${product.quantity} ${stockStatus.text}</span>
                            </td>
                            <td>$${parseFloat(product.unit_price).toFixed(2)}</td>
                            <td class="action-cell">
                                <button class="btn-edit" data-id="${product.product_id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-delete" data-id="${product.product_id}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
                
                // Update the table
                dataTable.innerHTML = `
                    <thead>${headers}</thead>
                    <tbody>${rows}</tbody>
                `;
                
                // Add event listeners to edit and delete buttons
                addProductActionListeners();
            })
            .catch(error => {
                console.error('Error loading products:', error);
                alert('Failed to load products. Please try again.');
            });
    }
    

    function loadCategoriesForSelect() {
        return fetch('/api/categories')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(categories => {
            const categorySelect = document.getElementById('category-select');
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            
            categories.forEach(category => {
              categorySelect.innerHTML += `
                <option value="${category.category_id}">${category.category_name}</option>
              `;
            });
          })
          .catch(error => {
            console.error('Error loading categories:', error);
            alert('Failed to load categories. Please try again.');
          });
      }
    // -----------------------------------------------------------
    // function loadCategoriesForSelect() {
    //     fetch('/api/categories')
    //         .then(response => response.json())
    //         .then(categories => {
    //             const categorySelect = document.getElementById('category-select');
    //             categorySelect.innerHTML = '<option value="">Select Category</option>';
                
    //             categories.forEach(category => {
    //                 categorySelect.innerHTML += `
    //                     <option value="${category.category_id}">${category.category_name}</option>
    //                 `;
    //             });
    //         })
    //         .catch(error => {
    //             console.error('Error loading categories:', error);
    //         });
    // }
    
    function loadSuppliersForSelect() {
        fetch('/api/suppliers')
            .then(response => response.json())
            .then(suppliers => {
                const supplierSelect = document.getElementById('supplier-select');
                supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
                
                suppliers.forEach(supplier => {
                    supplierSelect.innerHTML += `
                        <option value="${supplier.supplier_id}">${supplier.supplier_name}</option>
                    `;
                });
            })
            .catch(error => {
                console.error('Error loading suppliers:', error);
            });
    }
    
    function getStockStatus(quantity, reorderLevel) {
        if (quantity <= 0) {
            return { class: 'badge-danger', text: 'Out of Stock' };
        } else if (quantity <= reorderLevel) {
            return { class: 'badge-warning', text: 'Low Stock' };
        } else {
            return { class: 'badge-success', text: 'In Stock' };
        }
    }
    // --------------------------------------------------------------------------------------------------------
    // function addProductActionListeners() {
    //     // Edit buttons
    //     document.querySelectorAll('.btn-edit').forEach(button => {
    //       button.addEventListener('click', function() {
    //         const productId = this.getAttribute('data-id');
            
    //         // First load the product data
    //         fetch(`/api/products/${productId}`)
    //           .then(response => response.json())
    //           .then(async product => {
    //             document.getElementById('modal-title').textContent = 'Edit Product';
    //             document.getElementById('product-id').value = product.product_id;
    //             document.getElementById('product-name').value = product.product_name;
    //             document.getElementById('product-sku').value = product.sku;
    //             document.getElementById('product-quantity').value = product.quantity;
    //             document.getElementById('product-price').value = product.unit_price;
    //             document.getElementById('product-reorder').value = product.reorder_level;
    //             document.getElementById('product-description').value = product.description || '';
                
    //             // Load categories and suppliers before showing modal
    //             await Promise.all([
    //               loadCategoriesForSelect(),
    //               loadSuppliersForSelect()
    //             ]);
                
    //             // Set selected values after options are loaded
    //             document.getElementById('category-select').value = product.category_id;
    //             document.getElementById('supplier-select').value = product.supplier_id;
                
    //             showModal(productModal);
    //           })
    //           .catch(error => {
    //             console.error('Error fetching product:', error);
    //             alert('Failed to load product details.');
    //           });
    //       });
    //     });
      
    //     // ... rest of the code
    //   }
















    // ------------------------------------------------------------------------------------------------------
    function addProductActionListeners() {
        // Edit buttons
        // document.querySelectorAll('.btn-edit').forEach(button => {
        //     button.addEventListener('click', function() {
        //         const productId = this.getAttribute('data-id');
        //         fetch(`/api/products/${productId}`)
        //             .then(response => response.json())
        //             .then(product => {
        //                 document.getElementById('modal-title').textContent = 'Edit Product';
        //                 document.getElementById('product-id').value = product.product_id;
        //                 document.getElementById('product-name').value = product.product_name;
        //                 document.getElementById('product-sku').value = product.sku;
        //                 document.getElementById('product-quantity').value = product.quantity;
        //                 document.getElementById('product-price').value = product.unit_price;
        //                 document.getElementById('product-reorder').value = product.reorder_level;
        //                 document.getElementById('product-description').value = product.description || '';
                        
        //                 loadCategoriesForSelect().then(() => {
        //                     document.getElementById('category-select').value = product.category_id;
        //                 });
                        
        //                 loadSuppliersForSelect().then(() => {
        //                     document.getElementById('supplier-select').value = product.supplier_id;
        //                 });
                        
        //                 showModal(productModal);
        //             })
        //             .catch(error => {
        //                 console.error('Error fetching product:', error);
        //                 alert('Failed to load product details.');
        //             });
        //     });
        // });
        // Edit buttons
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function() {
              const productId = this.getAttribute('data-id');
              
              // First load the product data
              fetch(`/api/products/${productId}`)
                .then(response => response.json())
                .then(async product => {
                  document.getElementById('modal-title').textContent = 'Edit Product';
                  document.getElementById('product-id').value = product.product_id;
                  document.getElementById('product-name').value = product.product_name;
                  document.getElementById('product-sku').value = product.sku;
                  document.getElementById('product-quantity').value = product.quantity;
                  document.getElementById('product-price').value = product.unit_price;
                  document.getElementById('product-reorder').value = product.reorder_level;
                  document.getElementById('product-description').value = product.description || '';
                  
                  // Load categories and suppliers before showing modal
                  await Promise.all([
                    loadCategoriesForSelect(),
                    loadSuppliersForSelect()
                  ]);
                  
                  // Set selected values after options are loaded
                  document.getElementById('category-select').value = product.category_id;
                  document.getElementById('supplier-select').value = product.supplier_id;
                  
                  showModal(productModal);
                })
                .catch(error => {
                  console.error('Error fetching product:', error);
                  alert('Failed to load product details.');
                });
            });
          });
        
        // Delete buttons
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                deleteItemId = this.getAttribute('data-id');
                deleteItemType = 'product';
                showModal(confirmModal);
            });
        });
    }
    
    function createProduct(productData) {
        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            hideModal(productModal);
            loadProducts();
            alert('Product added successfully!');
        })
        .catch(error => {
            console.error('Error creating product:', error);
            alert('Failed to add product. Please try again.');
        });
    }
    

// ---------------------------------------------------------------------------------------------------------------------

function updateProduct(productId, productData) {
    fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(() => {
      hideModal(productModal);
      loadProducts();
      alert('Product updated successfully!');
    })
    .catch(error => {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    });
  }

// ----------------------------------------------------------------------------------------------------------------------------------

    // function updateProduct(productId, productData) {
    //     fetch(`/api/products/${productId}`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(productData)
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(() => {
    //         hideModal(productModal);
    //         loadProducts();
    //         alert('Product updated successfully!');
    //     })
    //     .catch(error => {
    //         console.error('Error updating product:', error);
    //         alert('Failed to update product. Please try again.');
    //     });
    // }
    
    function deleteProduct(productId) {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            loadProducts();
            alert('Product deleted successfully!');
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
        });
    }
    
    // API Functions - Categories
    function loadCategories() {
        fetch('/api/categories')
            .then(response => response.json())
            .then(categories => {
                // Generate table headers
                const headers = `
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                `;
                
                // Generate table rows
                let rows = '';
                categories.forEach(category => {
                    rows += `
                        <tr>
                            <td>${category.category_id}</td>
                            <td>${category.category_name}</td>
                            <td>${category.description || 'N/A'}</td>
                            <td class="action-cell">
                                <button class="btn-edit" data-id="${category.category_id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-delete" data-id="${category.category_id}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
                
                // Update the table
                dataTable.innerHTML = `
                    <thead>${headers}</thead>
                    <tbody>${rows}</tbody>
                `;
                
                // Add event listeners to edit and delete buttons
                addCategoryActionListeners();
            })
            .catch(error => {
                console.error('Error loading categories:', error);
                alert('Failed to load categories. Please try again.');
            });
    }
    
    function addCategoryActionListeners() {
        // Edit buttons
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function() {
                const categoryId = this.getAttribute('data-id');
                fetch(`/api/categories/${categoryId}`)
                    .then(response => response.json())
                    .then(category => {
                        document.getElementById('category-modal-title').textContent = 'Edit Category';
                        document.getElementById('category-id').value = category.category_id;
                        document.getElementById('category-name').value = category.category_name;
                        document.getElementById('category-description').value = category.description || '';
                        
                        showModal(categoryModal);
                    })
                    .catch(error => {
                        console.error('Error fetching category:', error);
                        alert('Failed to load category details.');
                    });
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                deleteItemId = this.getAttribute('data-id');
                deleteItemType = 'category';
                showModal(confirmModal);
            });
        });
    }
    
    function createCategory(categoryData) {
        fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            hideModal(categoryModal);
            loadCategories();
            alert('Category added successfully!');
        })
        .catch(error => {
            console.error('Error creating category:', error);
            alert('Failed to add category. Please try again.');
        });
    }
    
    function updateCategory(categoryId, categoryData) {
        fetch(`/api/categories/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            hideModal(categoryModal);
            loadCategories();
            alert('Category updated successfully!');
        })
        .catch(error => {
            console.error('Error updating category:', error);
            alert('Failed to update category. Please try again.');
        });
    }
    
    function deleteCategory(categoryId) {
        fetch(`/api/categories/${categoryId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            loadCategories();
            alert('Category deleted successfully!');
        })
        .catch(error => {
            console.error('Error deleting category:', error);
            alert('Failed to delete category. Please try again.');
        });
    }
    
    // API Functions - Suppliers
    function loadSuppliers() {
        fetch('/api/suppliers')
            .then(response => response.json())
            .then(suppliers => {
                // Generate table headers
                const headers = `
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Contact Person</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                `;
                
                // Generate table rows
                let rows = '';
                suppliers.forEach(supplier => {
                    rows += `
                        <tr>
                            <td>${supplier.supplier_id}</td>
                            <td>${supplier.supplier_name}</td>
                            <td>${supplier.contact_person || 'N/A'}</td>
                            <td>${supplier.phone || 'N/A'}</td>
                            <td>${supplier.email || 'N/A'}</td>
                            <td class="action-cell">
                                <button class="btn-edit" data-id="${supplier.supplier_id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-delete" data-id="${supplier.supplier_id}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
                
                // Update the table
                dataTable.innerHTML = `
                    <thead>${headers}</thead>
                    <tbody>${rows}</tbody>
                `;
                
                // Add event listeners to edit and delete buttons
                addSupplierActionListeners();
            })
            .catch(error => {
                console.error('Error loading suppliers:', error);
                alert('Failed to load suppliers. Please try again.');
            });
    }
    
    function addSupplierActionListeners() {
        // Edit buttons
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function() {
                const supplierId = this.getAttribute('data-id');
                fetch(`/api/suppliers/${supplierId}`)
                    .then(response => response.json())
                    .then(supplier => {
                        document.getElementById('supplier-modal-title').textContent = 'Edit Supplier';
                        document.getElementById('supplier-id').value = supplier.supplier_id;
                        document.getElementById('supplier-name').value = supplier.supplier_name;
                        document.getElementById('contact-person').value = supplier.contact_person || '';
                        document.getElementById('supplier-phone').value = supplier.phone || '';
                        document.getElementById('supplier-email').value = supplier.email || '';
                        document.getElementById('supplier-address').value = supplier.address || '';
                        
                        showModal(supplierModal);
                    })
                    .catch(error => {
                        console.error('Error fetching supplier:', error);
                        alert('Failed to load supplier details.');
                    });
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                deleteItemId = this.getAttribute('data-id');
                deleteItemType = 'supplier';
                showModal(confirmModal);
            });
        });
    }
    
    function createSupplier(supplierData) {
        fetch('/api/suppliers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(supplierData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            hideModal(supplierModal);
            loadSuppliers();
            alert('Supplier added successfully!');
        })
        .catch(error => {
            console.error('Error creating supplier:', error);
            alert('Failed to add supplier. Please try again.');
        });
    }
    
    function updateSupplier(supplierId, supplierData) {
        fetch(`/api/suppliers/${supplierId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(supplierData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            hideModal(supplierModal);
            loadSuppliers();
            alert('Supplier updated successfully!');
        })
        .catch(error => {
            console.error('Error updating supplier:', error);
            alert('Failed to update supplier. Please try again.');
        });
    }
    
    function deleteSupplier(supplierId) {
        fetch(`/api/suppliers/${supplierId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            loadSuppliers();
            alert('Supplier deleted successfully!');
        })
        .catch(error => {
            console.error('Error deleting supplier:', error);
            alert('Failed to delete supplier. Please try again.');
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const footer = document.querySelector('.footer');
    let lastScrollPosition = 0;
    let isFooterVisible = false;

    function checkFooterVisibility() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );

        // Show footer only when near the bottom of the page (within 50px)
        if (documentHeight - (currentScroll + windowHeight) < 50) {
            if (!isFooterVisible) {
                footer.classList.add('show');
                isFooterVisible = true;
            }
        } else {
            if (isFooterVisible) {
                footer.classList.remove('show');
                isFooterVisible = false;
            }
        }

        // Hide footer when scrolling up
        if (currentScroll < lastScrollPosition && isFooterVisible) {
            footer.classList.remove('show');
            isFooterVisible = false;
        }

        lastScrollPosition = currentScroll;
    }

    // Add scroll event listener with throttling
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                checkFooterVisibility();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Check initial position
    checkFooterVisibility();
});

// document.addEventListener('DOMContentLoaded', function() {
//     // DOM Elements
//     const productBtn = document.getElementById('products-btn');
//     const categoriesBtn = document.getElementById('categories-btn');
//     const suppliersBtn = document.getElementById('suppliers-btn');
//     // Add this line:
//     const aboutBtn = document.getElementById('about-btn');
//     const sectionTitle = document.getElementById('section-title');
//     const addBtn = document.getElementById('add-btn');
//     const dataTable = document.getElementById('data-table');
    
//     // ... rest of your existing code

//     // Add this event listener after the other navigation event listeners
//     aboutBtn.addEventListener('click', function() {
//         setActiveButton(aboutBtn);
//         currentSection = 'about';
//         sectionTitle.textContent = 'About Developer';
        
//         // Hide the add button when on the About page
//         addBtn.style.display = 'none';
        
//         // Load the about developer content
//         loadAboutDeveloper();
//     });
    
//     // Make sure the add button is visible when returning to other sections
//     productBtn.addEventListener('click', function() {
//         // Your existing code
//         addBtn.style.display = 'block';
//         // ...rest of your code
//     });
    
//     categoriesBtn.addEventListener('click', function() {
//         // Your existing code
//         addBtn.style.display = 'block';
//         // ...rest of your code
//     });
    
//     suppliersBtn.addEventListener('click', function() {
//         // Your existing code
//         addBtn.style.display = 'block';
//         // ...rest of your code
//     });
    
//     // Add this function to load the About Developer content
//     function loadAboutDeveloper() {
//         // Instead of loading data from API, we'll redirect to the about.html page
//         window.location.href = 'about.html';
//     }
    
//     // Add this to your existing code to handle direct navigation from about.html back to main pages
//     if (window.location.pathname.includes('about.html')) {
//         productBtn.addEventListener('click', function() {
//             window.location.href = 'index.html';
//         });
        
//         categoriesBtn.addEventListener('click', function() {
//             window.location.href = 'index.html';
//         });
        
//         suppliersBtn.addEventListener('click', function() {
//             window.location.href = 'index.html';
//         });
//     }
// });

// document.addEventListener('DOMContentLoaded', function() {
//     // DOM Elements
//     const productBtn = document.getElementById('products-btn');
//     const categoriesBtn = document.getElementById('categories-btn');
//     const suppliersBtn = document.getElementById('suppliers-btn');
//     const aboutBtn = document.getElementById('about-btn');
//     const sectionTitle = document.getElementById('section-title');
//     const addBtn = document.getElementById('add-btn');
//     const dataTable = document.getElementById('data-table');
//     const dashboardSection = document.getElementById('dashboard');
    
//     // Track current section
//     let currentSection = 'products';
    
//     // Set active button in navigation
//     function setActiveButton(button) {
//         // Remove active class from all buttons
//         document.querySelectorAll('.nav-btn').forEach(btn => {
//             btn.classList.remove('active');
//         });
//         // Add active class to the clicked button
//         button.classList.add('active');
//     }
    
//     // ... rest of your existing code

//     // Add this event listener for the About Developer button
//     aboutBtn.addEventListener('click', function() {
//         setActiveButton(aboutBtn);
//         currentSection = 'about';
//         sectionTitle.textContent = 'About Developer';
        
//         // Hide the add button when on the About page
//         addBtn.style.display = 'none';
        
//         // Hide the table container and load about content
//         document.querySelector('.table-container').style.display = 'none';
//         loadAboutDeveloper();
//     });
    
//     // Make sure the add button is visible when returning to other sections
//     productBtn.addEventListener('click', function() {
//         setActiveButton(productBtn);
//         currentSection = 'products';
//         sectionTitle.textContent = 'Products';
//         addBtn.style.display = 'block';
//         document.querySelector('.table-container').style.display = 'block';
//         // Call your function to load products data
//         loadProducts();
//     });
    
//     categoriesBtn.addEventListener('click', function() {
//         setActiveButton(categoriesBtn);
//         currentSection = 'categories';
//         sectionTitle.textContent = 'Categories';
//         addBtn.style.display = 'block';
//         document.querySelector('.table-container').style.display = 'block';
//         // Call your function to load categories data
//         loadCategories();
//     });
    
//     suppliersBtn.addEventListener('click', function() {
//         setActiveButton(suppliersBtn);
//         currentSection = 'suppliers';
//         sectionTitle.textContent = 'Suppliers';
//         addBtn.style.display = 'block';
//         document.querySelector('.table-container').style.display = 'block';
//         // Call your function to load suppliers data
//         loadSuppliers();
//     });
    
//     // Function to load the About Developer content
//     function loadAboutDeveloper() {
//         // Create the about developer content based on about.html
//         const aboutContent = `
//         <section id="about-developer">
//             <div class="about-container">
//                 <div class="developer-profile">
//                     <div class="profile-image">
//                         <i class="fas fa-user-circle"></i>
//                     </div>
//                     <div class="profile-info">
//                         <h2>Aditya Kumar Prusti</h2>
//                         <p class="subtitle">Full Stack Developer</p>
//                     </div>
//                 </div>

//                 <div class="about-card">
//                     <h3><i class="fas fa-graduation-cap"></i> Academic Details</h3>
//                     <div class="info-item">
//                         <span class="label">Roll Number:</span>
//                         <span class="value">122CH0693</span>
//                     </div>
//                     <div class="info-item">
//                         <span class="label">Course:</span>
//                         <span class="value">DBMS Laboratory (CS-2082)</span>
//                     </div>
//                     <div class="info-item">
//                         <span class="label">Supervisor:</span>
//                         <span class="value">Dr. S. Asha</span>
//                     </div>
//                 </div>

//                 <div class="about-card">
//                     <h3><i class="fas fa-code"></i> Technology Stack</h3>
//                     <div class="tech-stack">
//                         <div class="tech-category">
//                             <h4>Frontend</h4>
//                             <ul>
//                                 <li><i class="fab fa-html5"></i> HTML5</li>
//                                 <li><i class="fab fa-css3-alt"></i> CSS3</li>
//                                 <li><i class="fab fa-js"></i> JavaScript</li>
//                             </ul>
//                         </div>
//                         <div class="tech-category">
//                             <h4>Backend</h4>
//                             <ul>
//                                 <li><i class="fab fa-node-js"></i> Node.js</li>
//                                 <li><i class="fab fa-node-js"></i> Express.js</li>
//                             </ul>
//                         </div>
//                         <div class="tech-category">
//                             <h4>Database</h4>
//                             <ul>
//                                 <li><i class="fas fa-database"></i> MySQL</li>
//                             </ul>
//                         </div>
//                     </div>
//                 </div>

//                 <div class="about-card">
//                     <h3><i class="fas fa-info-circle"></i> Project Description</h3>
//                     <p>This Inventory Management System is designed to efficiently track and manage product inventory, categories, and suppliers. It provides a user-friendly interface for complete inventory control with features such as:</p>
//                     <ul class="feature-list">
//                         <li>Product management with stock level indicators</li>
//                         <li>Category organization and management</li>
//                         <li>Supplier tracking and contact information</li>
//                         <li>Responsive design for all device types</li>
//                     </ul>
//                 </div>
//             </div>
//         </section>
//         `;
        
//         // Replace the table container content with the about content
//         const tableContainer = document.querySelector('.table-container');
//         tableContainer.innerHTML = aboutContent;
//         tableContainer.style.display = 'block'; // Make sure it's visible
//     }
    
//     // Initialize the application - start with products view
//     productBtn.click();
// });


document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productBtn = document.getElementById('products-btn');
    const categoriesBtn = document.getElementById('categories-btn');
    const suppliersBtn = document.getElementById('suppliers-btn');
    const aboutBtn = document.getElementById('about-btn');
    const sectionTitle = document.getElementById('section-title');
    const addBtn = document.getElementById('add-btn');
    const dataTable = document.getElementById('data-table');
    const dashboardSection = document.getElementById('dashboard');
    const tableContainer = document.querySelector('.table-container');
    
    // Track current section
    let currentSection = 'products';
    
    // Set active button in navigation
    function setActiveButton(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to the clicked button
        button.classList.add('active');
    }
    
    // Create a separate div for the about developer content
    let aboutSection = document.createElement('div');
    aboutSection.id = 'about-section';
    aboutSection.style.display = 'none'; // Initially hidden
    
    // Insert the about section after the table container
    tableContainer.parentNode.insertBefore(aboutSection, tableContainer.nextSibling);
    
    // Add event listener for the About Developer button
    aboutBtn.addEventListener('click', function() {
        setActiveButton(aboutBtn);
        currentSection = 'about';
        sectionTitle.textContent = 'About Developer';
        
        // Hide the add button when on the About page
        addBtn.style.display = 'none';
        
        // Hide the table container and show the about section
        tableContainer.style.display = 'none';
        aboutSection.style.display = 'block';
        
        // Load about content if it hasn't been loaded yet
        if (aboutSection.innerHTML === '') {
            loadAboutDeveloper();
        }
    });
    
    // Make sure the add button is visible when returning to other sections
    productBtn.addEventListener('click', function() {
        setActiveButton(productBtn);
        currentSection = 'products';
        sectionTitle.textContent = 'Products';
        
        // Show the table container and hide the about section
        tableContainer.style.display = 'block';
        aboutSection.style.display = 'none';
        addBtn.style.display = 'block';
        
        // Call your function to load products data
        loadProducts();
    });
    
    categoriesBtn.addEventListener('click', function() {
        setActiveButton(categoriesBtn);
        currentSection = 'categories';
        sectionTitle.textContent = 'Categories';
        
        // Show the table container and hide the about section
        tableContainer.style.display = 'block';
        aboutSection.style.display = 'none';
        addBtn.style.display = 'block';
        
        // Call your function to load categories data
        loadCategories();
    });
    
    suppliersBtn.addEventListener('click', function() {
        setActiveButton(suppliersBtn);
        currentSection = 'suppliers';
        sectionTitle.textContent = 'Suppliers';
        
        // Show the table container and hide the about section
        tableContainer.style.display = 'block';
        aboutSection.style.display = 'none';
        addBtn.style.display = 'block';
        
        // Call your function to load suppliers data
        loadSuppliers();
    });
    
    // Function to load the About Developer content
    function loadAboutDeveloper() {
        // Create the about developer content based on about.html
        aboutSection.innerHTML = `
        <section id="about-developer">
            <div class="about-container">
                <div class="developer-profile">
                    <div class="profile-image">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="profile-info">
                        <h2>Aditya Kumar Prusti</h2>
                        <p class="subtitle">Full Stack Developer</p>
                    </div>
                </div>

                <div class="about-card">
                    <h3><i class="fas fa-graduation-cap"></i> Academic Details</h3>
                    <div class="info-item">
                        <span class="label">Roll Number:</span>
                        <span class="value">122CH0693</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Course:</span>
                        <span class="value">DBMS Laboratory (CS-2082)</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Supervisor:</span>
                        <span class="value">Dr. S. Asha</span>
                    </div>
                </div>

                <div class="about-card">
                    <h3><i class="fas fa-code"></i> Technology Stack</h3>
                    <div class="tech-stack">
                        <div class="tech-category">
                            <h4>Frontend</h4>
                            <ul>
                                <li><i class="fab fa-html5"></i> HTML5</li>
                                <li><i class="fab fa-css3-alt"></i> CSS3</li>
                                <li><i class="fab fa-js"></i> JavaScript</li>
                            </ul>
                        </div>
                        <div class="tech-category">
                            <h4>Backend</h4>
                            <ul>
                                <li><i class="fab fa-node-js"></i> Node.js</li>
                                <li><i class="fab fa-node-js"></i> Express.js</li>
                            </ul>
                        </div>
                        <div class="tech-category">
                            <h4>Database</h4>
                            <ul>
                                <li><i class="fas fa-database"></i> MySQL</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="about-card">
                    <h3><i class="fas fa-info-circle"></i> Project Description</h3>
                    <p>This Inventory Management System is designed to efficiently track and manage product inventory, categories, and suppliers. It provides a user-friendly interface for complete inventory control with features such as:</p>
                    <ul class="feature-list">
                        <li>Product management with stock level indicators</li>
                        <li>Category organization and management</li>
                        <li>Supplier tracking and contact information</li>
                        <li>Responsive design for all device types</li>
                    </ul>
                </div>
            </div>
        </section>
        `;
    }
    
    // Functions to load data for each section
    // These are placeholder functions - replace with your actual implementation
    function loadProducts() {
        console.log("Loading products...");
        // Your existing code to load products
    }
    
    function loadCategories() {
        console.log("Loading categories...");
        // Your existing code to load categories
    }
    
    function loadSuppliers() {
        console.log("Loading suppliers...");
        // Your existing code to load suppliers
    }
    
    // Initialize the application - start with products view
    productBtn.click();
});