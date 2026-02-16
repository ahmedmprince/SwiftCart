const CART_STORAGE_KEY = "swiftcart_cart";
let cartItems = [];
let productLookup = new Map();

const manageSpinner = (status) => {
    const spinner = document.getElementById("spinner");
    if (!spinner) return;

    if (status) {
        spinner.classList.remove("hidden");
    } else {
        spinner.classList.add("hidden");
    }
};

const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

const saveCartToStorage = () => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
        console.error("Failed to save cart:", error);
    }
};

const loadCartFromStorage = () => {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Failed to load cart:", error);
        return [];
    }
};

const renderCartCount = () => {
    const cartCount = document.getElementById("cart-count");
    if (!cartCount) return;

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalItems;
};

const renderCartSummary = () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItemsContainer || !cartTotal) return;

    if (!cartItems.length) {
        cartItemsContainer.innerHTML = `<p class="text-gray-500 text-sm">Your cart is empty.</p>`;
        cartTotal.textContent = "$0.00";
        return;
    }

    cartItemsContainer.innerHTML = cartItems
        .map((item) => `
            <div class="flex gap-3 border border-gray-100 rounded-2xl p-3">
                <img src="${item.image}" alt="${item.title}" class="w-14 h-14 object-contain rounded-xl bg-gray-50 p-2">
                <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-sm line-clamp-1">${item.title}</h4>
                    <p class="text-xs text-gray-500 mt-1">Qty: ${item.quantity}</p>
                    <p class="text-sm font-bold text-purple-700 mt-1">${formatPrice(item.price * item.quantity)}</p>
                </div>
                <button data-remove-id="${item.id}" class="btn btn-xs btn-error btn-outline self-start">Remove</button>
            </div>
        `)
        .join("");

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartTotal.textContent = formatPrice(total);
};

const syncCartUi = () => {
    renderCartCount();
    renderCartSummary();
    saveCartToStorage();
};

const upsertCartItem = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cartItems.push({
            id: product.id,
            title: product.title,
            price: Number(product.price),
            image: product.image,
            quantity: 1
        });
    }

    syncCartUi();
};

const addToCart = async (productId) => {
    let product = productLookup.get(productId);

    if (!product) {
        const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
        product = await res.json();
        productLookup.set(product.id, product);
    }

    upsertCartItem(product);
};

const removeFromCart = (productId) => {
    cartItems = cartItems.filter((item) => item.id !== productId);
    syncCartUi();
};

const openCartPanel = () => {
    const cartPanel = document.getElementById("cart-panel");
    const cartOverlay = document.getElementById("cart-overlay");
    if (!cartPanel || !cartOverlay) return;

    cartPanel.classList.remove("translate-x-full");
    cartOverlay.classList.remove("hidden");
};

const closeCartPanel = () => {
    const cartPanel = document.getElementById("cart-panel");
    const cartOverlay = document.getElementById("cart-overlay");
    if (!cartPanel || !cartOverlay) return;

    cartPanel.classList.add("translate-x-full");
    cartOverlay.classList.add("hidden");
};

const initCartEvents = () => {
    const cartToggleBtn = document.getElementById("cart-toggle-btn");
    const cartCloseBtn = document.getElementById("cart-close-btn");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartItemsContainer = document.getElementById("cart-items");

    cartToggleBtn?.addEventListener("click", openCartPanel);
    cartCloseBtn?.addEventListener("click", closeCartPanel);
    cartOverlay?.addEventListener("click", closeCartPanel);

    cartItemsContainer?.addEventListener("click", (event) => {
        const target = event.target.closest("[data-remove-id]");
        if (!target) return;

        removeFromCart(Number(target.dataset.removeId));
    });
};

const renderProductSkeleton = (count = 8) => {
    const productContainer = document.getElementById("product-container");
    if (!productContainer) return;

    productContainer.innerHTML = Array.from({ length: count })
        .map(
            () => `
            <div class="border border-gray-100 rounded-3xl p-4 bg-white animate-pulse">
                <div class="bg-gray-100 rounded-2xl h-64 mb-4"></div>
                <div class="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
                <div class="h-8 bg-gray-100 rounded w-full"></div>
            </div>
        `
        )
        .join("");
};

const loadCategories = async () => {
    try {
        const res = await fetch("https://fakestoreapi.com/products/categories");
        const data = await res.json();
        displayCategories(data);
    } catch (error) {
        console.error(error);
    }
};

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("category-container");
    if (!categoryContainer) return;

    categoryContainer.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "btn btn-outline border-purple-700 text-purple-700 rounded-full px-6 category-btn capitalize hover:bg-purple-700 hover:text-white";
    allBtn.innerText = "All Products";
    allBtn.onclick = () => {
        updateActiveBtn(allBtn);
        loadProducts("all");
    };
    categoryContainer.append(allBtn);

    categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-outline border-gray-300 text-gray-600 rounded-full px-6 category-btn capitalize hover:bg-purple-700 hover:text-white";
        btn.innerText = category;
        btn.onclick = () => {
            updateActiveBtn(btn);
            loadProducts(category);
        };
        categoryContainer.append(btn);
    });

    updateActiveBtn(allBtn);
};

