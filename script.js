// EDIT BRAND DETAILS HERE
const BRAND = {
  name: "Grit Studios",
  tagline: "Made for the restless. Built for everyday wear.",
  announcement: "New drop soon — limited pieces only",
  email: "officialgritstds@gmail.com",
  instagram: "@grt.stds"
};

const products = [
  {
    id: 1,
    name: "Diminished Long Sleeve",
    category: "Long Sleeve",
    price: "₱799",
    priceNumber: 799,
    tag: "Best Seller",
    description: "Heavyweight everyday long sleeve with a clean front logo.",
    image: "images/diminished.jpg"
  },
  {
    id: 2,
    name: "Divine Black Edition",
    category: "Oversized",
    price: "₱549",
    priceNumber: 549,
    tag: "Popular",
    description: "Premium black tee with bold graphic design.",
    image: "images/divine-black.jpg"
  },
  {
    id: 3,
    name: "Divine Blue Edition",
    category: "Oversized",
    price: "₱549",
    priceNumber: 549,
    tag: "New",
    description: "Vibrant blue tee perfect for any occasion.",
    image: "images/divine-blue.jpg"
  },
  {
    id: 4,
    name: "Divine White Edition",
    category: "Oversized",
    price: "₱549",
    priceNumber: 549,
    tag: "Essential",
    description: "Classic white tee with minimalist aesthetic.",
    image: "images/divine-white.jpg"
  },
  {
    id: 5,
    name: "Drake Long Sleeve",
    category: "Long Sleeve",
    price: "₱799",
    priceNumber: 799,
    tag: "Limited",
    description: "Soft fleece hoodie with bold back print detailing.",
    image: "images/drake.jpg"
  },
  {
    id: 6,
    name: "Gentlemen's Collection Tee",
    category: "T-Shirt",
    price: "₱449",
    priceNumber: 449,
    tag: "Exclusive",
    description: "Sophisticated design for the modern gentleman.",
    image: "images/gentlemen.jpg"
  },
  {
    id: 7,
    name: "GS Logo Tee",
    category: "T-Shirt",
    price: "₱549",
    priceNumber: 549,
    tag: "Flippable",
    description: "Signature Grit Studios logo. Click to flip and reveal Time Ticks design.",
    image: "images/gs-logo.jpg",
    flipImage: "images/time-ticks.jpg",
    flipName: "Time Ticks Oversized",
    isFlippable: true
  }
];

const collections = [
  "Minimal Streetwear",
  "Graphic Tees",
  "Oversized Fits",
  "Custom Prints"
];

// User Session Management
const USER_SESSION_KEY = "grit-studios-user";

function getCurrentUser() {
  const user = localStorage.getItem(USER_SESSION_KEY);
  return user ? JSON.parse(user) : null;
}

function loginUser(email) {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify({ email }));
  updateNavbarAccount();
}

function logoutUser() {
  localStorage.removeItem(USER_SESSION_KEY);
  updateNavbarAccount();
}

// Cart Management
const CART_KEY = "grit-studios-cart";

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNumber: product.priceNumber,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartItemQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
  const countBadge = document.querySelector(".cart-count");
  if (countBadge) {
    countBadge.textContent = getCartCount();
  }
}

