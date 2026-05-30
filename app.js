/* =============================================
   LA'KENZY SKINCARE & AESTHETIC SPA
   app.js — Updated: Firebase-first products, FA icons, featured products, sidebar marketplace
   ============================================= */

// ===== FIREBASE CONFIG =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, onSnapshot, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFMSN8Qp4HIfeOlWgLEkUX6knoZ1bpH8M",
  authDomain: "studio-3601609342-b4526.firebaseapp.com",
  projectId: "studio-3601609342-b4526",
  storageBucket: "studio-3601609342-b4526.firebasestorage.app",
  messagingSenderId: "921664982987",
  appId: "1:921664982987:web:a2c52b3cec1506aec4f04e"
};

let db;
let firebaseReady = false;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  firebaseReady = true;
} catch (e) {
  console.warn("Firebase not configured yet. Running in demo mode.");
}

// ===== SERVICES DATA (no emojis — use Font Awesome icon classes) =====
const SERVICES = [
  { name: "Skin Analysis",        icon: "fas fa-microscope",        desc: "Advanced skin assessment using professional diagnostic tools to identify your unique skin type and concerns.", price: "₦5,000" },
  { name: "Skin Treatment",       icon: "fas fa-spa",               desc: "Targeted treatment protocols customised to address hyperpigmentation, acne, and uneven texture.", price: "₦15,000" },
  { name: "Full Body Massage",    icon: "fas fa-hand-holding-heart", desc: "Deeply relaxing full-body massage using premium aromatherapy oils for total mind-body renewal.", price: "₦20,000" },
  { name: "Facials",              icon: "fas fa-face-smile-beam",   desc: "Luxurious facial treatments tailored for deep cleansing, hydration, and natural radiance.", price: "₦12,000" },
  { name: "Chemical Peels",       icon: "fas fa-flask",             desc: "Professional-grade peels that resurface skin, reduce dark spots, and reveal a brighter complexion.", price: "₦18,000" },
  { name: "Mesotherapy",          icon: "fas fa-syringe",           desc: "Micro-injections of vitamins and nutrients directly into the skin for intense rejuvenation.", price: "₦25,000" },
  { name: "Teeth Whitening",      icon: "fas fa-teeth-open",        desc: "Advanced LED whitening treatment for a dazzling, confident smile in just one session.", price: "₦15,000" },
  { name: "Pedicure & Manicure",  icon: "fas fa-hand-sparkles",     desc: "Premium nail care ritual with exfoliation, cuticle treatment, and long-lasting polish.", price: "₦8,000" },
  { name: "Waxing",               icon: "fas fa-leaf",              desc: "Gentle, long-lasting hair removal using premium warm wax for silky smooth skin.", price: "₦5,000" },
  { name: "Lash Extension",       icon: "fas fa-eye",               desc: "Individually applied premium silk lashes for dramatic, fluttery eyes that last weeks.", price: "₦20,000" },
  { name: "Microblading",         icon: "fas fa-paint-brush",       desc: "Semi-permanent brow technique that creates natural, hair-like strokes for perfectly shaped brows.", price: "₦35,000" },
  { name: "Stretch Mark Treatment", icon: "fas fa-star-of-life",    desc: "Advanced combination therapy to visibly reduce the appearance of stretch marks and scars.", price: "₦22,000" },
];

