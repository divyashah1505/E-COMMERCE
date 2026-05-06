import React, { useState, useEffect, useMemo, useRef } from "react";
import {
    Search, Edit3, Image as ImageIcon,
    Power, ArrowLeft, AlertCircle,
    DollarSign, LayoutGrid, X, Upload, CheckCircle2, Plus
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../routes/routePaths";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import toast from "react-hot-toast";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ;

const ProductList = () => {
    const navigate = useNavigate();
    const { categoryId, subcategoryId } = useParams();
    const fileInputRef = useRef(null);
    const productFileRef = useRef(null);

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [subName, setSubName] = useState("Inventory");

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
    const [editingProduct, setEditingProduct] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    
    // Advanced Product States (Synced with SubcategoryList)
    const [productImages, setProductImages] = useState([]);
    const [productImagePreviews, setProductImagePreviews] = useState([]);
    const [variants, setVariants] = useState([{ size: '', color: '', stock: '', price: '' }]);
    
    const [previewUrl, setPreviewUrl] = useState(null);
    const [activeLightboxImage, setActiveLightboxImage] = useState(null); 

    /**
     * Helper to resolve image URLs (handles absolute and relative paths)
     */
    const getImageUrl = (img) => {
        // Handle images array or single string
        const imageSrc = Array.isArray(img) ? img[0] : img;
        if (!imageSrc) return null;
        if (imageSrc.startsWith("http")) return imageSrc;
        return `${IMAGE_BASE_URL}/${imageSrc}`;
    };

    /**
     * Fetches the master product list and filters by subcategory
     */
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await productService.getProductList();
            const productsArray = res.data || [];
            setAllProducts(productsArray);

            const firstMatch = productsArray.find(p => {
                const subId = p.subcategory?._id || p.subcategory;
                return String(subId) === String(subcategoryId);
            });

            if (firstMatch) {
                setSubName(firstMatch.subcategory?.name || "Registry Node");
            } else {
                setSubName("Inventory Cluster");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to sync inventory registry");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [subcategoryId]);

    /**
     * Client-side filtering logic
     */
    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            const subId = product.subcategory?._id || product.subcategory;
            const matchesSub = String(subId) === String(subcategoryId);
            
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesSub && matchesSearch;
        });
    }, [allProducts, subcategoryId, searchTerm]);

    /**
     * Toggles product between Active and Deactivated
     */
    const handleToggleStatus = async (product) => {
        try {
            if (product.status === 1) {
                await productService.deactivateProduct(product._id);
                toast.success("Product Deactivated");
            } else {
                await productService.reactivateProduct(product._id);
                toast.success("Product Reactivated");
            }
            fetchProducts();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleAddProduct = () => {
        setModalMode("add");
        setEditingProduct(null);
        setName("");
        setDescription("");
        setProductImages([]);
        setProductImagePreviews([]);
        setVariants([{ size: '', color: '', stock: '', price: '' }]);
        setPreviewUrl(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setModalMode("edit");
        setEditingProduct(product);
        setName(product.name);
        setDescription(product.description || "");
        
        // Load variants
        if (product.variants && product.variants.length > 0) {
            setVariants(product.variants.map(v => ({
                size: v.size || "",
                color: v.color || "",
                stock: v.stock || 0,
                price: v.price || 0
            })));
        } else {
            setVariants([{ size: '', color: '', stock: '', price: '' }]);
        }

        // Load images
        setProductImages([]); // We don't have the File objects for existing images
        if (product.images && product.images.length > 0) {
            setProductImagePreviews(product.images.map(img => getImageUrl(img)));
        } else {
            setProductImagePreviews([]);
        }

        setIsModalOpen(true);
    };

    const handleProductFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setProductImages(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setProductImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeProductImage = (index) => {
        setProductImages(prev => prev.filter((_, i) => i !== index));
        setProductImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { size: '', color: '', stock: '', price: '' }]);
    };

    const removeVariant = (index) => {
        const updatedVariants = variants.filter((_, i) => i !== index);
        setVariants(updatedVariants);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setName("");
        setDescription("");
        setProductImages([]);
        setProductImagePreviews([]);
        setVariants([{ size: '', color: '', stock: '', price: '' }]);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (productImagePreviews.length === 0 && modalMode === "add") 
            return toast.error("At least one image is required");
        
        if (variants.length === 0) 
            return toast.error("At least one variant is required");

        try {
            setSubmitting(true);
            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
            formData.append("categoryId", subcategoryId); // Backend expects categoryId for the subcategory relationship

            // Format variants
            const formattedVariants = variants.map(v => ({
                ...v,
                stock: Number(v.stock) || 0,
                price: Number(v.price) || 0
            }));
            formData.append("variants", JSON.stringify(formattedVariants));

            if (modalMode === "add") {
                // Add all images
                productImages.forEach((file) => {
                    formData.append("images", file);
                });
                await productService.addProduct(formData);
                toast.success("Product created successfully");
            } else {
                // Update Product logic
                // If we have new images, append them
                productImages.forEach((file) => {
                    formData.append("images", file);
                });
                
                await productService.updateProduct(editingProduct._id, formData);
                toast.success("Product updated successfully");
            }

            handleCloseModal();
            fetchProducts();
        } catch (error) {
            console.error("Product Action Error:", error);
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="premium-page">
            <div className="premium-shell">

                <button
                    onClick={() => navigate(PATHS.SUBCATEGORIES.replace(':categoryId', categoryId))}
                    className="group flex items-center gap-3 mb-8 text-slate-500 hover:text-indigo-600 transition-all font-semibold text-xs uppercase tracking-[0.14em]"
                >
                    <div className="p-3 bg-white border-2 border-slate-100 rounded-2xl group-hover:border-indigo-200 group-hover:bg-indigo-50 shadow-sm transition-all">
                        <ArrowLeft size={18} strokeWidth={3} />
                    </div>
                    Return to Sub-Category
                </button>

                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-300">
                            <LayoutGrid size={12} strokeWidth={2.5} />
                            {subName} Cluster
                        </div>
                        <h1 className="premium-page-title text-slate-900 dark:text-slate-100">
                            Products
                        </h1>
                        <p className="premium-body-text text-slate-600 dark:text-slate-300 max-w-xl">
                            Managing products for subcategory: <span className="text-indigo-600 font-semibold">{subName}</span>
                        </p>
                    </div>

                    <button
                        onClick={handleAddProduct}
                        className="premium-btn premium-btn-primary flex items-center gap-2 px-8 py-3.5"
                    >
                        <Plus size={20} strokeWidth={3} />
                        Add Product
                    </button>
                </header>

                <div className="relative mb-14 max-w-2xl group">
                    <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Search size={24} strokeWidth={3} />
                    </div>
                    <input
                        type="text"
                        placeholder={`Search within ${subName}...`}
                        className="w-full pl-14 pr-6 py-3.5 bg-white/80 dark:bg-[#0f172a]/60 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="hidden md:grid grid-cols-12 gap-6 px-12 py-4 mb-4 premium-table-head">
                    <div className="col-span-5">Product Details</div>
                    <div className="col-span-2 text-center">Unit Price</div>
                    <div className="col-span-2 text-center">Status / Qty</div>
                    <div className="col-span-3 text-right">Actions</div>
                </div>

                <div className="space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Assets...</span>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                className={`group grid grid-cols-12 gap-6 items-center p-6 premium-card ${product.status === 0 ? 'opacity-75 grayscale-[0.4]' : ''}`}
                            >
                                <div className="col-span-5 flex items-center gap-8">
                                    <div 
                                        onClick={() => setActiveLightboxImage(getImageUrl(product.images))}
                                        className="h-20 w-20 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/10 cursor-zoom-in group/img relative transition-all"
                                    >
                                        {product.images && product.images.length > 0 ? (
                                            <>
                                                <img src={getImageUrl(product.images)} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Search className="text-white" size={20} />
                                                </div>
                                            </>
                                        ) : (
                                            <ImageIcon className="text-slate-200" size={36} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300 mt-1.5 line-clamp-1 leading-relaxed">
                                            {product.description || 'No contextual description provided.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm border border-emerald-100">
                                        <DollarSign size={14} strokeWidth={3} />
                                        {product.variants?.[0]?.price?.toLocaleString() || "0"}
                                        {product.variants?.length > 1 && "+"}
                                    </div>
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    {product.status === 1 ? (
                                        <div className="status-pill bg-blue-50 text-blue-700 border-blue-100">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                                            {product.variants?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) || 0} UNITS
                                        </div>
                                    ) : (
                                        <div className="status-pill bg-rose-50 text-rose-600 border-rose-100">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                            Deactivated
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-3 flex items-center justify-end gap-3">
                                    {product.status === 1 ? (
                                        <>
                                            <ActionIcon onClick={() => handleEditProduct(product)} icon={<Edit3 size={16} />} label="Modify" theme="emerald" />
                                            <ActionIcon onClick={() => handleToggleStatus(product)} icon={<Power size={16} />} label="Deactivate" theme="rose" />
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleToggleStatus(product)}
                                            className="premium-btn premium-btn-primary px-5 py-2.5 text-xs uppercase tracking-[0.14em]"
                                        >
                                            Activate
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-28 premium-card border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center">
                            <AlertCircle size={64} className="text-slate-200 mb-4" />
                            <h3 className="text-3xl font-black text-slate-900">Inventory Void</h3>
                            <p className="text-slate-400 font-bold uppercase text-xs">No assets detected in this node.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="premium-modal">
                    <div className="premium-modal-card max-w-4xl">
                        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                                    {modalMode === 'add' ? 'Add New Product' : 'Modify Product'}
                                </h2>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                                    <CheckCircle2 size={14} /> SECURE {modalMode === 'add' ? 'CREATION' : 'UPDATE'} MODE
                                </p>
                            </div>
                            <button onClick={handleCloseModal} className="p-4 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-500 rounded-3xl transition-all">
                                <X size={28} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="pt-6 space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Product Name</label>
                                        <input type="text" className="premium-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Titan Watch" required />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Description</label>
                                        <textarea rows="3" className="premium-input min-h-24 resize-none" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product details..." required />
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Product Images</label>
                                        <div
                                            onClick={() => productFileRef.current.click()}
                                            className="relative group bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-indigo-500 rounded-3xl cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-500 min-h-[160px] mb-4"
                                        >
                                            <div className="text-center p-6">
                                                <Upload size={32} className="mx-auto text-indigo-600 mb-3" />
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Add Photos</p>
                                            </div>
                                        </div>
                                        <input type="file" multiple ref={productFileRef} className="hidden" accept="image/*" onChange={handleProductFileChange} />
                                        
                                        {productImagePreviews.length > 0 && (
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                {productImagePreviews.map((preview, idx) => (
                                                    <div key={idx} className="relative h-20 w-20 rounded-xl overflow-hidden border border-slate-200">
                                                        <img src={preview} className="h-full w-full object-cover" alt={`Preview ${idx}`} />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); removeProductImage(idx); }}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between ml-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Product Variants</label>
                                        <button type="button" onClick={addVariant} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 uppercase">
                                            <Plus size={14} /> Add Variant
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {variants.map((variant, index) => (
                                            <div key={index} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl relative group">
                                                {variants.length > 1 && (
                                                    <button type="button" onClick={() => removeVariant(index)} className="absolute -top-2 -right-2 p-1.5 bg-rose-100 text-rose-600 rounded-full hover:bg-rose-500 hover:text-white transition-colors">
                                                        <X size={14} strokeWidth={3} />
                                                    </button>
                                                )}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Size</label>
                                                        <input type="text" className="premium-input text-sm py-2 px-3" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} placeholder="e.g. L, XL" required />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Color</label>
                                                        <input type="text" className="premium-input text-sm py-2 px-3" value={variant.color} onChange={(e) => handleVariantChange(index, 'color', e.target.value)} placeholder="e.g. Red, Black" required />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Stock</label>
                                                        <input type="number" min="0" className="premium-input text-sm py-2 px-3" value={variant.stock === '' ? '' : variant.stock} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} placeholder="0" required />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Price ($)</label>
                                                        <input type="number" min="0" className="premium-input text-sm py-2 px-3" value={variant.price === '' ? '' : variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} placeholder="0" required />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={submitting} className="premium-btn premium-btn-primary w-full py-3.5 text-sm uppercase tracking-[0.16em]">
                                {submitting ? 'COMMITTING ASSETS...' : modalMode === 'add' ? 'CREATE SYSTEM ASSET' : 'CONFIRM UPDATE'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Image Lightbox */}
            {activeLightboxImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setActiveLightboxImage(null)}
                >
                    <button 
                        className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                        onClick={() => setActiveLightboxImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <img 
                        src={activeLightboxImage} 
                        className="max-w-full max-h-[90vh] rounded-3xl shadow-2xl object-contain animate-in zoom-in-95 duration-300"
                        alt="Preview"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

const ActionIcon = ({ onClick, icon, label, theme }) => {
    const themes = {
        emerald: "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
        rose: "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10",
        indigo: "text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10",
    };

    return (
        <button onClick={onClick} className={`h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200 ${themes[theme]}`} title={label}>
            {icon}
        </button>
    );
};

export default ProductList;