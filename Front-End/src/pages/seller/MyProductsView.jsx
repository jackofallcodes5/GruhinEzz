import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function MyProductsView({ isVerified = true }) {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Add / Edit form state
  const [formData, setFormData] = useState({
    name: "",
    category: "Homemade Foods",
    price: "",
    originalPrice: "",
    stock: "20",
    description: "",
    imageUrl: "",
  });

  // Multer File Upload State
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileMeta, setUploadedFileMeta] = useState(null);

  const fetchSellerProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/seller/products");
      if (res.data?.success) {
        setProductsList(res.data.products || []);
      } else {
        setError(res.data?.message || "Failed to load your products.");
      }
    } catch (err) {
      console.error("Error fetching seller products:", err);
      setError("Failed to load seller products from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellerProducts();
  }, [fetchSellerProducts]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    setUploadError(null);
    setUploadingImage(true);

    const localPreviewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, imageUrl: localPreviewUrl }));
    setUploadedFileMeta({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      multerStored: true,
    });

    try {
      const uploadData = new FormData();
      uploadData.append("image", file);

      const res = await apiClient.post("/upload/product-image", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
        setUploadedFileMeta({
          name: res.data.filename || file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          multerStored: true,
        });
      }
    } catch (err) {
      console.warn("Backend Multer notice (fallback preview retained):", err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredProducts = productsList.filter((p) => {
    const title = p.title || p.name || "";
    const category = p.category || "";
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === "All" || category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    if (!isVerified) {
      alert("🔒 Feature Locked: Product uploads require Admin verification.");
      return;
    }
    setFormData({
      name: "",
      category: "Homemade Foods",
      price: "",
      originalPrice: "",
      stock: "25",
      description: "",
      imageUrl: "",
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.title || p.name || "",
      category: p.category || "Homemade Foods",
      price: p.price || "",
      originalPrice: p.original_price || p.originalPrice || p.price || "",
      stock: p.stock || "10",
      description: typeof p.description === "object" ? (p.description.overview || "") : (p.description || ""),
      imageUrl: p.image_url || (Array.isArray(p.images) ? p.images[0] : p.image) || "",
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const img =
      formData.imageUrl.trim() ||
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80";

    const payload = {
      id: editingProduct ? editingProduct.id : undefined,
      title: formData.name,
      category: formData.category,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) || Number(formData.price),
      stock: Number(formData.stock),
      imageUrl: img,
      description: formData.description || "Authentic handmade craft by household woman artisan.",
    };

    try {
      const res = await apiClient.post("/seller/products", payload);
      if (res.data?.success) {
        showToast(editingProduct ? `Updated "${formData.name}" successfully!` : `Added "${formData.name}"!`);
        fetchSellerProducts();
      } else {
        alert("Failed to save product: " + (res.data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product to server.");
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await apiClient.delete(`/seller/products/${id}`);
      if (res.data?.success) {
        showToast("Product deleted successfully.");
        setProductsList((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product.");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleToggleStatus = async (p) => {
    const nextActive = p.is_active !== false ? false : true;
    try {
      const res = await apiClient.post("/seller/products", {
        id: p.id,
        title: p.title || p.name,
        price: p.price,
        category: p.category,
        isActive: nextActive,
      });
      if (res.data?.success) {
        fetchSellerProducts();
      }
    } catch (err) {
      console.error("Error toggling product status:", err);
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3 bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between shadow-md">
          <span>✓ {toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e2d3c8]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#48154c] flex items-center gap-2">
            <Package size={24} className="text-[#ae3a65]" />
            My Products Catalog
          </h2>
          <p className="text-xs text-[#7a6070] mt-0.5">
            Manage your homemade product inventory, pricing, and live marketplace listings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSellerProducts}
            className="p-2.5 bg-[#f5ece6] hover:bg-[#e2d3c8] text-[#48154c] rounded-xl transition-colors"
            title="Refresh list"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-gradient-to-r from-[#48154c] to-[#ae3a65] text-white rounded-xl text-xs font-bold hover:opacity-95 transition-opacity flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} />
            <span>Add New Craft</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#e2d3c8] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#7a6070] uppercase tracking-wider">
            Total Listings
          </p>
          <p className="text-2xl font-bold text-[#48154c] mt-1">{productsList.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e2d3c8] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#7a6070] uppercase tracking-wider">
            Active Online
          </p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {productsList.filter((p) => p.is_active !== false).length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e2d3c8] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#7a6070] uppercase tracking-wider">
            Total Reviews
          </p>
          <p className="text-2xl font-bold text-[#ae3a65] mt-1">
            {productsList.reduce((acc, p) => acc + (parseInt(p.review_count || 0, 10)), 0)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e2d3c8] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#7a6070] uppercase tracking-wider">
            Low Stock Alerts
          </p>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {productsList.filter((p) => (p.stock || 0) < 10).length}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2d3c8] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-3 text-[#7a6070]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your crafts..."
            className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-[#48154c]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          <span className="text-[#7a6070] font-semibold flex items-center gap-1">
            <Filter size={13} /> Filter:
          </span>
          {["All", "Homemade Foods", "Apparel & Textiles", "Home Decor & Pottery", "Organic & Herbal Care"].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? "bg-[#48154c] text-white font-bold"
                  : "bg-[#f5ece6] text-[#2d2130] hover:bg-[#e2d3c8]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#e2d3c8] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-[#48154c]">
            <Loader2 size={28} className="animate-spin mx-auto mb-2" />
            Loading seller crafts...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs font-semibold text-red-600">
            ⚠️ {error}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2d2130]">
              <thead className="bg-[#f5ece6] text-[#48154c] uppercase font-bold text-[10px] tracking-wider border-b border-[#e2d3c8]">
                <tr>
                  <th className="py-3.5 px-4">Craft / Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5ece6]">
                {filteredProducts.map((p) => {
                  const title = p.title || p.name;
                  const img = p.image_url || (Array.isArray(p.images) ? p.images[0] : p.image);
                  const isActive = p.is_active !== false;
                  return (
                    <tr key={p.id} className="hover:bg-[#fcf9f7] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={title}
                            className="w-12 h-12 rounded-xl object-cover border border-[#e2d3c8] bg-[#f5ece6]"
                          />
                          <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                            <Link
                              to={`/product/${p.id}`}
                              className="font-bold text-[#2d2130] hover:text-[#48154c] line-clamp-1 block transition-colors"
                            >
                              {title}
                            </Link>
                            <span className="text-[10px] text-[#7a6070]">ID: #{p.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-[#7a6070]">
                        {p.category}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-[#48154c]">₹{p.price}</span>
                        {p.original_price > p.price && (
                          <span className="text-[10px] text-[#7a6070] line-through ml-1">
                            ₹{p.original_price}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-md ${
                            (p.stock || 0) < 5
                              ? "bg-red-100 text-red-800"
                              : (p.stock || 0) < 15
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {p.stock || 0} units
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-[#5a4855]">
                        ★ {p.rating || "0.0"} ({p.review_count || 0})
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                              : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {isActive ? "Active ✓" : "Paused ⏸"}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/product/${p.id}`}
                            title="View on Live Product Page"
                            className="p-1.5 text-[#48154c] hover:bg-[#f5ece6] rounded-lg transition-colors"
                          >
                            <Eye size={15} />
                          </Link>

                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Details"
                            className="p-1.5 text-[#ae3a65] hover:bg-[#f5ece6] rounded-lg transition-colors"
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            title="Delete Product"
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <span className="text-4xl block mb-2">📦</span>
            <h3 className="font-bold text-[#48154c] text-base mb-1">No products listed yet</h3>
            <p className="text-xs text-[#7a6070] mb-4">Add your first homemade craft to start selling on GruhinEzz.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#48154c] text-white rounded-xl text-xs font-bold"
            >
              + Add First Craft
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e2d3c8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#f5ece6] mb-4">
              <h3 className="text-lg font-bold text-[#48154c]">
                {editingProduct ? "Edit Craft Listing" : "Add New Handmade Craft"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#7a6070] hover:text-[#48154c]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#48154c] mb-1">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Handcrafted Rose Water Soaps (Set of 3)"
                  className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3 py-2 text-xs focus:outline-[#48154c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#48154c] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3 py-2 text-xs focus:outline-[#48154c]"
                  >
                    <option value="Homemade Foods">Homemade Foods</option>
                    <option value="Apparel & Textiles">Apparel & Textiles</option>
                    <option value="Home Decor & Pottery">Home Decor & Pottery</option>
                    <option value="Organic & Herbal Care">Organic & Herbal Care</option>
                    <option value="Handicrafts">Handicrafts</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#48154c] mb-1">
                    Inventory Stock *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3 py-2 text-xs focus:outline-[#48154c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#48154c] mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 450"
                    className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3 py-2 text-xs focus:outline-[#48154c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#48154c] mb-1">
                    Original / MRP Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g. 600"
                    className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3 py-2 text-xs focus:outline-[#48154c]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#48154c] mb-1">
                  Craft Image Upload (Multer) *
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />

                {!formData.imageUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-[#48154c] bg-[#f5ece6]"
                        : "border-[#e2d3c8] bg-[#fcf9f7] hover:border-[#ae3a65] hover:bg-[#f5ece6]"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#48154c]/10 text-[#48154c] flex items-center justify-center mx-auto mb-2">
                      <Upload size={22} />
                    </div>
                    <p className="font-bold text-xs text-[#48154c]">
                      Click to upload craft photo or drag and drop
                    </p>
                    <p className="text-[10px] text-[#7a6070] mt-0.5">
                      Multer storage: JPG, PNG, WEBP up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#f5ece6] p-3 rounded-2xl border border-[#e2d3c8] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={formData.imageUrl}
                        alt="Product Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-[#e2d3c8] bg-white shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#2d2130] truncate max-w-[180px]">
                            {uploadedFileMeta?.name || "Craft Image"}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-0.5">
                            <CheckCircle2 size={10} /> Multer Stored
                          </span>
                        </div>
                        {uploadedFileMeta?.size && (
                          <span className="text-[10px] text-[#7a6070] block mt-0.5">
                            Size: {uploadedFileMeta.size}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] font-semibold text-[#ae3a65] hover:underline mt-1 block"
                        >
                          Change Photo
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, imageUrl: "" }));
                        setUploadedFileMeta(null);
                      }}
                      className="p-1.5 text-[#7a6070] hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                      title="Remove Image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {uploadingImage && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#48154c] font-semibold">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing file upload via Multer...</span>
                  </div>
                )}

                {uploadError && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">
                    ⚠️ {uploadError}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-[#48154c] mb-1">
                  Product Description & Story *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your handmade craft, traditional ingredients, and the household care that goes into making it..."
                  className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3 py-2 text-xs focus:outline-[#48154c]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#e2d3c8] text-[#7a6070] hover:bg-[#f5ece6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#48154c] to-[#ae3a65] text-white font-bold rounded-xl shadow-xs hover:opacity-95"
                >
                  {editingProduct ? "Save Changes" : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#e2d3c8] text-center">
            <span className="text-3xl block mb-2">🗑️</span>
            <h3 className="font-bold text-base text-[#48154c] mb-1">
              Delete This Listing?
            </h3>
            <p className="text-xs text-[#7a6070] mb-5">
              This will remove the product from the GruhinEzz marketplace search and catalog.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-[#e2d3c8] text-xs font-semibold text-[#7a6070]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
