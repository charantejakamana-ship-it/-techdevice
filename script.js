const COLORS = {
  obsidian: { name: "Obsidian Black", img: "assets/phone-obsidian.svg" },
  titanium: { name: "Titanium Silver", img: "assets/phone-titanium.svg" },
  alpine: { name: "Alpine Blue", img: "assets/phone-alpine.svg" }
};

const STORAGE_OPTIONS = {
  256: { label: "256 GB (12 GB RAM)", price: 79999 },
  512: { label: "512 GB (16 GB RAM)", price: 89999 },
  1024: { label: "1 TB (16 GB RAM)", price: 104999 }
};

const CARE_OPTIONS = {
  none: { label: "Standard Warranty (Included)", price: 0 },
  plus: { label: "AetherCare+ 2-Year Protection", price: 6999 }
};

const SPECS_DATA = {
  performance: [
    { label: "Processor", value: "HyperCore X9 (3nm Octa-Core, up to 3.8 GHz)" },
    { label: "Graphics", value: "AetherGPU 12-Core with Hardware Ray Tracing" },
    { label: "Display", value: "6.78-inch LTPO AMOLED, 1–120Hz Adaptive Refresh" },
    { label: "Peak Brightness", value: "3,200 nits HDR • Dolby Vision & HDR10+" },
    { label: "Memory & Storage", value: "12 GB / 16 GB LPDDR5X • up to 1 TB UFS 4.0" },
    { label: "Operating System", value: "AetherOS 5 (5 Years of OS & Security Updates)" }
  ],
  camera: [
    { label: "Main Camera", value: "200MP 1-inch Sensor, f/1.6 Aperture, Dual-Axis OIS" },
    { label: "Telephoto", value: "50MP Periscope 5x Optical Zoom, up to 100x Digital" },
    { label: "Ultra-Wide", value: "50MP 122° Field of View with Macro Focus" },
    { label: "Front Camera", value: "32MP Autofocus with 4K 60fps Video" },
    { label: "Video Recording", value: "8K at 30fps • 4K at 120fps • 10-bit Log Video" },
    { label: "AI Imaging", value: "NightSight Neural Engine & Zero-Shutter-Lag HDR" }
  ],
  battery: [
    { label: "Battery Capacity", value: "5,500 mAh Silicon-Carbon High-Density Cell" },
    { label: "Wired Charging", value: "100W FlashCharge (0–100% in 24 mins)" },
    { label: "Wireless Charging", value: "50W Magnetic Wireless + 10W Reverse Share" },
    { label: "5G & Network", value: "Dual 5G SA/NSA (All Indian 5G Bands Supported)" },
    { label: "Wireless Standards", value: "Wi-Fi 7, Bluetooth 5.4, Dual-Band GPS, NFC" },
    { label: "Port", value: "USB Type-C 3.2 Gen 2 (10 Gbps Data + DisplayPort)" }
  ],
  design: [
    { label: "Frame Material", value: "Aerospace Grade 5 Micro-Blasted Titanium" },
    { label: "Glass Protection", value: "Ceramic Shield Glass 2 (Front & Matte Back)" },
    { label: "Water Resistance", value: "IP68 Dust & Water Resistant (up to 2m for 30 min)" },
    { label: "Dimensions & Weight", value: "162.4 × 76.1 × 8.2 mm • 212 grams" },
    { label: "Audio", value: "Dual Stereo Speakers with Spatial Dolby Atmos" },
    { label: "In the Box", value: "Aether X1 Pro, 100W GaN Charger, USB-C Cable, SIM Ejector" }
  ]
};