// ===== DEMO PRODUCTS — only shown when Firebase has NO products collection =====
const DEMO_PRODUCTS = [
  { id: "p1", name: "Glow Serum 30ml",      category: "Serums",       price: 12500, icon: "fas fa-star", desc: "Vitamin C brightening serum" },
  { id: "p2", name: "Deep Hydration Cream", category: "Moisturisers", price: 9500,  icon: "fas fa-droplet", desc: "24hr moisture barrier cream" },
  { id: "p3", name: "Exfoliating Toner",    category: "Toners",       price: 7500,  icon: "fas fa-leaf", desc: "AHA/BHA gentle exfoliant" },
  { id: "p4", name: "SPF50 Sunscreen",      category: "SPF",          price: 8500,  icon: "fas fa-sun", desc: "Broad spectrum protection" },
  { id: "p5", name: "Cleansing Oil",        category: "Cleansers",    price: 6500,  icon: "fas fa-soap", desc: "Gentle makeup dissolving oil" },
  { id: "p6", name: "Retinol Night Cream",  category: "Moisturisers", price: 14500, icon: "fas fa-moon", desc: "Anti-ageing overnight repair" },
  { id: "p7", name: "Kojic Acid Soap",      category: "Cleansers",    price: 3500,  icon: "fas fa-bars-staggered", desc: "Brightening complexion bar" },
  { id: "p8", name: "Hyaluronic Essence",   category: "Serums",       price: 11000, icon: "fas fa-gem", desc: "Plumping hydration booster" },
];

const TESTIMONIALS = [
  { name: "Adaeze Okonkwo",  location: "Victoria Island, Lagos", stars: 5, text: "LA'KENZY completely transformed my skin. After years of struggling with hyperpigmentation, my skin has never looked more even and glowing. The team is incredibly professional and caring." },
  { name: "Fatima Abdullahi",location: "Abuja",                  stars: 5, text: "I drove all the way from Abuja and it was absolutely worth it. The mesotherapy session was painless and I noticed a visible difference within a week. My friends keep asking what I'm doing!" },
  { name: "Chidinma Eze",    location: "Lekki, Lagos",           stars: 5, text: "The facials here are absolutely divine. You can tell they use premium products and the estheticians truly understand melanin skin. My go-to spa in Lagos." },
  { name: "Blessing Nwosu",  location: "Port Harcourt",          stars: 5, text: "Had my microblading done here and I get compliments every single day. So natural looking! The attention to detail is unmatched. I won't go anywhere else." },
  { name: "Kemi Olatunji",   location: "Surulere, Lagos",        stars: 5, text: "The teeth whitening results were instant and stunning. The environment is so luxurious and clean. Booking is so easy and the team always follows up. 10/10 experience!" },
];

const GALLERY_ITEMS = [
  { label: "Before & After",    tag: "Skin Treatment",  tall: true,  icon: "fas fa-wand-magic-sparkles" },
  { label: "Facial Treatment",  tag: "Facials",                      icon: "fas fa-spa" },
  { label: "Lash Extensions",   tag: "Lash Extensions",              icon: "fas fa-eye" },
  { label: "Body Massage",      tag: "Wellness",        wide: true,  icon: "fas fa-hand-holding-heart" },
  { label: "Chemical Peel",     tag: "Peels",                        icon: "fas fa-flask" },
  { label: "Teeth Whitening",   tag: "Dental",                       icon: "fas fa-teeth-open" },
  { label: "Brow Microblading", tag: "Microblading",   tall: true,  icon: "fas fa-paint-brush" },
  { label: "Manicure & Pedi",   tag: "Nails",                        icon: "fas fa-hand-sparkles" },
];

// ===== LIVE PRODUCTS STATE =====
let PRODUCTS = []; // populated from Firebase or demo fallback
let firebaseProductsLoaded = false;

// ===== CART STATE =====
let cart = [];
try { cart = JSON.parse(localStorage.getItem("lk_cart") || "[]"); } catch (e) { cart = []; }

let activeFilter = "All";
let testiIndex = 0;
let testiAutoplay;
let testiMouseEnterHandler = null;
let testiMouseLeaveHandler = null;

// ===== UTILITIES =====
function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = "toast"; }, 3200);
}

function formatPrice(n) { return "₦" + n.toLocaleString("en-NG"); }

function generateRef() {
  return "LK" + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).slice(2, 5).toUpperCase();
}

