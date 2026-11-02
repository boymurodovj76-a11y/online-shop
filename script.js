// ONLINE SHOP JAVASCRIPT

const products = [
    {
        id: 1,
        name: "Nova X Pro smartfon",
        category: "Telefon",
        price: 1299000,
        emoji: "📱"
    },
    {
        id: 2,
        name: "AirBeat simsiz quloqchin",
        category: "Audio",
        price: 249000,
        emoji: "🎧"
    },
    {
        id: 3,
        name: "UltraBook noutbuk",
        category: "Kompyuter",
        price: 6499000,
        emoji: "💻"
    },
    {
        id: 4,
        name: "Smart Watch S9",
        category: "Aksessuar",
        price: 399000,
        emoji: "⌚"
    },
    {
        id: 5,
        name: "GamePad Pro",
        category: "Aksessuar",
        price: 529000,
        emoji: "🎮"
    },
    {
        id: 6,
        name: "Boom Mini kolonka",
        category: "Audio",
        price: 179000,
        emoji: "🔊"
    }
];

let cart = [];
let activeCategory = "Barchasi";
let searchTerm = "";

const $ = selector => document.querySelector(selector);

// Narxni formatlash
function money(price) {
    return price.toLocaleString("uz-UZ") + " so‘m";
}

// Mahsulotlarni chiqarish
function renderProducts() {

    const filtered = products.filter(product => {

        const categoryMatch =
            activeCategory === "Barchasi" ||
            product.category === activeCategory;

        const searchMatch =
            product.name.toLowerCase()
            .includes(searchTerm.toLowerCase());

        return categoryMatch && searchMatch;
    });

    $("#resultCount").textContent =
        filtered.length + " ta mahsulot";

    $("#productGrid").innerHTML = filtered.map(product => `
        <div class="product">

            <div class="product-image">
                ${product.emoji}
            </div>

            <small>${product.category}</small>

            <h3>${product.name}</h3>

            <div class="product-footer">

                <span class="price">
                    ${money(product.price)}
                </span>

                <button
                    class="add-btn"
                    data-add="${product.id}">
                    + Savat
                </button>

            </div>

        </div>
    `).join("");

}

// Savatga qo‘shish
function addToCart(id) {

    const product = products.find(p => p.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();

    showToast("Mahsulot savatga qo‘shildi!");
}

// Savatni chiqarish
function renderCart() {

    const count = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    $("#count").textContent = count;

    $("#total").textContent = money(total);

    if (cart.length === 0) {

        $("#cartItems").innerHTML = `
            <p class="empty">
                Savatchangiz hozircha bo‘sh.
            </p>
        `;

        return;
    }

    $("#cartItems").innerHTML = cart.map(item => `
        <div class="cart-item">

            <div class="cart-emoji">
                ${item.emoji}
            </div>

            <div>

                <h4>${item.name}</h4>

                <p>${money(item.price)}</p>

                <div class="quantity">

                    <button
                        data-qty="${item.id}"
                        data-delta="-1">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        data-qty="${item.id}"
                        data-delta="1">
                        +
                    </button>

                </div>

            </div>

        </div>
    `).join("");

}

// Mahsulot sonini o‘zgartirish
function changeQuantity(id, delta) {

    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    renderCart();
}

// Xabar ko‘rsatish
function showToast(message) {

    const toast = $("#toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);

}

// Tugmalar
document.addEventListener("click", function(event) {

    // Savatga qo‘shish
    const addButton = event.target.closest("[data-add]");

    if (addButton) {
        addToCart(Number(addButton.dataset.add));
    }

    // Savat sonini o‘zgartirish
    const quantityButton = event.target.closest("[data-qty]");

    if (quantityButton) {

        const id = Number(quantityButton.dataset.qty);

        const delta = Number(quantityButton.dataset.delta);

        changeQuantity(id, delta);
    }

    // Kategoriya tanlash
    const categoryButton =
        event.target.closest("[data-category]");

    if (categoryButton) {

        activeCategory = categoryButton.dataset.category;

        document.querySelectorAll(".categories button")
            .forEach(button => {
                button.classList.toggle(
                    "active",
                    button === categoryButton
                );
            });

        renderProducts();
    }

    // Dizayn almashtirish
    const themeButton =
        event.target.closest("[data-theme]");

    if (themeButton) {

        const theme = themeButton.dataset.theme;

        document.body.dataset.theme = theme;

        const names = {
            shopuz: "ShopUZ",
            marketpro: "MarketPro",
            shopmax: "ShopMax"
        };

        const titles = {
            shopuz: "Texnologiya — endi yanada yaqin!",
            marketpro: "Siz uchun eng yaxshi tanlov!",
            shopmax: "Zamonaviy uslub — bir joyda!"
        };

        $("#brand").textContent = names[theme];

        $("#footerBrand").textContent = names[theme];

        $("#heroTitle").textContent = titles[theme];

        showToast(names[theme] + " dizayni tanlandi!");
    }

});

// Qidiruv
$("#search").addEventListener("input", function(event) {

    searchTerm = event.target.value;

    renderProducts();

});

// Savatga borish
$("#cartButton").addEventListener("click", function() {

    $(".cart").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});

// Telefon menyusi
$("#menuButton").addEventListener("click", function() {

    $("#nav").classList.toggle("open");

});

// Buyurtma berish
$("#checkout").addEventListener("click", function() {

    if (cart.length === 0) {

        showToast("Avval mahsulot tanlang!");

        return;
    }

    showToast("Demo buyurtma qabul qilindi!");

    cart = [];

    renderCart();

});

// Dastlabki ishga tushirish
renderProducts();

renderCart();