const updateActiveBtn = (clickedBtn) => {
    const allBtns = document.querySelectorAll(".category-btn");
    allBtns.forEach((btn) => {
        btn.classList.remove("bg-purple-700", "text-white", "border-purple-700");
        btn.classList.add("border-gray-300", "text-gray-600");
    });

    clickedBtn.classList.remove("border-gray-300", "text-gray-600");
    clickedBtn.classList.add("bg-purple-700", "text-white", "border-purple-700");
};

const loadProducts = async (category) => {
    manageSpinner(true);
    renderProductSkeleton();

    let url = "https://fakestoreapi.com/products";
    if (category !== "all") {
        url = `https://fakestoreapi.com/products/category/${category}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        displayProducts(data);
    } catch (error) {
        console.error(error);
        const productContainer = document.getElementById("product-container");
        if (productContainer) {
            productContainer.innerHTML = `
                <div class="col-span-full text-center py-12 text-red-500">
                    Failed to load products. Please try again.
                </div>
            `;
        }
    } finally {
        manageSpinner(false);
    }
};

const displayProducts = (products) => {
    const productContainer = document.getElementById("product-container");
    if (!productContainer) return;

    productContainer.innerHTML = "";
    productLookup = new Map(products.map((product) => [product.id, product]));

    products.forEach((product) => {
        const card = document.createElement("div");
        card.className = "group border border-gray-100 rounded-3xl p-4 hover:shadow-2xl transition-all bg-white";
        card.innerHTML = `
            <div class="bg-gray-50 rounded-2xl h-64 overflow-hidden relative p-8">
                <img src="${product.image}" class="w-full h-full object-contain group-hover:scale-110 transition duration-500" alt="${product.title}">
                <div class="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-purple-700 border border-purple-100 italic">
                    ${product.rating?.rate ?? 0} / 5
                </div>
            </div>
            <div class="mt-4 px-2">
                <h3 class="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-purple-700 transition">${product.title}</h3>
                <p class="text-gray-400 text-xs mt-1 capitalize italic">${product.category}</p>
                <div class="flex items-center justify-between mt-4 gap-2">
                    <span class="text-2xl font-black text-gray-900">${formatPrice(product.price)}</span>
                    <div class="flex items-center gap-2">
                        <button onclick="loadProductDetail(${product.id})" class="btn btn-sm bg-gray-900 text-white rounded-lg border-none hover:bg-black px-4">
                            Details
                        </button>
                        <button onclick="addToCart(${product.id})" class="btn btn-sm bg-purple-700 text-white rounded-lg border-none hover:bg-purple-800 px-4">
                            Add
                        </button>
                    </div>
                </div>
            </div>
        `;
        productContainer.append(card);
    });
};

const loadProductDetail = async (id) => {
    const product = productLookup.get(id);

    if (product) {
        displayProductDetail(product);
        return;
    }

    const url = `https://fakestoreapi.com/products/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    productLookup.set(data.id, data);
    displayProductDetail(data);
};

const displayProductDetail = (product) => {
    const container = document.getElementById("modal-content-container");
    if (!container) return;

    container.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8 items-center">
            <div class="w-full md:w-1/2 p-4">
                <img src="${product.image}" class="w-full h-64 object-contain" alt="${product.title}" />
            </div>
            <div class="w-full md:w-1/2 space-y-4">
                <h2 class="text-2xl font-black text-gray-900 leading-tight">${product.title}</h2>
                <span class="badge bg-purple-100 text-purple-700 border-none font-bold p-3">${product.category}</span>
                <p class="text-gray-600 text-sm leading-relaxed">${product.description}</p>
                <div class="flex items-center gap-4">
                    <span class="text-3xl font-black text-purple-700">${formatPrice(product.price)}</span>
                    <div class="text-sm font-bold bg-orange-50 text-orange-500 px-3 py-1 rounded-lg">
                        Rating: ${product.rating?.rate ?? 0} (${product.rating?.count ?? 0} reviews)
                    </div>
                </div>
                <button onclick="addToCart(${product.id})" class="btn bg-purple-700 hover:bg-purple-800 border-none text-white px-8">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    product_modal.showModal();
};

const init = () => {
    cartItems = loadCartFromStorage();
    syncCartUi();
    initCartEvents();
    loadCategories();
    loadProducts("all");
};

window.loadProductDetail = loadProductDetail;
window.addToCart = addToCart;

init();