function saveCart() {
  try { localStorage.setItem("lk_cart", JSON.stringify(cart)); } catch (e) {}
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById("cartCount").textContent = count;
  const btn = document.getElementById("cartToggle");
  if (btn) btn.setAttribute("aria-label", count > 0 ? `Open cart (${count} items)` : "Open cart");
}

// ===== LOADER =====
function initLoader() {
  const loader = document.getElementById("loader");
  const hide = () => loader.classList.add("hidden");
  if (document.readyState === "complete") {
    setTimeout(hide, 2200);
  } else {
    window.addEventListener("load", () => setTimeout(hide, 2200), { once: true });
  }
  setTimeout(hide, 4000);
}

// ===== NAVBAR =====
function initNavbar() {
  const nav = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const navOverlay = document.getElementById("navOverlay");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });

  function openMobileNav() {
    hamburger.classList.add("open");
    navLinks.classList.add("open");
    navOverlay.classList.add("open");
    navOverlay.style.display = "block";
    document.body.style.overflow = "hidden";
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeMobileNav() {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    navOverlay.classList.remove("open");
    document.body.style.overflow = "";
    hamburger.setAttribute("aria-expanded", "false");
    setTimeout(() => { navOverlay.style.display = ""; }, 400);
  }

  hamburger.addEventListener("click", () => {
    if (hamburger.classList.contains("open")) { closeMobileNav(); } else { openMobileNav(); }
  });
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => closeMobileNav()));
  navOverlay.addEventListener("click", closeMobileNav);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) closeMobileNav();
  });

  const sections = document.querySelectorAll("section[id]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.querySelectorAll("a").forEach(a => {
          const isActive = a.getAttribute("href") === `#${entry.target.id}`;
          a.classList.toggle("active", isActive);
          if (isActive && a.classList.contains("nav-cta")) a.classList.remove("active");
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const els = document.querySelectorAll(".reveal:not(.visible)");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ===== SERVICES =====
function renderServices() {
  const grid = document.getElementById("servicesGrid");
  grid.innerHTML = SERVICES.map((s, i) => `
    <article class="service-card reveal" style="transition-delay:${i * 40}ms">
      <div class="service-img" aria-hidden="true">
        <i class="${s.icon}"></i>
      </div>
      <div class="service-body">
        <h3 class="service-name">${s.name}</h3>
        <p class="service-desc">${s.desc}</p>
        <div class="service-footer">
          <span class="service-price">From ${s.price}</span>
          <button class="service-book" onclick="scrollToBooking('${s.name.replace(/'/g, "\\'")}')">Book Now</button>
        </div>
      </div>
    </article>
  `).join("");
  initReveal();
}

window.scrollToBooking = function(service) {
  const sel = document.getElementById("bService");
  if (sel) {
    const opt = [...sel.options].find(o => o.value === service);
    if (opt) sel.value = service;
  }
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
};

// ===== FIREBASE PRODUCTS LOADER =====
async function loadProductsFromFirebase() {
  if (!db) return;
  try {
    // Real-time listener — handles initial load + future changes instantly
    onSnapshot(collection(db, "products"), (snapshot) => {
      PRODUCTS = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const searchVal = document.getElementById("productSearch")?.value || "";
      renderFilters();
      renderSidebarProducts();
      renderFeaturedProducts();
      renderProducts(searchVal);
    });
  } catch (e) {
    console.warn("Could not load products from Firebase:", e);
  }
}

// ===== PRODUCT ICON HELPER =====
function getProductIcon(product) {
  // Firebase products may have an `icon` field (FA class) or `image` (URL)
  if (product.image) return `<img src="${product.image}" alt="${product.name}" loading="lazy" />`;
  const iconClass = product.icon || "fas fa-bottle-droplet";
  return `<i class="${iconClass}"></i>`;
}

// ===== MARKETPLACE FILTERS & PRODUCTS =====
function renderFilters() {
  const cats = ["All", ...new Set(PRODUCTS.map(p => p.category).filter(Boolean))];
  const wrap = document.getElementById("marketFilters");
  if (!wrap) return;
  wrap.innerHTML = cats.map(c => `
    <button class="filter-btn ${c === activeFilter ? "active" : ""}" data-cat="${c}" aria-pressed="${c === activeFilter}">${c}</button>
  `).join("");
  wrap.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.cat;
      renderFilters();
      renderProducts(document.getElementById("productSearch")?.value || "");
    });
  });
}