const DEFAULT_REVIEWS = [
  {
    name: "Vikramaditya Rao",
    city: "Bengaluru",
    rating: 5,
    date: "Verified Buyer",
    comment: "The 5x periscope zoom and low-light photography are unreal. Easily lasts me a day and a half with heavy 5G usage."
  },
  {
    name: "Sneha Deshmukh",
    city: "Pune",
    rating: 5,
    date: "Verified Buyer",
    comment: "Titanium Silver feels super premium in hand and doesn't attract fingerprints. 100W charging in the box is a huge plus!"
  },
  {
    name: "Arjun Malhotra",
    city: "New Delhi",
    rating: 5,
    date: "Verified Buyer",
    comment: "Zero heating even after an hour of BGMI at 120fps. Best flagship display I've used this year."
  },
  {
    name: "Kavya Subramanian",
    city: "Chennai",
    rating: 4,
    date: "Verified Buyer",
    comment: "Clean software with zero bloatware and blazing-fast performance. Slightly heavy, but the build quality justifies it."
  }
];

// App State
let selectedColor = "obsidian";
let selectedStorage = "256";
let selectedCare = "none";
let selectedReviewStars = 5;
let cart = JSON.parse(localStorage.getItem("aether_cart") || "[]");
let customReviews = JSON.parse(localStorage.getItem("aether_reviews") || "[]");

// Helpers
function formatINR(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Color Sync (Hero + Configurator)
function setColor(colorKey) {
  selectedColor = colorKey;
  const color = COLORS[colorKey];

  document.getElementById("heroProductImg").src = color.img;
  document.getElementById("heroProductImg").alt = `Aether X1 Pro in ${color.name}`;
  document.getElementById("heroColorName").textContent = color.name;

  document.getElementById("buyProductImg").src = color.img;
  document.getElementById("buyProductImg").alt = `Aether X1 Pro in ${color.name}`;
  document.getElementById("buyColorName").textContent = color.name;

  document.querySelectorAll(".swatch").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.color === colorKey);
  });

  updateSummary();
}

function setStorage(storageKey) {
  selectedStorage = String(storageKey);
  document.querySelectorAll("#storageOptions .option-card").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.storage === selectedStorage);
  });
  updateSummary();
}

function setCare(careKey) {
  selectedCare = careKey;
  document.querySelectorAll("#careOptions .option-card").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.care === careKey);
  });
  updateSummary();
}

function updateSummary() {
  const color = COLORS[selectedColor];
  const storage = STORAGE_OPTIONS[selectedStorage];
  const care = CARE_OPTIONS[selectedCare];
  const total = storage.price + care.price;

  document.getElementById("summaryModel").textContent = `Aether X1 Pro (${storage.label}, ${color.name})`;
  document.getElementById("summaryCare").textContent = care.label;
  document.getElementById("summaryTotal").textContent = formatINR(total);
}

// Specs Tabs
function renderSpecs(tabKey) {
  const panel = document.getElementById("specsPanel");
  const items = SPECS_DATA[tabKey] || SPECS_DATA.performance;
  panel.innerHTML = items
    .map(
      (item) => `
      <div class="spec-item">
        <span class="spec-label">${item.label}</span>
        <div class="spec-value">${item.value}</div>
      </div>`
    )
    .join("");
}

document.getElementById("specTabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn");
  if (!btn) return;
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderSpecs(btn.dataset.tab);
});

// Swatches & Configurator Events
document.querySelectorAll("#heroSwatches, #buySwatches").forEach((group) => {
  group.addEventListener("click", (e) => {
    const btn = e.target.closest(".swatch");
    if (!btn) return;
    setColor(btn.dataset.color);
  });
});

document.getElementById("storageOptions").addEventListener("click", (e) => {
  const btn = e.target.closest(".option-card");
  if (!btn) return;
  setStorage(btn.dataset.storage);
});

document.getElementById("careOptions").addEventListener("click", (e) => {
  const btn = e.target.closest(".option-card");
  if (!btn) return;
  setCare(btn.dataset.care);
});

// Pricing Plan Jump Buttons
document.querySelectorAll(".select-plan-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    setStorage(btn.dataset.storage);
    document.getElementById("buy").scrollIntoView({ behavior: "smooth" });
  });
});

// Shopping Bag / Cart Logic
function saveCart() {
  localStorage.setItem("aether_cart", JSON.stringify(cart));
  renderCart();
}

