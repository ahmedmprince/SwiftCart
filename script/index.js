// ১. লোডিং স্পিনার কন্ট্রোল
const manageSpinner = (status) => {
    const spinner = document.getElementById("spinner");
    if (status) {
        spinner.classList.remove("hidden");
    } else {
        spinner.classList.add("hidden");
    }
};

// ২. সব ক্যাটাগরি লোড করা
const loadCategories = () => {
    fetch("https://fakestoreapi.com/products/categories")
        .then(res => res.json())
        .then(data => displayCategories(data))
        .catch(err => console.error(err));
};


// ৩. ক্যাটাগরি বাটনগুলো ডিসপ্লে করা
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("category-container");
    categoryContainer.innerHTML = "";

    // Default "All" বাটন
    const allBtn = document.createElement("button");
    allBtn.className = "btn btn-outline border-purple-700 text-purple-700 rounded-full px-6 category-btn capitalize hover:bg-purple-700 hover:text-white";
    allBtn.innerText = "All Products";
    allBtn.onclick = (e) => {
        updateActiveBtn(e.target);
        loadProducts("all");
    };
    categoryContainer.append(allBtn);

    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline border-gray-300 text-gray-600 rounded-full px-6 category-btn capitalize hover:bg-purple-700 hover:text-white";
        btn.innerText = category;
        btn.onclick = (e) => {
            updateActiveBtn(e.target);
            loadProducts(category);
        };
        categoryContainer.append(btn);
    });
};

// ৪. ক্যাটাগরি বাটন ক্লিক করলে একটিভ কালার চেঞ্জ করা
const updateActiveBtn = (clickedBtn) => {
    const allBtns = document.querySelectorAll(".category-btn");
    allBtns.forEach(btn => {
        btn.classList.remove("bg-purple-700", "text-white", "border-purple-700");
        btn.classList.add("border-gray-300", "text-gray-600");
    });
    clickedBtn.classList.remove("border-gray-300", "text-gray-600");
    clickedBtn.classList.add("bg-purple-700", "text-white", "border-purple-700");
};

// ৫. প্রোডাক্ট লোড করা (Category Wise)
const loadProducts = (category) => {
    manageSpinner(true);
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = ""; 

    let url = "https://fakestoreapi.com/products";
    if (category !== "all") {
        url = `https://fakestoreapi.com/products/category/${category}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayProducts(data);
            manageSpinner(false);
        });
};

// ৬. প্রোডাক্ট কার্ডগুলো ডিসপ্লে করা
const displayProducts = (products) => {
    const productContainer = document.getElementById("product-container");
    
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "group border border-gray-100 rounded-3xl p-4 hover:shadow-2xl transition-all bg-white";
        card.innerHTML = `
            <div class="bg-gray-50 rounded-2xl h-64 overflow-hidden relative p-8">
                <img src="${product.image}" class="w-full h-full object-contain group-hover:scale-110 transition duration-500" alt="${product.title}">
                <div class="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-purple-700 border border-purple-100 italic">
                    ⭐ ${product.rating.rate}
                </div>
            </div>
            <div class="mt-4 px-2">
                <h3 class="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-purple-700 transition">${product.title}</h3>
                <p class="text-gray-400 text-xs mt-1 capitalize italic">${product.category}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-2xl font-black text-gray-900">$${product.price}</span>
                    <button onclick="loadProductDetail(${product.id})" class="btn btn-sm bg-purple-700 text-white rounded-lg border-none hover:bg-black px-4">
                        Details
                    </button>
                </div>
            </div>
        `;
        productContainer.append(card);
    });
};

// ৭. সিঙ্গেল প্রোডাক্ট ডিটেইল লোড করা (API: /products/${id})
const loadProductDetail = async (id) => {
    const url = `https://fakestoreapi.com/products/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayProductDetail(data);
};

// ৮. মডালের ভেতরে ডিটেইল দেখানো
const displayProductDetail = (product) => {
    const container = document.getElementById("modal-content-container");
    container.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8 items-center">
            <div class="w-full md:w-1/2 p-4">
                <img src="${product.image}" class="w-full h-64 object-contain" />
            </div>
            <div class="w-full md:w-1/2 space-y-4">
                <h2 class="text-2xl font-black text-gray-900 leading-tight">${product.title}</h2>
                <span class="badge bg-purple-100 text-purple-700 border-none font-bold p-3">${product.category}</span>
                <p class="text-gray-600 text-sm leading-relaxed">${product.description}</p>
                <div class="flex items-center gap-4">
                    <span class="text-3xl font-black text-purple-700">$${product.price}</span>
                    <div class="text-sm font-bold bg-orange-50 text-orange-500 px-3 py-1 rounded-lg">
                        Rating: ${product.rating.rate} (${product.rating.count} reviews)
                    </div>
                </div>
            </div>
        </div>
    `;
    product_modal.showModal();
};

// পেজ লোড হলে কল হবে
loadCategories();
loadProducts("all");