function renderProducts(queryStr = "") {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeFilter === "All" || p.category === activeFilter;
    const matchQ = (p.name || "").toLowerCase().includes(queryStr.toLowerCase()) ||
                   (p.category || "").toLowerCase().includes(queryStr.toLowerCase());
    return matchCat && matchQ;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:3rem 0">No products found.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <article class="product-card reveal">
      <div class="product-img" aria-hidden="true">${getProductIcon(p)}</div>
      <div class="product-body">
        <p class="product-category">${p.category || ""}</p>
        <h4 class="product-name">${p.name}</h4>
        <p class="product-desc">${p.desc || p.description || ""}</p>
        <p class="product-price">${formatPrice(p.price)}</p>
        <div class="product-controls">
          <div class="qty-selector" role="group" aria-label="Quantity for ${p.name}">
            <button onclick="changeQty('${p.id}', -1)" aria-label="Decrease quantity">−</button>
            <span id="qty-${p.id}" aria-live="polite">1</span>
            <button onclick="changeQty('${p.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
          <button class="add-cart-btn" onclick="addToCart('${p.id}')">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join("");
  initReveal();
}

// ===== FEATURED PRODUCTS (Home — top 4 only, hidden when no products) =====
function renderFeaturedProducts() {
  const grid = document.getElementById("featuredProductsGrid");
  const section = document.getElementById("featured-products");
  if (!grid) return;

  if (PRODUCTS.length === 0) {
    if (section) section.style.display = "none"; // hide entire section — no demo bleed
    return;
  }
  if (section) section.style.display = ""; // show once products exist

  const featured = PRODUCTS.slice(0, 4);
  if (featured.length === 0) {
    grid.innerHTML = "";
    return;
  }

  grid.innerHTML = featured.map(p => `
    <article class="product-card reveal">
      <div class="product-img" aria-hidden="true">${getProductIcon(p)}</div>
      <div class="product-body">
        <p class="product-category">${p.category || ""}</p>
        <h4 class="product-name">${p.name}</h4>
        <p class="product-desc">${p.desc || p.description || ""}</p>
        <p class="product-price">${formatPrice(p.price)}</p>
        <div class="product-controls">
          <div class="qty-selector" role="group" aria-label="Quantity for ${p.name}">
            <button onclick="changeQty('${p.id}', -1)" aria-label="Decrease quantity">−</button>
            <span id="qty-feat-${p.id}" aria-live="polite">1</span>
            <button onclick="changeQty('${p.id}', 1, true)" aria-label="Increase quantity">+</button>
          </div>
          <button class="add-cart-btn" onclick="addToCartFeat('${p.id}')">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join("");
  initReveal();
}

// ===== SIDEBAR PRODUCTS =====
function renderSidebarProducts() {
  const list = document.getElementById("sidebarProductsList");
  if (!list) return;

  if (PRODUCTS.length === 0) {
    list.innerHTML = `<p class="sidebar-empty">No products yet.</p>`;
    return;
  }

  list.innerHTML = PRODUCTS.map(p => `
    <div class="sidebar-product-item">
      <div class="sidebar-product-icon">${getProductIcon(p)}</div>
      <div class="sidebar-product-info">
        <span class="sidebar-product-name">${p.name}</span>
        <span class="sidebar-product-price">${formatPrice(p.price)}</span>
      </div>
      <button class="sidebar-add-btn" onclick="addToCartById('${p.id}')" aria-label="Add ${p.name} to cart">
        <i class="fas fa-plus"></i>
      </button>
    </div>
  `).join("");
}

window.changeQty = function(id, delta, isFeat = false) {
  const elId = isFeat ? `qty-feat-${id}` : `qty-${id}`;
  const el = document.getElementById(elId);
  if (!el) return;
  let val = parseInt(el.textContent) + delta;
  if (val < 1) val = 1;
  el.textContent = val;
};

window.addToCart = function(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const qtyEl = document.getElementById(`qty-${id}`);
  const qty = qtyEl ? parseInt(qtyEl.textContent) : 1;
  const existing = cart.find(c => c.id === id);
  if (existing) { existing.qty += qty; } else { cart.push({ ...product, qty }); }
  saveCart(); renderCart();
  showToast(`${product.name} added to cart ✦`, "success");
};

window.addToCartFeat = function(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const qtyEl = document.getElementById(`qty-feat-${id}`);
  const qty = qtyEl ? parseInt(qtyEl.textContent) : 1;
  const existing = cart.find(c => c.id === id);
  if (existing) { existing.qty += qty; } else { cart.push({ ...product, qty }); }
  saveCart(); renderCart();
  showToast(`${product.name} added to cart ✦`, "success");
};

window.addToCartById = function(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(c => c.id === id);
  if (existing) { existing.qty += 1; } else { cart.push({ ...product, qty: 1 }); }
  saveCart(); renderCart();
  showToast(`${product.name} added to cart ✦`, "success");
};

// ===== CART =====
function renderCart() {
  const items = document.getElementById("cartItems");
  const total = document.getElementById("cartTotal");

  if (cart.length === 0) {
    items.innerHTML = `<p class="cart-empty">Your cart is empty.<br/>Browse our marketplace to add products.</p>`;
    total.textContent = "₦0";
    return;
  }

  items.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img" aria-hidden="true">${getProductIcon(item)}</div>
      <div>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${formatPrice(item.price)}</p>
        <div class="cart-item-qty" role="group" aria-label="Quantity for ${item.name}">
          <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)" aria-label="Decrease">−</button>
          <span class="qty-val" aria-live="polite">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)" aria-label="Increase">+</button>
        </div>
      </div>
      <button class="cart-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove ${item.name}">✕</button>
    </div>
  `).join("");

  const sum = cart.reduce((s, i) => s + i.price * i.qty, 0);
  total.textContent = formatPrice(sum);
}