function addCurrentConfigToCart() {
  const color = COLORS[selectedColor];
  const storage = STORAGE_OPTIONS[selectedStorage];
  const care = CARE_OPTIONS[selectedCare];
  const price = storage.price + care.price;

  cart.push({
    id: Date.now(),
    title: `Aether X1 Pro — ${storage.label}`,
    subtitle: `${color.name} • ${care.label}`,
    img: color.img,
    price
  });
  saveCart();
}

function renderCart() {
  const countEl = document.getElementById("cartCount");
  const listEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartGrandTotal");

  countEl.textContent = cart.length;

  if (cart.length === 0) {
    listEl.innerHTML = `<p style="color: var(--muted);">Your bag is empty. Configure your Aether X1 Pro to get started.</p>`;
    totalEl.textContent = "₹0";
    return;
  }

  let grandTotal = 0;
  listEl.innerHTML = cart
    .map((item) => {
      grandTotal += item.price;
      return `
        <div class="cart-item">
          <img src="${item.img}" alt="${escapeHtml(item.title)}" />
          <div class="cart-item-info">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.subtitle)}</small>
            <strong style="color: var(--accent);">${formatINR(item.price)}</strong>
          </div>
          <button type="button" class="remove-btn" data-remove="${item.id}">Remove</button>
        </div>`;
    })
    .join("");

  totalEl.textContent = formatINR(grandTotal);
}

const cartModal = document.getElementById("cartModal");
const checkoutMessage = document.getElementById("checkoutMessage");

function openCart() {
  checkoutMessage.classList.add("hidden");
  renderCart();
  cartModal.classList.remove("hidden");
}

function closeCart() {
  cartModal.classList.add("hidden");
}

document.getElementById("cartToggleBtn").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
document.getElementById("cartBackdrop").addEventListener("click", closeCart);

document.getElementById("addToBagBtn").addEventListener("click", () => {
  addCurrentConfigToCart();
  openCart();
});

document.getElementById("buyNowBtn").addEventListener("click", () => {
  addCurrentConfigToCart();
  openCart();
});

document.getElementById("cartItems").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;
  const id = Number(btn.dataset.remove);
  cart = cart.filter((item) => item.id !== id);
  saveCart();
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return;
  checkoutMessage.textContent = "Order placed successfully! A confirmation summary has been generated.";
  checkoutMessage.classList.remove("hidden");
  cart = [];
  saveCart();
});

// Reviews Logic
function renderReviews() {
  const all = [...customReviews, ...DEFAULT_REVIEWS];
  document.getElementById("reviewCountText").textContent = `Based on ${all.length} verified reviews`;

  document.getElementById("reviewsList").innerHTML = all
    .map(
      (r) => `
      <article class="review-card">
        <div class="review-top">
          <div>
            <strong>${escapeHtml(r.name)}</strong>
            <span class="review-meta"> • ${escapeHtml(r.city)} • ${escapeHtml(r.date)}</span>
          </div>
          <span class="review-stars">${"&#9733;".repeat(r.rating)}${"&#9734;".repeat(5 - r.rating)}</span>
        </div>
        <p>${escapeHtml(r.comment)}</p>
      </article>`
    )
    .join("");
}

document.getElementById("reviewStarPicker").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-star]");
  if (!btn) return;
  selectedReviewStars = Number(btn.dataset.star);
  document.querySelectorAll("#reviewStarPicker button").forEach((b) => {
    b.classList.toggle("active", Number(b.dataset.star) <= selectedReviewStars);
  });
});

document.getElementById("reviewForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("revName").value.trim();
  const city = document.getElementById("revCity").value.trim();
  const comment = document.getElementById("revComment").value.trim();
  if (!name || !city || !comment) return;

  customReviews.unshift({
    name,
    city,
    rating: selectedReviewStars,
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    comment
  });
  localStorage.setItem("aether_reviews", JSON.stringify(customReviews));
  e.target.reset();
  renderReviews();
});

// Initialize Page
renderSpecs("performance");
updateSummary();
renderCart();
renderReviews();
