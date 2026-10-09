import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../services/authService";
import apiClient from "../services/apiClient";
import logoImg from "../assets/logo.png";
import ProductSmallCard from "../components/product/ProductSmallCard";
import ProductBigCard from "../components/product/ProductBigCard";
import {
  Search,
  Sparkles,
  Filter,
  X,
  ShoppingBag,
  Heart,
  Package,
  Calendar,
  Truck,
  MapPin,
  Settings,
  Save,
  RefreshCw,
} from "lucide-react";
import "./dashboard.css";

const DEFAULT_CATEGORIES = [
  "All",
  "Homemade Foods",
  "Apparel & Textiles",
  "Home Decor & Pottery",
  "Organic & Herbal Care",
  "Handicrafts",
];

const SAMPLE_BUYER_ORDERS = [
  {
    id: "CF-ORD-77192",
    date: "06 Oct 2026, 02:15 PM",
    product: {
      id: 1,
      name: "Handcrafted Organic Mango Pickle (500g)",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60",
      artisan: "Sunita Sharma (Jaipur, Rajasthan)",
      price: 249,
      quantity: 2,
      totalAmount: 498,
    },
    status: "Delivered",
    trackingId: "DTDC-IN-78921",
    deliveryDate: "Delivered on 08 Oct 2026",
  },
  {
    id: "CF-ORD-76890",
    date: "01 Oct 2026, 10:45 AM",
    product: {
      id: 3,
      name: "Handpainted Terracotta Clay Tea Set",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&auto=format&fit=crop&q=60",
      artisan: "Radha Ben (Kutch, Gujarat)",
      price: 650,
      quantity: 1,
      totalAmount: 650,
    },
    status: "Delivered",
    trackingId: "DELHIVERY-GJ-98214",
    deliveryDate: "Delivered on 04 Oct 2026",
  },
];

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Marketplace");

  // Dynamic API state for products
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  // Recommended products & wishlist
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  // Cart & Order State
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const res = await apiClient.get('/cart');
      if (res.data?.success) {
        setCartItems(res.data.cartItems || []);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const [cartToast, setCartToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [buyerOrders, setBuyerOrders] = useState(SAMPLE_BUYER_ORDERS);

  // Buyer Profile Form
  const [buyerProfile, setBuyerProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "Flat 302, Green Glen Layout, Bellandur",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auth check
  useEffect(() => {
    const stored = localStorage.getItem("gruhinezz_user");
    if (!stored) {
      navigate("/login", { replace: true });
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "buyer") {
      navigate(`/dashboard/${parsed.role}`, { replace: true });
      return;
    }
    setUser(parsed);
    setBuyerProfile((prev) => ({
      ...prev,
      name: parsed.userName || parsed.name || "",
      email: parsed.email || "",
      phone: parsed.contactNo || "",
    }));
  }, [navigate]);

  // Fetch categories from backend
  useEffect(() => {
    apiClient
      .get("/products/categories")
      .then((res) => {
        if (res.data?.categories && Array.isArray(res.data.categories)) {
          const catNames = ["All", ...res.data.categories.map((c) => c.name)];
          setCategories(catNames);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_CATEGORIES
      });
  }, []);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== "All") {
        params.category = selectedCategory;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      if (selectedSort) {
        params.sort = selectedSort;
      }
      const res = await apiClient.get("/products", { params });
      if (res.data?.success) {
        setProducts(res.data.products || []);
        // Set recommended products as top 4
        if (!debouncedSearch && selectedCategory === "All") {
          setRecommendedProducts((res.data.products || []).slice(0, 4));
        }
      } else {
        setError(res.data?.message || "Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please check server connection.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearch, selectedSort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  const handleAddToCart = async (product) => {
    try {
      await apiClient.post('/cart', { productId: product.id, quantity: 1 });
      await fetchCart();
      setCartToast(`Added "${product.title || product.name}" to cart!`);
      setTimeout(() => setCartToast(null), 2500);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handleWishlistToggle = (product, isSaved) => {
    setWishlistIds((prev) => {
      if (isSaved) {
        return prev.includes(product.id) ? prev : [...prev, product.id];
      } else {
        return prev.filter((id) => id !== product.id);
      }
    });
  };

  const handleInitiatePayment = (product) => {
    handlePlaceOrder(product);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (targetProduct) => {
    if (!targetProduct) return;
    setProcessingOrder(true);
    
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      setProcessingOrder(false);
      return;
    }

    try {
      const pTitle = targetProduct.title || targetProduct.name;
      const artisanName = targetProduct.seller_name || targetProduct.seller_user_name || targetProduct.artisan_name || "Woman Entrepreneur";
      const res = await apiClient.post("/payment/create-order", {
        amount: targetProduct.price
      });

      const { orderId, amount, currency, keyId } = res.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "GruhinEzz",
        description: `Purchase of ${pTitle}`,
        image: logoImg,
        order_id: orderId,
        handler: async function (response) {
          try {
            await apiClient.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              productId: targetProduct.id,
              sellerId: targetProduct.seller_id || 10,
              buyerId: user?.id,
              amount: targetProduct.price,
              customerName: user?.userName || user?.name || "Buyer",
              customerEmail: user?.email || "buyer@example.com",
              customerPhone: user?.contactNo || "9876543210",
              productTitle: pTitle,
              productImageUrl: targetProduct.image_url || targetProduct.images?.[0] || targetProduct.image,
              quantity: targetProduct.id === "cart_checkout" ? cartCount : 1,
            });
          } catch(e) { console.error("Payment verification failed", e); }
          
          const newOrder = {
            id: response.razorpay_payment_id || `order_${Date.now()}`,
            date: "Just now",
            product: {
              id: targetProduct.id,
              name: pTitle,
              image: targetProduct.image_url || targetProduct.images?.[0] || targetProduct.image,
              artisan: artisanName,
              price: targetProduct.price,
              quantity: targetProduct.id === "cart_checkout" ? cartCount : 1,
              totalAmount: targetProduct.price,
            },
            status: "Processing",
            trackingId: `RZP-TRK-${Math.floor(10000 + Math.random() * 90000)}`,
            deliveryDate: "Expected delivery in 3-4 days",
          };

          setBuyerOrders((prev) => [newOrder, ...prev]);

          alert(`Order placed successfully! Transaction ID: ${response.razorpay_payment_id}`);
          
          if (targetProduct.id === "cart_checkout") {
            try {
              await apiClient.delete('/cart');
              await fetchCart();
            } catch (err) {
              console.error("Failed to clear cart:", err);
            }
          }
        },
        prefill: {
          name: user?.userName || user?.name || "Buyer",
          email: user?.email || "buyer@example.com",
          contact: user?.contactNo || "9876543210",
        },
        theme: {
          color: "#48154c",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
      });
      paymentObject.open();

    } catch (err) {
      console.warn("Order creation warning:", err.message);
      alert("Failed to initialize Razorpay checkout. Check server connection.");
    } finally {
      setProcessingOrder(false);
    }
  };

  if (!user) return null;

  const navItems = [
    { icon: "🏠", label: "Marketplace" },
    { icon: "🛍️", label: "My Orders" },
    { icon: "❤️", label: "Saved Crafts" },
    { icon: "👩‍🌾", label: "Support Artisans" },
    { icon: "⚙️", label: "Settings" },
  ];

  const searchSuggestions = products.slice(0, 3);
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${mobileNavOpen ? "dashboard-sidebar--open" : ""}`}>
        <div className="flex items-center gap-2 px-6 pb-6 pt-2 border-b border-[#e2d3c8]">
          <img src={logoImg} alt="GruhinEzz" className="h-8 w-auto object-contain" />
          <div>
            <div className="dashboard-logo" style={{ padding: 0, border: "none" }}>GruhinEzz</div>
            <p className="text-[10px] text-[#7a6070] font-medium">Women Entrepreneurs</p>
          </div>
        </div>
        <nav className="dashboard-nav">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className={`dashboard-nav__item${activeNav === item.label ? " active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveNav(item.label);
                setMobileNavOpen(false);
              }}
            >
              {item.icon} {item.label}
            </a>
          ))}
        </nav>
        <button className="dashboard-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {mobileNavOpen && (
        <div className="dashboard-overlay" onClick={() => setMobileNavOpen(false)} />
      )}

      <main className="dashboard-main">
        {/* Mobile Header */}
        <div className="dashboard-mobile-header">
          <button
            className="dashboard-hamburger"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>
          <span className="dashboard-mobile-logo">GruhinEzz</span>
          <div className="dashboard-avatar dashboard-avatar--sm">
            {(user.userName || user.name || "B")[0]?.toUpperCase()}
          </div>
        </div>

        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-header__title">
              Welcome, {user.userName || user.name}! 🌸
            </h1>
            <p className="dashboard-header__subtitle">
              Discover authentic homemade products handcrafted by household women entrepreneurs across India.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setActiveNav("Cart")}
                className={`p-2.5 rounded-2xl bg-white border border-[#e2d3c8] text-[#48154c] hover:bg-[#f5ece6] transition-colors relative shadow-2xs ${activeNav === "Cart" ? "ring-2 ring-[#ae3a65]" : ""}`}
                title="Shopping Cart"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ae3a65] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
            <div className="dashboard-avatar">
              {(user.userName || user.name || "B")[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {cartToast && (
          <div className="mb-4 p-3 bg-[#48154c] text-white rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between shadow-md">
            <span>✓ {cartToast}</span>
            <button onClick={() => setCartToast(null)} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}

        {/* VIEW 1: MARKETPLACE */}
        {activeNav === "Marketplace" && (
          <>
            <div className="bg-white rounded-3xl border border-[#e2d3c8] p-5 sm:p-6 mb-8 shadow-sm">
              <div className="relative mb-4">
                <div className="flex items-center bg-[#f5ece6] border border-[#e2d3c8] rounded-2xl px-4 py-3 focus-within:border-[#48154c] transition-colors">
                  <Search size={18} className="text-[#7a6070] mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSuggestionsOpen(true);
                    }}
                    onFocus={() => setSuggestionsOpen(true)}
                    placeholder="Search products, artisans, spices, pottery, dupattas..."
                    className="w-full bg-transparent text-sm text-[#2d2130] placeholder-[#7a6070] focus:outline-hidden"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-[#7a6070] hover:text-[#48154c] ml-2"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {suggestionsOpen && searchQuery.trim() && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#e2d3c8] p-3 shadow-xl z-30">
                    <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-[#f5ece6] text-xs font-semibold text-[#7a6070]">
                      <span>Product Suggestions</span>
                      <button
                        onClick={() => setSuggestionsOpen(false)}
                        className="hover:text-[#48154c]"
                      >
                        Close ✕
                      </button>
                    </div>
                    <div className="space-y-2">
                      {searchSuggestions.map((product) => (
                        <ProductSmallCard
                          key={product.id}
                          product={product}
                          onClick={() => {
                            setSuggestionsOpen(false);
                            navigate(`/product/${product.id}`);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Category Filter & Sort */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[#7a6070] font-semibold flex items-center gap-1 mr-1">
                    <Filter size={13} /> Category:
                  </span>
                  {categories.map((cat) => (
                    <button
                      key={typeof cat === "object" ? cat.name : cat}
                      onClick={() => setSelectedCategory(typeof cat === "object" ? cat.name : cat)}
                      className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                        selectedCategory === (typeof cat === "object" ? cat.name : cat)
                          ? "bg-[#48154c] text-white shadow-xs"
                          : "bg-[#f5ece6] text-[#2d2130] hover:bg-[#e2d3c8]"
                      }`}
                    >
                      {typeof cat === "object" ? cat.name : cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#7a6070] font-semibold">Sort:</span>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3 py-1.5 text-xs text-[#2d2130] focus:outline-[#48154c]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* E-Commerce Stats */}
            <div className="dashboard-stats mb-8">
              <div className="stat-card">
                <span className="stat-card__icon">🛍️</span>
                <div>
                  <p className="stat-card__value">{products.length}</p>
                  <p className="stat-card__label">Active Products</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-card__icon">👩‍🌾</span>
                <div>
                  <p className="stat-card__value">100%</p>
                  <p className="stat-card__label">Women Artisans</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-card__icon">🔷</span>
                <div>
                  <p className="stat-card__value">Direct</p>
                  <p className="stat-card__label">Artisan Payouts</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-card__icon">🚚</span>
                <div>
                  <p className="stat-card__value">PAN India</p>
                  <p className="stat-card__label">Home Delivery</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
              {/* Main Product Catalog */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#e2d3c8]">
                  <div>
                    <h2 className="text-xl font-bold text-[#2d2130]">
                      {debouncedSearch
                        ? `Search Results for "${debouncedSearch}"`
                        : selectedCategory !== "All"
                        ? `${selectedCategory} Results`
                        : "Handcrafted Product Catalog"}
                    </h2>
                    <p className="text-xs text-[#7a6070]">
                      Showing {products.length} verified products
                    </p>
                  </div>
                  <button
                    onClick={fetchProducts}
                    className="p-2 rounded-xl bg-[#f5ece6] hover:bg-[#e2d3c8] text-[#48154c] transition-colors"
                    title="Refresh products"
                  >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>

                {loading ? (
                  <div className="bg-white rounded-3xl p-12 border border-[#e2d3c8] text-center">
                    <RefreshCw size={32} className="animate-spin text-[#48154c] mx-auto mb-3" />
                    <p className="text-sm font-semibold text-[#48154c]">Loading handcrafted products...</p>
                  </div>
                ) : error ? (
                  <div className="bg-white rounded-3xl p-8 border border-red-200 text-center text-red-600">
                    <p className="font-bold mb-2">⚠️ Error</p>
                    <p className="text-xs mb-4">{error}</p>
                    <button
                      onClick={fetchProducts}
                      className="px-4 py-2 bg-[#48154c] text-white rounded-xl text-xs font-semibold"
                    >
                      Try Again
                    </button>
                  </div>
                ) : products.length > 0 ? (
                  <div className="space-y-6">
                    {products.map((product) => (
                      <ProductBigCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleInitiatePayment}
                        onWishlistToggle={handleWishlistToggle}
                        isWishlisted={wishlistIds.includes(product.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-8 border border-[#e2d3c8] text-center">
                    <span className="text-4xl mb-3 block">🔍</span>
                    <h3 className="font-bold text-[#48154c] text-lg mb-1">
                      No crafts match your filter criteria
                    </h3>
                    <p className="text-xs text-[#7a6070] mb-4">
                      Try checking for typos or clear search filters to view all products.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                        setSelectedSort("newest");
                      }}
                      className="px-4 py-2 bg-[#48154c] text-white rounded-xl text-xs font-semibold"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Recommended Side Panel */}
              <div className="lg:col-span-4">
                <div className="sticky top-20 space-y-6">
                  <div className="bg-white rounded-3xl border border-[#e2d3c8] p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#f5ece6]">
                      <Sparkles size={16} className="text-[#ae3a65]" />
                      <h3 className="font-bold text-sm text-[#48154c]">
                        Recommended Products
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {(recommendedProducts.length > 0 ? recommendedProducts : products.slice(0, 4)).map((product) => (
                        <ProductSmallCard
                          key={product.id}
                          product={product}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#48154c] to-[#ae3a65] text-white p-5 rounded-3xl shadow-md text-xs space-y-2">
                    <h4 className="font-bold text-sm flex items-center gap-1.5">
                      <span>🌸</span> 100% Women Household Artisans
                    </h4>
                    <p className="opacity-90 leading-relaxed">
                      Every order on GruhinEzz directly empowers rural and small-household women makers, eliminating exploitative middlemen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: MY ORDERS */}
        {activeNav === "My Orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#e2d3c8]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#48154c] flex items-center gap-2">
                  <Package size={24} className="text-[#ae3a65]" />
                  My Purchase Orders
                </h2>
                <p className="text-xs text-[#7a6070] mt-0.5">
                  Track shipment status and delivery receipts for your handcrafted orders
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {buyerOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-[#e2d3c8] p-5 sm:p-6 shadow-xs hover:border-[#ae3a65] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#f5ece6]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#48154c]">
                        {ord.id}
                      </span>
                      <span className="text-xs text-[#7a6070] flex items-center gap-1">
                        <Calendar size={13} /> {ord.date}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        ord.status === "Delivered"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-blue-100 text-blue-800 border border-blue-300"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={ord.product.image}
                        alt={ord.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-[#f5ece6] border border-[#e2d3c8] shrink-0"
                      />
                      <div>
                        <Link
                          to={`/product/${ord.product.id}`}
                          className="font-bold text-sm sm:text-base text-[#2d2130] hover:text-[#48154c] transition-colors line-clamp-1"
                        >
                          {ord.product.name}
                        </Link>
                        <p className="text-xs text-[#7a6070] mt-0.5">
                          By {ord.product.artisan}
                        </p>
                        <p className="text-sm font-extrabold text-[#48154c] mt-1">
                          ₹{ord.product.totalAmount}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-[#5a4855]">
                        <Truck size={14} className="text-[#48154c]" />
                        <span>{ord.deliveryDate}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#7a6070]">
                        AWB: {ord.trackingId}
                      </span>
                      <Link
                        to={`/product/${ord.product.id}`}
                        className="px-4 py-1.5 rounded-xl border border-[#48154c] text-[#48154c] hover:bg-[#48154c] hover:text-white transition-colors font-semibold text-center"
                      >
                        Buy Craft Again
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: SAVED CRAFTS */}
        {activeNav === "Saved Crafts" && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#e2d3c8]">
              <h2 className="text-xl sm:text-2xl font-bold text-[#48154c] flex items-center gap-2">
                <Heart size={24} className="text-[#ae3a65]" />
                Saved Crafts & Wishlist
              </h2>
              <p className="text-xs text-[#7a6070] mt-0.5">
                Artisan crafts and homemade specialties you have bookmarked
              </p>
            </div>

            {wishlistedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistedProducts.map((product) => (
                  <ProductSmallCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 border border-[#e2d3c8] text-center">
                <span className="text-4xl block mb-2">❤️</span>
                <h3 className="font-bold text-base text-[#48154c] mb-1">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-[#7a6070] mb-4">
                  Browse the marketplace and heart items to save them here.
                </p>
                <button
                  onClick={() => setActiveNav("Marketplace")}
                  className="px-4 py-2 bg-[#48154c] text-white rounded-xl text-xs font-semibold"
                >
                  Explore Marketplace
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: SUPPORT ARTISANS */}
        {activeNav === "Support Artisans" && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#e2d3c8]">
              <h2 className="text-xl sm:text-2xl font-bold text-[#48154c] flex items-center gap-2">
                <span>👩‍🌾</span>
                Women Household Artisans Directory
              </h2>
              <p className="text-xs text-[#7a6070] mt-0.5">
                Learn about the grassroots makers whose crafts are hosted on GruhinEzz
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  name: "Sunita Sharma",
                  location: "Jaipur, Rajasthan",
                  specialty: "Sun-Cured Traditional Mango Pickles",
                  story: "Learned 50-year-old traditional spice blending from her grandmother. Runs a small home rasoi empowering her family.",
                  rating: 4.9,
                },
                {
                  name: "Lakshmi Devi",
                  location: "Indore, Madhya Pradesh",
                  specialty: "Handloom Chanderi Silk & Cotton Weaves",
                  story: "A 4th-generation handloom weaver supporting a cooperative of 12 women artisans in rural Malwa.",
                  rating: 4.8,
                },
                {
                  name: "Radha Ben",
                  location: "Kutch, Gujarat",
                  specialty: "Handpainted Terracotta Pottery & Tea Sets",
                  story: "Molds natural riverbed clay on manual wheels with vibrant mineral mud pigments.",
                  rating: 5.0,
                },
                {
                  name: "Anita Devi",
                  location: "Kolkata, West Bengal",
                  specialty: "Eco-Friendly Biodegradable Golden Jute Bags",
                  story: "Leads a 25-woman self-help group in Nadia district converting jute into eco-friendly tote fashion.",
                  rating: 4.7,
                },
              ].map((artisan, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-[#e2d3c8] shadow-xs space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#48154c] text-white flex items-center justify-center font-bold text-lg">
                      {artisan.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#48154c]">
                        {artisan.name}
                      </h3>
                      <p className="text-xs text-[#7a6070] flex items-center gap-1">
                        <MapPin size={12} /> {artisan.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-[#ae3a65]">
                    Craft: {artisan.specialty}
                  </p>

                  <p className="text-xs text-[#5a4855] leading-relaxed">
                    "{artisan.story}"
                  </p>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="font-bold text-[#48154c]">
                      ★ {artisan.rating} / 5.0 Artisan Rating
                    </span>
                    <button
                      onClick={() => {
                        setSearchQuery(artisan.name);
                        setActiveNav("Marketplace");
                      }}
                      className="text-[#ae3a65] hover:underline font-bold"
                    >
                      View Crafts →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: SETTINGS */}
        {activeNav === "Settings" && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#e2d3c8]">
              <h2 className="text-xl sm:text-2xl font-bold text-[#48154c] flex items-center gap-2">
                <Settings size={24} className="text-[#ae3a65]" />
                Buyer Account & Shipping Settings
              </h2>
              <p className="text-xs text-[#7a6070] mt-0.5">
                Manage your default delivery address, phone number, and preferences
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Buyer delivery profile saved successfully!");
              }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d3c8] shadow-xs space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#48154c] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={buyerProfile.name}
                    onChange={(e) => setBuyerProfile({ ...buyerProfile, name: e.target.value })}
                    className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#48154c] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={buyerProfile.email}
                    onChange={(e) => setBuyerProfile({ ...buyerProfile, email: e.target.value })}
                    className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#48154c] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={buyerProfile.phone}
                    onChange={(e) => setBuyerProfile({ ...buyerProfile, phone: e.target.value })}
                    className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#48154c] mb-1">Pincode</label>
                  <input
                    type="text"
                    value={buyerProfile.pincode}
                    onChange={(e) => setBuyerProfile({ ...buyerProfile, pincode: e.target.value })}
                    className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-bold text-[#48154c] mb-1">Street Delivery Address</label>
                <input
                  type="text"
                  value={buyerProfile.address}
                  onChange={(e) => setBuyerProfile({ ...buyerProfile, address: e.target.value })}
                  className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#48154c] mb-1">City</label>
                  <input
                    type="text"
                    value={buyerProfile.city}
                    onChange={(e) => setBuyerProfile({ ...buyerProfile, city: e.target.value })}
                    className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#48154c] mb-1">State</label>
                  <input
                    type="text"
                    value={buyerProfile.state}
                    onChange={(e) => setBuyerProfile({ ...buyerProfile, state: e.target.value })}
                    className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#48154c] text-white rounded-xl text-xs font-bold hover:bg-[#38103c] transition-colors flex items-center gap-2"
                >
                  <Save size={15} /> Save Delivery Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 6: CART */}
        {activeNav === "Cart" && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#e2d3c8]">
              <h2 className="text-xl sm:text-2xl font-bold text-[#48154c] flex items-center gap-2">
                <ShoppingBag size={24} className="text-[#ae3a65]" />
                Your Shopping Cart
              </h2>
              <p className="text-xs text-[#7a6070] mt-0.5">
                Review your items and proceed to checkout
              </p>
            </div>

            {cartItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl border border-[#e2d3c8] p-4 flex items-center gap-4 shadow-xs">
                      <img src={item.image_url || item.images?.[0] || item.image || "https://via.placeholder.com/150"} className="w-20 h-20 rounded-xl object-cover bg-[#f5ece6]" alt={item.title || item.name} />
                      <div className="flex-1">
                        <h3 className="font-bold text-[#2d2130]">{item.title || item.name}</h3>
                        <p className="text-xs text-[#7a6070]">By {item.artisan_name || item.artisan || "Woman Entrepreneur"}</p>
                        <p className="font-bold text-[#48154c] mt-1">₹{item.price} <span className="text-[#7a6070] font-normal text-xs">x {item.quantity}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={async () => { await apiClient.put(`/cart/${item.id}`, { quantity: item.quantity + 1 }); fetchCart(); }} className="px-3 py-1 bg-[#f5ece6] hover:bg-[#e2d3c8] rounded-lg font-bold transition-colors">+</button>
                        <span className="font-semibold text-[#48154c] w-4 text-center">{item.quantity}</span>
                        <button onClick={async () => { await apiClient.put(`/cart/${item.id}`, { quantity: Math.max(1, item.quantity - 1) }); fetchCart(); }} className="px-3 py-1 bg-[#f5ece6] hover:bg-[#e2d3c8] rounded-lg font-bold transition-colors">-</button>
                        <button onClick={async () => { await apiClient.delete(`/cart/${item.id}`); fetchCart(); }} className="text-[#ae3a65] text-xs font-bold ml-2 hover:underline">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-3xl p-6 border border-[#e2d3c8] h-fit sticky top-20 shadow-xs">
                  <h3 className="font-bold text-lg mb-4 text-[#48154c]">Order Summary</h3>
                  <div className="flex justify-between mb-2 text-sm text-[#5a4855]">
                    <span>Items Total ({cartCount})</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-sm text-[#5a4855]">
                    <span>Delivery</span>
                    <span className="text-[#10b981] font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-[#f5ece6] pt-4 mb-6 text-[#48154c]">
                    <span>Total Amount</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleInitiatePayment({
                        id: "cart_checkout",
                        title: `Cart Checkout (${cartCount} items)`,
                        price: cartTotal,
                        artisan_name: "Multiple Artisans",
                        image_url: cartItems[0]?.image_url || cartItems[0]?.images?.[0] || cartItems[0]?.image || "",
                      });
                    }}
                    className="w-full py-3 bg-[#48154c] text-white rounded-xl font-bold hover:bg-[#38103c] transition-colors shadow-md"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 border border-[#e2d3c8] text-center shadow-xs">
                <span className="text-4xl block mb-3">🛍️</span>
                <h3 className="font-bold text-lg text-[#48154c] mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-[#7a6070] mb-5">
                  Explore our handcrafted collection and add items to your cart.
                </p>
                <button
                  onClick={() => setActiveNav("Marketplace")}
                  className="px-6 py-2.5 bg-[#48154c] text-white rounded-xl text-xs font-bold hover:bg-[#38103c] transition-colors"
                >
                  Return to Marketplace
                </button>
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
}