window.updateCartQty = function(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  saveCart(); renderCart();
};

window.removeFromCart = function(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart(); renderCart();
};

function initCart() {
  const toggle = document.getElementById("cartToggle");
  const close  = document.getElementById("cartClose");
  const overlay= document.getElementById("cartOverlay");
  const panel  = document.getElementById("cartPanel");
  const checkout=document.getElementById("cartCheckout");

  const openCart  = () => { panel.classList.add("open"); overlay.classList.add("open"); document.body.style.overflow = "hidden"; toggle.setAttribute("aria-expanded", "true"); };
  const closeCart = () => { panel.classList.remove("open"); overlay.classList.remove("open"); document.body.style.overflow = ""; toggle.setAttribute("aria-expanded", "false"); };

  toggle.addEventListener("click", openCart);
  close.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("open")) closeCart(); });

  checkout.addEventListener("click", () => {
    if (cart.length === 0) { showToast("Your cart is empty", "error"); return; }
    const lines = cart.map(i => `• ${i.name} x${i.qty} — ${formatPrice(i.price * i.qty)}`).join("\n");
    const total = formatPrice(cart.reduce((s, i) => s + i.price * i.qty, 0));
    const msg = encodeURIComponent(`Hello LA'KENZY! 🌟\n\nI'd like to order:\n${lines}\n\n*Total: ${total}*\n\nPlease confirm availability. Thank you!`);
    window.open(`https://wa.me/2348039239749?text=${msg}`, "_blank", "noopener,noreferrer");
  });

  saveCart(); renderCart();
}

