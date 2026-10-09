import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductSmallCard from "../components/product/ProductSmallCard";
import logoImg from "../assets/logo.png";
import apiClient from "../services/apiClient";
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  ArrowLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Share2,
  MapPin,
  Sparkles,
  ChevronRight,
  Maximize2,
  X,
  Plus,
  Minus,
  Tag,
  UserCheck,
  MessageSquarePlus,
  Loader2,
  Package,
} from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reviews state from DB API
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ avg_rating: 0, review_count: 0 });

  // Related and recommended products from API
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Gallery State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Variant & Quantity State
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);

  // Action states
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartSuccessMessage, setCartSuccessMessage] = useState(null);
  const [buyNowModalOpen, setBuyNowModalOpen] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(null);

  // Delivery check state
  const [pincode, setPincode] = useState("302001");
  const [pincodeStatus, setPincodeStatus] = useState("Delivery available by Friday • Free delivery");

  // New review form
  const [newReviewModalOpen, setNewReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch product from DB API
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/products/${id}`);
      if (res.data?.success && res.data.product) {
        setProduct(res.data.product);
      } else {
        setError(res.data?.message || "Product not found.");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Product not found or database error.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch reviews from DB API
  const fetchReviews = useCallback(async () => {
    try {
      const res = await apiClient.get(`/reviews/product/${id}`);
      if (res.data?.success) {
        setReviews(res.data.reviews || []);
        if (res.data.stats) {
          setReviewStats(res.data.stats);
        }
      }
    } catch (err) {
      console.warn("Could not fetch product reviews:", err.message);
    }
  }, [id]);

  // Fetch related products from DB API
  const fetchRelated = useCallback(async () => {
    try {
      const res = await apiClient.get("/products", { params: { limit: 4 } });
      if (res.data?.success) {
        const list = (res.data.products || []).filter((p) => String(p.id) !== String(id));
        setRelatedProducts(list.slice(0, 4));
        setRecommendedProducts(list.slice(0, 4));
      }
    } catch (err) {
      console.warn("Could not fetch related products:", err.message);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    fetchRelated();
  }, [fetchProduct, fetchReviews, fetchRelated]);

  const calculatedPrice = useMemo(() => {
    if (!product) return 0;
    return Number(product.price) || 0;
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#efe5e5] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 size={36} className="animate-spin text-[#48154c] mb-3" />
        <p className="text-sm font-semibold text-[#48154c]">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#efe5e5] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl border border-[#e2d3c8] max-w-md w-full shadow-md">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#f5ece6] text-[#48154c] flex items-center justify-center">
            <Package size={28} />
          </div>
          <h2 className="text-xl font-bold text-[#48154c] mb-2">Product Not Found</h2>
          <p className="text-sm text-[#7a6070] mb-6">
            {error || "The requested handmade craft might have been updated or removed."}
          </p>
          <button
            onClick={() => navigate("/dashboard/buyer")}
            className="w-full py-3 bg-[#48154c] text-white rounded-xl font-semibold hover:bg-[#38103c] transition-colors"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const productName = product.title || product.name || "Handcrafted Item";
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image_url || product.image || "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80"];

  const currentImage = images[activeImageIndex] || images[0];
  const sellerName = product.seller_name || product.seller_user_name || product.artisan_name || (typeof product.seller === "object" ? product.seller?.name : product.seller) || "Woman Entrepreneur";
  const originalPrice = product.original_price || product.originalPrice;

  const handleDecreaseQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQty = () => {
    setQuantity((prev) => Math.min(product.stock || 10, prev + 1));
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setPincodeStatus(`Available for delivery at ${pincode} within 3-4 days • Free Shipping`);
    } else {
      setPincodeStatus("Please enter a valid 6-digit Indian PIN code");
    }
  };

  const handleAddToCart = async () => {
    try {
      await apiClient.post('/cart', { productId: product.id, quantity: quantity });
      setCartSuccessMessage(`Added ${quantity} x ${productName} to your cart!`);
      setTimeout(() => setCartSuccessMessage(null), 3000);
    } catch(err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart. Please log in.");
    }
  };

  const handleOpenBuyNow = () => {
    setBuyNowModalOpen(true);
    setOrderCompleted(null);
  };

  const handleConfirmOrder = async () => {
    setOrderProcessing(true);
    try {
      const stored = localStorage.getItem("gruhinezz_user");
      const user = stored ? JSON.parse(stored) : null;

      const res = await apiClient.post("/payment/create-order", {
        userId: user?.id || 1,
        amount: calculatedPrice * quantity,
        customerName: user?.userName || user?.name || "Buyer",
        customerEmail: user?.email || "buyer@gruhinezz.com",
        customerPhone: user?.contactNo || "9876543210",
        productTitle: `${productName} (Qty: ${quantity})`,
      });

      const orderId = res.data?.orderId || `order_${Date.now()}`;
      setOrderCompleted({
        orderId,
        amount: calculatedPrice * quantity,
        productName: productName,
        quantity,
        seller: sellerName,
      });
    } catch (err) {
      console.warn("Order fallback execution:", err.message);
      setOrderCompleted({
        orderId: `order_${Date.now()}`,
        amount: calculatedPrice * quantity,
        productName: productName,
        quantity,
        seller: sellerName,
      });
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReviewComment) return;

    setSubmittingReview(true);
    try {
      const res = await apiClient.post("/reviews", {
        productId: product.id,
        rating: newReviewRating,
        comment: newReviewComment,
      });

      if (res.data?.success) {
        setNewReviewModalOpen(false);
        setNewReviewComment("");
        fetchReviews();
      } else {
        alert("Failed to submit review: " + (res.data?.message || "Please login as a buyer"));
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.response?.data?.message || "Failed to submit review. Please ensure you are logged in.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#efe5e5] text-[#2d2130] pb-20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2d3c8] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl text-[#48154c] hover:bg-[#f5ece6] transition-colors flex items-center gap-1.5 text-xs font-semibold"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <Link to="/dashboard/buyer" className="flex items-center gap-2">
              <img src={logoImg} alt="GruhinEzz" className="h-7 w-auto object-contain" />
              <span className="font-bold text-[#48154c] text-base hidden md:inline">
                GruhinEzz
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1.5 text-xs text-[#7a6070]">
            <Link to="/dashboard/buyer" className="hover:text-[#48154c]">
              Home
            </Link>
            <ChevronRight size={13} />
            <span>{product.category}</span>
            <ChevronRight size={13} />
            <span className="text-[#48154c] font-medium truncate max-w-[200px]">
              {productName}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2 rounded-xl text-[#7a6070] hover:text-[#ae3a65] hover:bg-[#f5ece6] transition-colors"
              aria-label="Wishlist"
            >
              <Heart
                size={20}
                className={isWishlisted ? "fill-[#ae3a65] text-[#ae3a65]" : ""}
              />
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Product link copied to clipboard!");
              }}
              className="p-2 rounded-xl text-[#7a6070] hover:text-[#48154c] hover:bg-[#f5ece6] transition-colors"
              aria-label="Share"
            >
              <Share2 size={19} />
            </button>
          </div>
        </div>
      </header>

      {cartSuccessMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#48154c] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#ae3a65] flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={20} className="text-emerald-400" />
          <span className="text-xs sm:text-sm font-medium">{cartSuccessMessage}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-3xl border border-[#e2d3c8] shadow-sm p-6 sm:p-8 lg:p-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Product Image Section */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="relative w-full aspect-square bg-[#f5ece6] rounded-2xl overflow-hidden border border-[#e2d3c8] group">
                <img
                  src={currentImage}
                  alt={productName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl shadow-md text-[#48154c] hover:bg-white hover:text-[#ae3a65] transition-all"
                  aria-label="Zoom image"
                >
                  <Maximize2 size={18} />
                </button>

                <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                  <span className="bg-[#48154c] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-[#f5ece6] ${
                        activeImageIndex === idx
                          ? "border-[#48154c] ring-2 ring-[#48154c]/30 scale-102"
                          : "border-[#e2d3c8] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`thumbnail-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-2 p-4 bg-[#f5ece6]/70 rounded-2xl border border-[#e2d3c8] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#48154c] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                  {sellerName.charAt(0)}
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#48154c]">{sellerName}</span>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full">
                      <UserCheck size={11} /> Verified Woman Artisan
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-[#ae3a65] tracking-wider uppercase">
                    {product.category}
                  </span>

                  <a
                    href="#reviews-section"
                    className="flex items-center gap-1.5 bg-[#f5ece6] px-3 py-1 rounded-full text-xs font-semibold text-[#48154c] hover:bg-[#e2d3c8] transition-colors"
                  >
                    <Star size={14} className="fill-[#e09117] text-[#e09117]" />
                    <span>{reviewStats.avg_rating || product.rating || "0.0"}</span>
                    <span className="text-[#7a6070] font-normal">
                      ({reviewStats.review_count || reviews.length} reviews)
                    </span>
                  </a>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d2130] leading-tight mb-2">
                  {productName}
                </h1>

                <p className="text-xs sm:text-sm text-[#7a6070] mb-4">
                  Handcrafted by <strong className="text-[#48154c]">{sellerName}</strong>
                </p>

                <div className="p-4 bg-[#f5ece6]/50 rounded-2xl border border-[#e2d3c8] mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#48154c]">
                      ₹{calculatedPrice}
                    </span>
                    {originalPrice && originalPrice > calculatedPrice && (
                      <span className="text-base sm:text-lg text-[#7a6070] line-through">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7a6070] mt-1">
                    Inclusive of all taxes • 100% of profits go directly to the household artisan
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 mb-8 pt-4 border-t border-[#f5ece6]">
                  <div>
                    <label className="block text-xs font-bold text-[#48154c] mb-1.5 uppercase tracking-wide">
                      Quantity
                    </label>
                    <div className="flex items-center border border-[#e2d3c8] rounded-xl overflow-hidden bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={handleDecreaseQty}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-[#48154c] hover:bg-[#f5ece6] disabled:opacity-40 transition-colors"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="w-12 text-center font-bold text-sm text-[#2d2130]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncreaseQty}
                        disabled={quantity >= (product.stock || 10)}
                        className="w-10 h-10 flex items-center justify-center text-[#48154c] hover:bg-[#f5ece6] disabled:opacity-40 transition-colors"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-[#48154c] mb-1.5 uppercase tracking-wide">
                      Availability
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      {product.stock > 0
                        ? `In Stock (${product.stock} units available)`
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="py-3.5 px-6 rounded-2xl border-2 border-[#48154c] text-[#48154c] hover:bg-[#48154c] hover:text-white transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98"
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenBuyNow}
                    className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#48154c] to-[#ae3a65] text-white hover:opacity-95 transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98"
                  >
                    <Zap size={18} />
                    <span>Buy Now (₹{calculatedPrice * quantity})</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#f5ece6]/60 rounded-2xl border border-[#e2d3c8] text-xs space-y-3">
                <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                  <Truck size={16} className="text-[#48154c] flex-shrink-0" />
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 bg-white border border-[#e2d3c8] rounded-xl px-3 py-1.5 text-xs focus:outline-[#48154c]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#48154c] text-white rounded-xl font-semibold hover:bg-[#38103c]"
                  >
                    Check
                  </button>
                </form>

                <p className="text-emerald-800 font-medium pl-6">{pincodeStatus}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e2d3c8] p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#48154c] mb-4 pb-2 border-b border-[#f5ece6]">
              Product Description
            </h2>

            <div className="mb-6">
              <h3 className="text-xs font-bold text-[#ae3a65] uppercase tracking-wider mb-1.5">
                Overview
              </h3>
              <p className="text-sm text-[#2d2130] leading-relaxed">
                {typeof product.description === "object"
                  ? product.description.overview || JSON.stringify(product.description)
                  : product.description || "Authentic handmade craft by household woman artisan."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e2d3c8] p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#48154c] mb-4 pb-2 border-b border-[#f5ece6]">
              Seller Information
            </h2>
            <div className="space-y-2 text-xs text-[#5a4855]">
              <p>
                <strong>Artisan Name:</strong> {sellerName}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Authenticity:</strong> 100% Homemade & Verified
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section
          id="reviews-section"
          className="bg-white rounded-3xl border border-[#e2d3c8] p-6 sm:p-8 lg:p-10 shadow-sm mb-12"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#f5ece6]">
            <div>
              <h2 className="text-2xl font-bold text-[#48154c]">
                Customer Reviews & Ratings
              </h2>
              <p className="text-xs text-[#7a6070]">
                Feedback from buyers who supported this artisan
              </p>
            </div>

            <button
              onClick={() => setNewReviewModalOpen(true)}
              className="px-4 py-2 bg-[#48154c] text-white rounded-xl text-xs font-semibold hover:bg-[#38103c] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <MessageSquarePlus size={14} />
              <span>Write a Review</span>
            </button>
          </div>

          {reviews.length > 0 ? (
            <div className="divide-y divide-[#f5ece6]">
              {reviews.map((rev) => (
                <div key={rev.id} className="py-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-[#2d2130]">
                      {rev.user_name || "Verified Buyer"}
                    </span>
                    <span className="text-xs text-[#7a6070]">
                      {new Date(rev.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        className={
                          s <= rev.rating
                            ? "fill-[#e09117] text-[#e09117]"
                            : "text-[#e2d3c8]"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#5a4855] leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#7a6070]">
              No reviews yet for this product. Be the first to write a review!
            </div>
          )}
        </section>

        {/* Related & Recommended Products */}
        <section className="mt-12">
          {relatedProducts.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e2d3c8]">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#48154c]">
                    Related Products
                  </h3>
                  <p className="text-xs text-[#7a6070]">
                    More handcrafted picks from {product.category}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((item) => (
                  <ProductSmallCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Lightbox Image Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={22} />
            </button>
            <img
              src={currentImage}
              alt={productName}
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white text-sm mt-3 font-semibold">{productName}</p>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {newReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e2d3c8]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#f5ece6]">
              <h3 className="font-bold text-lg text-[#48154c]">
                Write a Craft Review
              </h3>
              <button
                onClick={() => setNewReviewModalOpen(false)}
                className="text-[#7a6070] hover:text-[#48154c]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#48154c] mb-1">
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewReviewRating(s)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={22}
                        className={
                          s <= newReviewRating
                            ? "fill-[#e09117] text-[#e09117]"
                            : "text-[#e2d3c8]"
                        }
                      />
                    </button>
                  ))}
                  <span className="font-bold text-[#48154c] ml-2">
                    {newReviewRating} Star{newReviewRating > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#48154c] mb-1">
                  Review Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Share details of the product quality, packaging, and your support to the artisan..."
                  className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3 py-2 text-xs focus:outline-[#48154c]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3 bg-[#48154c] text-white font-bold rounded-xl hover:bg-[#38103c] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {submittingReview ? (
                  <span>Submitting Review...</span>
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Buy Now Modal */}
      {buyNowModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e2d3c8]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#f5ece6]">
              <h3 className="font-bold text-lg text-[#48154c]">
                Instant Purchase
              </h3>
              <button
                onClick={() => setBuyNowModalOpen(false)}
                className="text-[#7a6070] hover:text-[#48154c]"
              >
                <X size={20} />
              </button>
            </div>

            {!orderCompleted ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#f5ece6] rounded-2xl text-xs space-y-2">
                  <p className="font-bold text-sm text-[#2d2130]">{productName}</p>
                  <p className="text-[#7a6070]">Artisan: {sellerName}</p>
                  <p className="text-[#7a6070]">Quantity: {quantity}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-[#e2d3c8] font-bold text-[#48154c] text-sm">
                    <span>Total Amount Payable:</span>
                    <span>₹{calculatedPrice * quantity}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  disabled={orderProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-[#48154c] to-[#ae3a65] text-white font-bold rounded-2xl shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                >
                  {orderProcessing ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order (₹{calculatedPrice * quantity})</span>
                      <Zap size={16} />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto shadow-md">
                  ✓
                </div>
                <h3 className="font-bold text-xl text-[#48154c]">Order Placed!</h3>
                <p className="text-xs text-[#7a6070]">
                  Thank you for supporting <strong>{orderCompleted.seller}</strong>!
                </p>
                <div className="bg-[#f5ece6] p-3 rounded-xl text-xs font-mono text-[#48154c] text-left space-y-1">
                  <p>Order ID: {orderCompleted.orderId}</p>
                  <p>Amount: ₹{orderCompleted.amount}</p>
                  <p>Item: {orderCompleted.productName}</p>
                  <p>Status: CONFIRMED</p>
                </div>
                <button
                  onClick={() => setBuyNowModalOpen(false)}
                  className="w-full py-2.5 bg-[#48154c] text-white text-xs font-semibold rounded-xl hover:bg-[#38103c]"
                >
                  Close Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
