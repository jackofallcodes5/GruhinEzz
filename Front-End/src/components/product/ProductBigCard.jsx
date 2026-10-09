import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingBag, Eye, Zap, CheckCircle2 } from "lucide-react";

/**
 * ProductBigCard
 * 
 * View 2 of 3: Used exclusively for:
 * - Main results of product search
 * 
 * Layout & Presentation:
 * - Clearly larger and more informative than Small Card (without becoming a full product page).
 * - Left/Top: Large product image with consistent aspect ratio, optional gallery thumbnails, wishlist toggle.
 * - Product information: Category, Large bold product name, Seller name, Rating & reviews, Prominent price + MRP + discount, Short description, Availability status, Variant indicator.
 * - Actions: View Product / Card click -> Product Page, Add to Cart, Buy Now, Wishlist.
 */
export default function ProductBigCard({
  product,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
  isWishlisted = false,
  className = "",
}) {
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [wishlistActive, setWishlistActive] = useState(isWishlisted);
  const [addedToast, setAddedToast] = useState(false);

  if (!product) return null;

  const productName = product.title || product.name || "Handcrafted Item";

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image_url || product.image || "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80"];

  const currentImage = images[activeImageIndex] || images[0];

  const sellerName =
    product.artisan_name ||
    (typeof product.seller === "object"
      ? product.seller?.name || "Artisan"
      : product.seller || "Artisan");

  const sellerLocation =
    typeof product.seller === "object" ? product.seller?.location : null;

  const shortDescription =
    typeof product.description === "object"
      ? product.description?.overview || ""
      : typeof product.description === "string"
      ? product.description
      : "";

  const reviewCount = product.review_count || product.reviewCount || 0;
  const originalPrice = product.original_price || product.originalPrice;

  const handleCardClick = (e) => {
    // Avoid clicking if clicking an action button
    if (e.target.closest("button") || e.target.closest("a")) return;
    navigate(`/product/${product.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    const nextState = !wishlistActive;
    setWishlistActive(nextState);
    if (onWishlistToggle) {
      onWishlistToggle(product, nextState);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  // Variant summary
  const variantSummary = product.variants && product.variants.length > 0
    ? product.variants.map((v) => `${v.name}: ${v.options?.length || 0} choices`).join(" • ")
    : null;

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-3xl border border-[#e2d3c8] hover:border-[#ae3a65] hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row overflow-hidden cursor-pointer ${className}`}
    >
      {/* ── Left / Top: Large Product Image Presentation ── */}
      <div className="relative w-full md:w-72 lg:w-80 md:flex-shrink-0 bg-[#f5ece6] overflow-hidden flex flex-col justify-between">
        {/* Main Image Container with Fixed Consistent Aspect Ratio */}
        <div className="relative aspect-[4/3] md:aspect-auto md:h-64 w-full overflow-hidden">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Category Chip */}
          <span className="absolute top-3 left-3 bg-[#48154c]/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {product.category}
          </span>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={wishlistActive ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white flex items-center justify-center text-[#7a6070] hover:text-[#ae3a65] shadow-sm transition-transform active:scale-90"
          >
            <Heart
              size={18}
              className={wishlistActive ? "fill-[#ae3a65] text-[#ae3a65]" : ""}
            />
          </button>

          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute bottom-3 left-3 bg-[#ae3a65] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              {product.discount}
            </div>
          )}
        </div>

        {/* Optional Gallery Thumbnail Preview */}
        {images.length > 1 && (
          <div
            className="hidden sm:flex items-center gap-1.5 p-2 bg-black/5 backdrop-blur-xs border-t border-[#e2d3c8]/50 overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImageIndex === idx
                    ? "border-[#48154c] scale-105 shadow-xs"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Product Information & Scannable Details ── */}
      <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Category & Rating */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-[#ae3a65] uppercase tracking-wider">
              {product.category}
            </span>

            {/* Rating and Reviews */}
            {product.rating && (
              <div className="flex items-center gap-1.5 bg-[#f5ece6] px-2.5 py-1 rounded-full text-xs font-semibold text-[#48154c]">
                <Star size={13} className="fill-[#e09117] text-[#e09117]" />
                <span>{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-[#7a6070] font-normal">
                    ({product.reviewCount} reviews)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Name — Large and Bold */}
          <h3 className="text-lg md:text-xl font-bold text-[#2d2130] group-hover:text-[#48154c] transition-colors line-clamp-2 leading-tight">
            {productName}
          </h3>

          {/* Seller Name & Location */}
          <p className="text-xs text-[#7a6070] mt-1 mb-2.5">
            By <strong className="text-[#48154c] font-semibold">{sellerName}</strong>
            {sellerLocation && <span> • {sellerLocation}</span>}
          </p>

          {/* Price Section */}
          <div className="flex items-baseline gap-2.5 mb-2.5">
            <span className="text-2xl font-extrabold text-[#48154c]">
              ₹{product.price}
            </span>
            {originalPrice && originalPrice > product.price && (
              <span className="text-sm text-[#7a6070] line-through">
                ₹{originalPrice}
              </span>
            )}
            {product.discount && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {product.discount}
              </span>
            )}
          </div>

          {/* Short Product Description */}
          {shortDescription && (
            <p className="text-xs sm:text-sm text-[#5a4855] line-clamp-2 leading-relaxed mb-3">
              {shortDescription}
            </p>
          )}

          {/* Variant & Stock Status Indicators */}
          <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
            {/* Availability status */}
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 size={13} />
              {product.stock > 0
                ? product.stock < 5
                  ? `Only ${product.stock} left in stock`
                  : "In Stock"
                : "Out of Stock"}
            </span>

            {/* Variant preview */}
            {variantSummary && (
              <span className="text-[#7a6070] bg-[#efe5e5] px-2 py-0.5 rounded-md">
                {variantSummary}
              </span>
            )}
          </div>
        </div>

        {/* ── Actions: Clean & Scannable ── */}
        <div className="pt-4 border-t border-[#f5ece6] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(`/product/${product.id}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#48154c] hover:text-[#ae3a65] transition-colors py-1 px-1"
          >
            <Eye size={15} />
            <span>View Full Details</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            {/* Add to Cart button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#48154c] text-[#48154c] hover:bg-[#48154c] hover:text-white transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <ShoppingBag size={14} />
              <span>{addedToast ? "Added! ✓" : "Add to Cart"}</span>
            </button>

            {/* Buy Now button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="px-4 py-2 bg-gradient-to-r from-[#48154c] to-[#ae3a65] text-white rounded-xl text-xs font-semibold hover:opacity-95 shadow-sm transition-all flex items-center gap-1.5"
            >
              <Zap size={14} />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