// ===== SIDEBAR TOGGLE =====
function initSidebar() {
  const sidebar    = document.getElementById("productSidebar");
  const openBtn    = document.getElementById("sidebarOpen");
  const closeBtn   = document.getElementById("sidebarClose");
  const overlay    = document.getElementById("sidebarOverlay");

  if (!sidebar || !openBtn) return;

  const openSidebar  = () => { sidebar.classList.add("open"); overlay.classList.add("open"); document.body.style.overflow = "hidden"; };
  const closeSidebar = () => { sidebar.classList.remove("open"); overlay.classList.remove("open"); document.body.style.overflow = ""; };

  openBtn.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && sidebar.classList.contains("open")) closeSidebar(); });
}

// ===== BOOKING =====
function initBooking() {
  const form = document.getElementById("bookingForm");
  const modal = document.getElementById("bookingModal");
  const modalClose = document.getElementById("modalClose");
  const modalRef = document.getElementById("modalRef");

  const dateInput = document.getElementById("bDate");
  if (dateInput) { const today = new Date().toISOString().split("T")[0]; dateInput.min = today; }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("bookBtn");

    const name    = document.getElementById("bName").value.trim();
    const phone   = document.getElementById("bPhone").value.trim();
    const service = document.getElementById("bService").value;
    const date    = document.getElementById("bDate").value;
    const time    = document.getElementById("bTime").value;
    const email   = document.getElementById("bEmail").value.trim();
    const notes   = document.getElementById("bNotes").value.trim();

    if (!name || !phone || !service || !date || !time) { showToast("Please fill in all required fields", "error"); return; }
    if (phone.replace(/\D/g, "").length < 10) { showToast("Please enter a valid phone number", "error"); return; }

    btn.disabled = true;
    btn.innerHTML = "<span>Processing...</span>";

    const ref = generateRef();
    const appointment = { name, phone, email, service, date, time, notes, ref, createdAt: new Date().toISOString() };

    try {
      if (db) {
        const q = query(collection(db, "appointments"), where("date", "==", date), where("time", "==", time), where("service", "==", service));
        const snap = await getDocs(q);
        if (!snap.empty) {
          showToast("This slot is already booked. Please choose another time.", "error");
          btn.disabled = false;
          btn.innerHTML = "<span>Confirm Appointment</span>";
          return;
        }
        await addDoc(collection(db, "appointments"), { ...appointment, createdAt: serverTimestamp() });
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }

      form.reset();
      modalRef.textContent = `Booking Reference: ${ref}`;
      modal.classList.add("open");
      showToast("Appointment booked successfully! ✦", "success");
    } catch (err) {
      console.error(err);
      showToast("Booking failed. Please try again.", "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = "<span>Confirm Appointment</span>";
    }
  });

  modalClose.addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) modal.classList.remove("open"); });
}

// ===== TESTIMONIALS =====
function renderTestimonials() {
  const slider = document.getElementById("testiSlider");
  const dots   = document.getElementById("testiDots");

  slider.innerHTML = TESTIMONIALS.map((t) => `
    <div class="testi-card" role="listitem" aria-label="Testimonial from ${t.name}">
      <div class="testi-stars" aria-label="${t.stars} out of 5 stars">${"★".repeat(t.stars)}</div>
      <p class="testi-text">"${t.text}"</p>
      <div class="testi-author">
        <div class="testi-avatar" aria-hidden="true">${t.name[0]}</div>
        <div>
          <p class="testi-name">${t.name}</p>
          <p class="testi-location">${t.location}</p>
        </div>
      </div>
    </div>
  `).join("");

  dots.innerHTML = TESTIMONIALS.map((_, i) => `
    <button class="testi-dot ${i === 0 ? "active" : ""}" data-i="${i}" role="tab" aria-selected="${i === 0}" aria-label="Go to testimonial ${i + 1}"></button>
  `).join("");

  dots.querySelectorAll(".testi-dot").forEach(dot => {
    dot.addEventListener("click", () => goToTesti(parseInt(dot.dataset.i)));
  });

  startTestiAutoplay();

  let startX = 0;
  slider.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener("touchend", e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextTesti() : prevTesti();
  });
}