function showToast(message) {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

function updateNavbarAccount() {
  const accountInfo = document.getElementById("accountInfo");
  const accountLinks = document.querySelectorAll(".account-link");
  const user = getCurrentUser();

  if (user) {
    // Show user profile menu in header-actions (desktop)
    accountInfo.innerHTML = `
      <div class="user-menu">
        <button class="user-menu-trigger" type="button">
          <span class="user-avatar">${user.email.charAt(0).toUpperCase()}</span>
          <span class="user-email-display">${user.email}</span>
        </button>
        <div class="user-menu-dropdown">
          <div class="user-menu-header">${user.email}</div>
          <button class="user-menu-logout" type="button">Logout</button>
        </div>
      </div>
    `;

    const menuTrigger = accountInfo.querySelector(".user-menu-trigger");
    const menuDropdown = accountInfo.querySelector(".user-menu-dropdown");
    const logoutBtn = accountInfo.querySelector(".user-menu-logout");

    if (menuTrigger) {
      menuTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        menuDropdown.classList.toggle("active");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        logoutUser();
        showToast("Logged out successfully");
        updateNavbarAccount();
      });
    }

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!accountInfo.contains(e.target) && menuDropdown.classList.contains("active")) {
        menuDropdown.classList.remove("active");
      }
    });

    // Update mobile menu Account link
    accountLinks.forEach(link => {
      link.innerHTML = "Account";
      link.href = "#";
      link.addEventListener("click", (e) => {
        e.preventDefault();
        // Show menu or navigate to account section
        menuTrigger?.click();
      });
    });
  } else {
    // Clear header-actions account info
    accountInfo.innerHTML = "";

    // Update Account links to show as regular links
    accountLinks.forEach(link => {
      link.innerHTML = "Account";
      link.href = "login.html";
      // Remove any click handlers
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
    });
  }
}


function icon(name, className = "icon") {
  const icons = {
    bag: `<svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
    menu: `<svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path></svg>`,
    close: `<svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12"></path><path d="m18 6-12 12"></path></svg>`,
    mail: `<svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path></svg>`,
    shirt: `<svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4 5 6 3 10l4 2v8h10v-8l4-2-2-4-3-2"></path><path d="M8 4a4 4 0 0 0 8 0"></path></svg>`,
    star: `<svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.7 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.7Z"></path></svg>`,
    arrow: `<svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>`,
    search: `<svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>`,
    instagram: `<svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"></circle></svg>`
  };
  return icons[name] || "";
}

function productArt(image, isFlippable = false, flipImage = null) {
  if (isFlippable && flipImage) {
    return `
      <div class="product-art-flip-container">
        <div class="product-art-flipper">
          <div class="product-art-front">
            <img src="${image}" alt="Product image" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="product-art-back">
            <img src="${flipImage}" alt="Product image back" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="product-art">
      <img src="${image}" alt="Product image" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
  `;
}

function renderBrandText() {
  document.querySelectorAll("[data-brand]").forEach((element) => {
    const key = element.getAttribute("data-brand");
    element.textContent = BRAND[key] || "";
  });
}

function renderIcons() {
  document.querySelectorAll("[data-icon]").forEach((element) => {
    const name = element.getAttribute("data-icon");
    element.innerHTML = icon(name, name === "search" ? "icon icon-small" : "icon icon-small");
  });
}

function renderCollections() {
  const collectionsGrid = document.getElementById("collectionsGrid");
  collectionsGrid.innerHTML = collections
    .map((item) => `<div class="collection-card">${item}</div>`)
    .join("");
}

function getCategories() {
  return ["All", ...new Set(products.map((product) => product.category))];
}

function renderCategoryOptions() {
  const categorySelect = document.getElementById("categorySelect");
  categorySelect.innerHTML = getCategories()
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
}

function renderProducts() {
  const searchInput = document.getElementById("productSearch");
  const categorySelect = document.getElementById("categorySelect");
  const productGrid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");

  const searchValue = searchInput.value.trim().toLowerCase();
  const activeCategory = categorySelect.value;

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = !searchValue ||
                         product.name.toLowerCase().includes(searchValue) ||
                         product.description.toLowerCase().includes(searchValue) ||
                         product.category.toLowerCase().includes(searchValue);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filteredProducts
    .map((product) => `
      <article class="product-card ${product.isFlippable ? 'flippable' : ''}" data-product-id="${product.id}">
        ${productArt(product.image, product.isFlippable, product.flipImage)}
        <div class="product-info-top">
          <div>
            <p class="product-category">${product.category}</p>
            <h3 class="product-name">${product.name}</h3>
          </div>
          <span class="product-price">${product.price}</span>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="product-actions">
          <span class="product-tag">${icon("star", "icon-small")} ${product.tag}</span>
          <button class="button button-ghost add-to-cart-btn" type="button" data-product-id="${product.id}">Add</button>
        </div>
      </article>
    `)
    .join("");

  // Handle flip cards
  document.querySelectorAll(".product-card.flippable").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".button")) {
        card.classList.toggle("flipped");
      }
    });
  });

  // Handle add to cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = parseInt(btn.getAttribute("data-product-id"));
      const product = products.find(p => p.id === productId);
      if (product) {
        addToCart(product);
      }
    });
  });

  emptyState.style.display = filteredProducts.length === 0 ? "block" : "none";
}

function setupMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  let menuOpen = false;

  menuToggle.addEventListener("click", () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("open", menuOpen);
    menuToggle.innerHTML = icon(menuOpen ? "close" : "menu");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuOpen = false;
      mobileMenu.classList.remove("open");
      menuToggle.innerHTML = icon("menu");
    });
  });
}

function openCartModal() {
  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.classList.add("active");
    renderCartModal();
  }
}

function closeCartModal() {
  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function renderCartModal() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cart = getCart();

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Your cart is empty</p>`;
    cartTotal.textContent = "₱0";
    return;
  }

  let total = 0;
  cartItems.innerHTML = cart
    .map((item) => {
      const itemTotal = item.priceNumber * item.quantity;
      total += itemTotal;
      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p>${item.price} x ${item.quantity} = ₱${itemTotal}</p>
          </div>
          <div class="cart-item-actions">
            <button class="qty-btn minus-btn" data-product-id="${item.id}">-</button>
            <span class="qty">${item.quantity}</span>
            <button class="qty-btn plus-btn" data-product-id="${item.id}">+</button>
            <button class="remove-btn" data-product-id="${item.id}">✕</button>
          </div>
        </div>
      `;
    })
    .join("");

  cartTotal.textContent = `₱${total}`;

  // Add event listeners
  document.querySelectorAll(".minus-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = parseInt(btn.getAttribute("data-product-id"));
      const cart = getCart();
      const item = cart.find(i => i.id === productId);
      if (item && item.quantity > 1) {
        updateCartItemQuantity(productId, item.quantity - 1);
        renderCartModal();
      }
    });
  });

  document.querySelectorAll(".plus-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = parseInt(btn.getAttribute("data-product-id"));
      const cart = getCart();
      const item = cart.find(i => i.id === productId);
      if (item) {
        updateCartItemQuantity(productId, item.quantity + 1);
        renderCartModal();
      }
    });
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = parseInt(btn.getAttribute("data-product-id"));
      removeFromCart(productId);
      renderCartModal();
    });
  });
}

function proceedToCheckout() {
  const user = getCurrentUser();
  if (!user) {
    showToast("Please login or create account first");
    closeCartModal();
    window.location.href = "login.html";
    return;
  }

  closeCartModal();
  const checkoutModal = document.getElementById("checkoutModal");
  if (checkoutModal) {
    checkoutModal.classList.add("active");
    populateCheckoutForm();
  }
}

function populateCheckoutForm() {
  const cart = getCart();
  const orderSummary = document.getElementById("orderSummary");
  const user = getCurrentUser();

  // Pre-fill email if logged in
  if (user) {
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.value = user.email;
      emailInput.readOnly = true;
    }
  }

  let total = 0;
  let itemsHTML = "";

  cart.forEach((item) => {
    const itemTotal = item.priceNumber * item.quantity;
    total += itemTotal;
    itemsHTML += `
      <div class="order-item">
        <span>${item.name} x ${item.quantity}</span>
        <span>₱${itemTotal}</span>
      </div>
    `;
  });

  orderSummary.innerHTML = `
    ${itemsHTML}
    <div class="order-total">
      <strong>Total:</strong>
      <strong>₱${total}</strong>
    </div>
  `;
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  if (modal) {
    modal.classList.remove("active");
  }

  // Reset email field readonly attribute
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.readOnly = false;
  }
}

