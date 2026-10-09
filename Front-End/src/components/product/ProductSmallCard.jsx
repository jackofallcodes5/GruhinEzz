import { useNavigate } from "react-router-dom";

/**
 * ProductSmallCard
 * 
 * View 1 of 3: Used exclusively for:
 * - Product suggestions
 * - Recommended products
 * - Related products
 * - Search suggestions
 * - Compact product lists
 * 
 * Strict Horizontal Layout:
 * Left: Fixed image container, properly contained without distortion.
 * Right: Product name (large & bold), Seller name (smaller text), Product price (large/bold & prominent).
 */
export default function ProductSmallCard({ product, onClick, className = "" }) {
  const navigate = useNavigate();

  if (!product) return null;

  const handleClick = (e) => {
    if (onClick) {
      onClick(product, e);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const productName = product.title || product.name || "Handcrafted Item";

  const sellerName =
    product.artisan_name ||
    (typeof product.seller === "object"
      ? product.seller?.name || "Artisan"
      : product.seller || "Artisan");

  const mainImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : product.image_url || product.image || "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60";

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e);
        }
      }}
      className={`group flex items-center gap-3.5 p-3 bg-white rounded-2xl border border-[#e2d3c8] hover:border-[#ae3a65] hover:shadow-md transition-all duration-200 cursor-pointer select-none ${className}`}
    >
      {/* Left side: Fixed, consistent image container */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#f5ece6] relative">
        <img
          src={mainImage}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Right side: Scannable product info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* Product Name — Large and Bold */}
        <h4 className="text-sm sm:text-base font-bold text-[#2d2130] group-hover:text-[#48154c] transition-colors line-clamp-1 leading-snug">
          {productName}
        </h4>

        {/* Seller Name — Lower visual priority */}
        <p className="text-xs text-[#7a6070] mt-0.5 line-clamp-1 font-normal">
          {sellerName}
        </p>

        {/* Product Price — Large/Bold, visually prominent */}
        <p className="text-base sm:text-lg font-bold text-[#48154c] mt-1.5 leading-none">
          ₹{product.price}
        </p>
      </div>
    </div>
  );
}