function goToTesti(i) {
  testiIndex = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
  const card = document.querySelector(".testi-card");
  const gap = 24;
  const cardWidth = card ? (card.getBoundingClientRect().width + gap) : (380 + gap);
  document.getElementById("testiSlider").style.transform = `translateX(-${testiIndex * cardWidth}px)`;
  document.querySelectorAll(".testi-dot").forEach((d, idx) => {
    d.classList.toggle("active", idx === testiIndex);
    d.setAttribute("aria-selected", String(idx === testiIndex));
  });
}

function nextTesti() { goToTesti(testiIndex + 1); }
function prevTesti() { goToTesti(testiIndex - 1); }

function startTestiAutoplay() {
  clearInterval(testiAutoplay);
  testiAutoplay = setInterval(nextTesti, 4500);
  const sliderEl = document.getElementById("testiSlider");
  if (testiMouseEnterHandler) {
    sliderEl.removeEventListener("mouseenter", testiMouseEnterHandler);
    sliderEl.removeEventListener("mouseleave", testiMouseLeaveHandler);
  }
  testiMouseEnterHandler = () => clearInterval(testiAutoplay);
  testiMouseLeaveHandler = startTestiAutoplay;
  sliderEl.addEventListener("mouseenter", testiMouseEnterHandler);
  sliderEl.addEventListener("mouseleave", testiMouseLeaveHandler);
}

// ===== GALLERY =====
function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = GALLERY_ITEMS.map((item) => `
    <div class="gallery-item reveal ${item.tall ? "tall" : ""} ${item.wide ? "wide" : ""}" role="img" aria-label="${item.label} — ${item.tag}">
      <div class="gallery-ph-icon" aria-hidden="true"><i class="${item.icon}"></i></div>
      <p class="gallery-ph-text">${item.tag}</p>
      <div class="gallery-overlay" aria-hidden="true"><span>${item.label}</span></div>
    </div>
  `).join("");
  initReveal();
}

// ===== CONTACT =====
function initContact() {
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Message sent! We'll get back to you soon. ✦", "success");
    form.reset();
  });
}

// ===== SEARCH =====
function initSearch() {
  const input = document.getElementById("productSearch");
  if (!input) return;
  let searchTimer;
  input.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => renderProducts(input.value), 180);
  });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth" }); }
    });
  });
}

// ===== STAGGER CARD REVEALS =====
function initCardReveals() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".reveal:not(.visible)").forEach((el, i) => {
          setTimeout(() => el.classList.add("visible"), i * 80);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll(".services-grid, .products-grid, .gallery-grid, .featured-products-grid").forEach(g => obs.observe(g));
}

function initResizeHandler() {
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { goToTesti(testiIndex); }, 200);
  }, { passive: true });
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", async () => {
  initLoader();
  initNavbar();
  initReveal();
  renderServices();
  initCart();
  initBooking();
  renderTestimonials();
  renderGallery();
  initContact();
  initSearch();
  initSmoothScroll();
  initCardReveals();
  initResizeHandler();
  initSidebar();

  // Products logic:
  // Firebase configured → ONLY Firebase (demo products NEVER show, even if collection is empty)
  // Firebase NOT configured → demo products as placeholder
  if (firebaseReady) {
    loadProductsFromFirebase(); // listener handles all rendering internally
  } else {
    PRODUCTS = DEMO_PRODUCTS;
    renderFilters();
    renderSidebarProducts();
    renderFeaturedProducts();
    renderProducts();
  }
});