function renderOrders() {
  const ordersContainer = document.getElementById("ordersContainer");
  const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyH-1JZ5lTEZFF1psOk-aKVjra_QR4B8NJE6JCu5IC1SlpmnjdevAcR25_czFsv_wlejQ/exec";

  // Show skeleton loaders
  ordersContainer.innerHTML = `
    <div class="skeleton-card">
      <div class="skeleton-header">
        <div class="skeleton-text skeleton-title"></div>
        <div class="skeleton-badge"></div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-text skeleton-line"></div>
        <div class="skeleton-text skeleton-line"></div>
        <div class="skeleton-text skeleton-line"></div>
      </div>
    </div>
    <div class="skeleton-card">
      <div class="skeleton-header">
        <div class="skeleton-text skeleton-title"></div>
        <div class="skeleton-badge"></div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-text skeleton-line"></div>
        <div class="skeleton-text skeleton-line"></div>
        <div class="skeleton-text skeleton-line"></div>
      </div>
    </div>
  `;

  // Check if user is logged in
  const user = getCurrentUser();
  if (!user) {
    ordersContainer.innerHTML = `
      <div class="empty-orders">
        <p><a href="login.html">Login to view your orders</a></p>
      </div>
    `;
    return;
  }

  // Fetch orders from Google Sheets (cross-device persistence)
  fetch(GOOGLE_APPS_SCRIPT_URL)
    .then(response => response.json())
    .then(data => {
      if (!data.success) throw new Error("Failed to fetch orders");

      const sheetOrders = data.orders || [];

      // Filter orders from Google Sheets by logged-in user email (cross-device)
      const userOrders = sheetOrders.filter(order => order.email === user.email);

      if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
          <div class="empty-orders">
            <p>No orders yet. <a href="#shop">Start shopping!</a></p>
          </div>
        `;
        return;
      }

      ordersContainer.innerHTML = userOrders
        .reverse()
        .map((order, index) => {
          const orderDate = new Date(order.orderDate);
          const formattedDate = orderDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          const orderStatus = order.status || "Pending";
          const isPending = orderStatus === "Pending";

          let itemsTotal = 0;
          let itemsHTML = "";

          if (order.items && Array.isArray(order.items)) {
            itemsHTML = order.items
              .map((item) => {
                const itemTotal = item.priceNumber * item.quantity;
                itemsTotal += itemTotal;
                return `
                  <div class="order-item-row">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>₱${itemTotal}</span>
                  </div>
                `;
              })
              .join("");
          } else if (order.total) {
            const totalValue = typeof order.total === 'string'
              ? parseFloat(order.total.replace(/₱|P/g, ''))
              : order.total;
            itemsTotal = isNaN(totalValue) ? 0 : totalValue;
          }

          const cancelButtonHTML = isPending ? `
            <button class="button button-outline cancel-order-btn" data-order-date="${order.orderDate}" data-order-email="${order.email}">
              Cancel Order
            </button>
          ` : "";

          const customerName = order.customer?.fullName || order.customerName || "N/A";
          const customerEmail = order.customer?.email || order.email || user.email;
          const customerPhone = order.customer?.phone || order.phone || "N/A";
          const customerAddress = order.customer?.address || order.address || "N/A";
          const customerCity = order.customer?.city || order.city || "N/A";
          const customerZipCode = order.customer?.zipCode || order.zipCode || "N/A";
          const paymentMethod = order.paymentMethod || order.paymentMethod || "N/A";

          return `
            <div class="order-card">
              <div class="order-header">
                <div class="order-info">
                  <h3>Order #${userOrders.length - index}</h3>
                  <div class="order-meta">
                    <p><strong>Customer:</strong> ${customerName}</p>
                    <p><strong>Email:</strong> ${customerEmail}</p>
                    <p><strong>Phone:</strong> ${customerPhone}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                  </div>
                </div>
                <span class="order-status ${orderStatus.toLowerCase()}">${orderStatus}</span>
              </div>

              <div class="order-items">
                ${itemsHTML}
              </div>

              <div class="order-total-row">
                <span>Total:</span>
                <span>₱${itemsTotal}</span>
              </div>

              <div class="order-footer">
                <div>
                  <p><strong>Shipping Address:</strong></p>
                  <p>${customerAddress}<br>${customerCity}, ${customerZipCode}</p>
                </div>
                <div>
                  <p><strong>Payment Method:</strong></p>
                  <p>${paymentMethod.charAt ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1).replace("-", " ") : paymentMethod}</p>
                </div>
              </div>

              ${cancelButtonHTML}
            </div>
          `;
        })
        .join("");

      // Add cancel button event listeners
      document.querySelectorAll(".cancel-order-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const orderDate = btn.getAttribute("data-order-date");
          const orderEmail = btn.getAttribute("data-order-email");

          if (confirm("Are you sure you want to cancel this order?")) {
            // Remove from localStorage
            let orders = JSON.parse(localStorage.getItem("grit-studios-orders")) || [];
            orders = orders.filter(order => {
              const oEmail = order.customer?.email || order.email;
              return !(order.orderDate === orderDate && oEmail === orderEmail);
            });
            localStorage.setItem("grit-studios-orders", JSON.stringify(orders));

            // Cancel on Google Sheets and wait for completion
            try {
              const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify({
                  action: "cancel",
                  orderDate: orderDate,
                  email: orderEmail
                })
              });
              const data = await response.json();
              if (data.success) {
                console.log("Order cancelled on Google Sheets");
              } else {
                console.error("Error cancelling on Google Sheets:", data.error);
              }
            } catch (error) {
              console.error("Network error:", error);
            }

            showToast("Order cancelled successfully");
            renderOrders();
          }
        });
      });
    })
    .catch(error => {
      console.error("Error fetching orders from Google Sheets:", error);
      // Fallback: show orders from localStorage only (local persistence)
      const allOrders = JSON.parse(localStorage.getItem("grit-studios-orders")) || [];
      const localOrders = allOrders.filter(order => {
        const oEmail = order.customer?.email || order.email;
        return oEmail === user.email;
      });

      if (localOrders.length === 0) {
        ordersContainer.innerHTML = `
          <div class="empty-orders">
            <p>No orders yet. <a href="#shop">Start shopping!</a></p>
          </div>
        `;
        return;
      }

      ordersContainer.innerHTML = localOrders
        .reverse()
        .map((order, index) => {
          const orderDate = new Date(order.orderDate);
          const formattedDate = orderDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          let itemsTotal = 0;
          let itemsHTML = "";

          if (order.items && Array.isArray(order.items)) {
            itemsHTML = order.items
              .map((item) => {
                const itemTotal = item.priceNumber * item.quantity;
                itemsTotal += itemTotal;
                return `
                  <div class="order-item-row">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>₱${itemTotal}</span>
                  </div>
                `;
              })
              .join("");
          } else if (order.total) {
            const totalValue = typeof order.total === 'string'
              ? parseFloat(order.total.replace(/₱|P/g, ''))
              : order.total;
            itemsTotal = isNaN(totalValue) ? 0 : totalValue;
          }

          const customerName = order.customer?.fullName || order.customerName || "N/A";
          const customerEmail = order.customer?.email || order.email || user.email;
          const customerPhone = order.customer?.phone || order.phone || "N/A";
          const customerAddress = order.customer?.address || order.address || "N/A";
          const customerCity = order.customer?.city || order.city || "N/A";
          const customerZipCode = order.customer?.zipCode || order.zipCode || "N/A";
          const paymentMethod = order.paymentMethod || "N/A";

          return `
            <div class="order-card">
              <div class="order-header">
                <div class="order-info">
                  <h3>Order #${localOrders.length - index}</h3>
                  <div class="order-meta">
                    <p><strong>Customer:</strong> ${customerName}</p>
                    <p><strong>Email:</strong> ${customerEmail}</p>
                    <p><strong>Phone:</strong> ${customerPhone}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                  </div>
                </div>
                <span class="order-status pending">Pending</span>
              </div>

              <div class="order-items">
                ${itemsHTML}
              </div>

              <div class="order-total-row">
                <span>Total:</span>
                <span>₱${itemsTotal}</span>
              </div>

              <div class="order-footer">
                <div>
                  <p><strong>Shipping Address:</strong></p>
                  <p>${customerAddress}<br>${customerCity}, ${customerZipCode}</p>
                </div>
                <div>
                  <p><strong>Payment Method:</strong></p>
                  <p>${paymentMethod.charAt ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1).replace("-", " ") : paymentMethod}</p>
                </div>
              </div>

              <button class="button button-outline cancel-order-btn" data-order-date="${order.orderDate}" data-order-email="${customerEmail}">
                Cancel Order
              </button>
            </div>
          `;
        })
        .join("");

      document.querySelectorAll(".cancel-order-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const orderDate = btn.getAttribute("data-order-date");
          const orderEmail = btn.getAttribute("data-order-email");

          if (confirm("Are you sure you want to cancel this order?")) {
            // Remove from localStorage
            let orders = JSON.parse(localStorage.getItem("grit-studios-orders")) || [];
            orders = orders.filter(order => {
              const oEmail = order.customer?.email || order.email;
              return !(order.orderDate === orderDate && oEmail === orderEmail);
            });
            localStorage.setItem("grit-studios-orders", JSON.stringify(orders));

            // Cancel on Google Sheets
            fetch(GOOGLE_APPS_SCRIPT_URL, {
              method: "POST",
              body: JSON.stringify({
                action: "cancel",
                orderDate: orderDate,
                email: orderEmail
              })
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                console.log("Order cancelled on Google Sheets");
              } else {
                console.error("Error cancelling on Google Sheets:", data.error);
              }
            })
            .catch(error => console.error("Network error:", error));

            showToast("Order cancelled successfully");
            renderOrders();
          }
        });
      });
    });
}

function runBasicTests() {
  const categoryList = getCategories();
  console.assert(BRAND.name === "Grit Studios", "Brand name should be Grit Studios.");
  console.assert(products.length >= 4, "Website should include at least four sample products.");
  console.assert(categoryList.includes("All"), "Category filter should include All.");
  console.assert(icon("instagram").includes("svg"), "Instagram icon should render without external dependencies.");
}

function submitCheckoutForm(e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const zipCode = document.getElementById("zipCode").value;
  const paymentMethod = document.getElementById("paymentMethod").value;

  const cart = getCart();
  let total = 0;
  cart.forEach(item => {
    total += item.priceNumber * item.quantity;
  });

  const orderData = {
    customer: {
      fullName,
      email,
      phone,
      address,
      city,
      zipCode
    },
    items: cart,
    paymentMethod,
    orderDate: new Date().toISOString(),
    total
  };

  // Save order to localStorage (backup)
  const orders = JSON.parse(localStorage.getItem("grit-studios-orders")) || [];
  orders.push(orderData);
  localStorage.setItem("grit-studios-orders", JSON.stringify(orders));

  // Send order to Google Sheets
  const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyH-1JZ5lTEZFF1psOk-aKVjra_QR4B8NJE6JCu5IC1SlpmnjdevAcR25_czFsv_wlejQ/exec";

  fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(orderData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log("Order sent to Google Sheets successfully");
    } else {
      console.error("Error sending to Google Sheets:", data.error);
    }
  })
  .catch(error => console.error("Network error:", error));

  // Clear cart
  localStorage.removeItem(CART_KEY);
  updateCartCount();

  // Show success message
  showToast("Order placed successfully!");

  // Close modals and reset form
  closeCheckoutModal();
  document.getElementById("checkoutForm").reset();

  // Refresh orders section to show new order immediately
  renderOrders();

  console.log("Order placed:", orderData);
}

function init() {
  renderBrandText();
  renderIcons();
  renderCollections();
  renderCategoryOptions();
  renderProducts();
  renderOrders();
  setupMenu();
  updateCartCount();
  updateNavbarAccount();
  runBasicTests();

  document.getElementById("productSearch").addEventListener("input", renderProducts);
  document.getElementById("categorySelect").addEventListener("change", renderProducts);

  // Cart button listeners
  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", openCartModal);
  }

  const closeCartBtn = document.querySelector(".close-cart");
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", closeCartModal);
  }

  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", proceedToCheckout);
  }

  // Checkout form submission
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", submitCheckoutForm);
  }

  // Close modal when clicking outside
  const cartModal = document.getElementById("cartModal");
  const checkoutModal = document.getElementById("checkoutModal");

  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) {
        closeCartModal();
      }
    });
  }

  if (checkoutModal) {
    checkoutModal.addEventListener("click", (e) => {
      if (e.target === checkoutModal) {
        closeCheckoutModal();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
