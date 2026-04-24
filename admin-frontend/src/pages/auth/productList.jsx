import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
    Search, Edit3, Image as ImageIcon, 
    Power, ArrowLeft, AlertCircle, 
    DollarSign, LayoutGrid, X, Upload, CheckCircle2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../routes/routePaths";
import { productService } from "../../services/productService";
import toast from "react-hot-toast";

const IMAGE_BASE_URL = "http://localhost:3000/uploads/IMG";

const ProductList = () => {
    const navigate = useNavigate();
    const { categoryId, subcategoryId } = useParams();
    const fileInputRef = useRef(null);

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [subName, setSubName] = useState("Inventory");

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [qty, setQty] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    /**
     * Fetches the master product list and filters by subcategory
     */
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await productService.getProductList(); 
            const productsArray = res.data || [];
            setAllProducts(productsArray);

            const firstMatch = productsArray.find(p => 
                p.subcategory && String(p.subcategory._id) === String(subcategoryId)
            );
            
            if (firstMatch) {
                setSubName(firstMatch.subcategory.name);
            } else {
                setSubName("Registry Node");
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
            const matchesSub = product.subcategory && String(product.subcategory._id) === String(subcategoryId);
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

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setName(product.name);
        setDescription(product.description || "");
        setPrice(product.price);
        setQty(product.qty);
        setPreviewUrl(product.image ? `${IMAGE_BASE_URL}/${product.image}` : null);
        setIsEditModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        }
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingProduct(null);
        setName("");
        setDescription("");
        setPrice("");
        setQty("");
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Number(price) < 0 || Number(qty) < 0) return toast.error("Values cannot be negative");

        try {
            setSubmitting(true);
            const data = new FormData();
            data.append("name", name);
            data.append("description", description);
            data.append("price", price);
            data.append("qty", qty);
            if (selectedFile) data.append("image", selectedFile);

            await productService.updateProduct(editingProduct._id, data);
            toast.success("Product updated successfully");
            handleCloseModal();
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
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

                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-indigo-200">
                            <LayoutGrid size={12} strokeWidth={3} />
                            {subName} Cluster
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                            Product <span className="text-indigo-600/80 font-bold">Panel</span>
                        </h1>
                        <p className="text-slate-600 font-semibold max-w-xl text-lg leading-relaxed italic opacity-80">
                            Managing Products for subCategory: <span className="text-indigo-600 not-italic font-black uppercase">{subName}</span>
                        </p>
                    </div>
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

                <div className="hidden md:grid grid-cols-12 gap-6 px-12 py-4 mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
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
                                    <div className="h-20 w-20 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/10 transition-all">
                                        {product.image ? (
                                            <img src={`${IMAGE_BASE_URL}/${product.image}`} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
                                        {product.price?.toLocaleString()}
                                    </div>
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    {product.status === 1 ? (
                                        <div className="status-pill bg-blue-50 text-blue-700 border-blue-100">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                                            {product.qty} UNITS
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
                                            <ActionIcon onClick={() => handleEditProduct(product)} icon={<Edit3 size={20} />} label="Modify" theme="emerald" />
                                            <ActionIcon onClick={() => handleToggleStatus(product)} icon={<Power size={20} />} label="Deactivate" theme="rose" />
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

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="premium-modal">
                    <div className="premium-modal-card max-w-4xl">
                        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Modify Product</h2>
                                <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                    <CheckCircle2 size={14} /> SECURE UPDATE MODE
                                </p>
                            </div>
                            <button onClick={handleCloseModal} className="p-4 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-500 rounded-3xl transition-all">
                                <X size={28} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="pt-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block ml-2">Identify</label>
                                        <input type="text" className="premium-input" value={name} onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block ml-2">Description</label>
                                        <textarea rows="3" className="premium-input min-h-24 resize-none" value={description} onChange={(e) => setDescription(e.target.value)} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block ml-2">Price ($)</label>
                                            <input type="number" min="0" className="premium-input" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block ml-2">Stock</label>
                                            <input type="number" min="0" className="premium-input" value={qty} onChange={(e) => setQty(e.target.value)} required />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block ml-2">Visual Node</label>
                                    <div onClick={() => fileInputRef.current.click()} className="flex-1 relative group bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-indigo-500 rounded-3xl cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-500 min-h-60">
                                        {previewUrl ? (
                                            <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="text-center p-8">
                                                <Upload size={40} className="mx-auto text-indigo-600 mb-4" />
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Update Photo</p>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <button type="submit" disabled={submitting} className="premium-btn premium-btn-primary w-full py-3.5 text-sm uppercase tracking-[0.16em]">
                                {submitting ? 'COMMITTING...' : 'UPDATE SYSTEM ASSET'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ActionIcon = ({ onClick, icon, label, theme }) => {
    const themes = {
        emerald: "text-emerald-600 border-emerald-100 hover:bg-emerald-600",
        rose: "text-rose-600 border-rose-100 hover:bg-rose-600",
        indigo: "text-indigo-600 border-indigo-100 hover:bg-indigo-600",
    };

    return (
        <button onClick={onClick} className={`p-4 bg-white border-2 rounded-[22px] transition-all duration-300 hover:text-white shadow-sm hover:shadow-lg active:scale-90 group ${themes[theme]}`} title={label}>
            <span className="block group-hover:scale-125 transition-transform duration-300">{icon}</span>
        </button>
    );
};

export default ProductList;