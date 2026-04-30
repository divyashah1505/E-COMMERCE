import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Search, Plus, Edit3, Layers, Image as ImageIcon,
    X, Upload, Power, ArrowLeft, CheckCircle2,
    Eye, ShoppingBag
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../routes/routePaths";
import { categoryService } from "../../services/categoryService";
import { productService } from "../../services/productService";
import toast from "react-hot-toast";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const SubcategoryList = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const fileInputRef = useRef(null);
    const productFileRef = useRef(null);

    const [subcategories, setSubcategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]); 
    const [parentCategory, setParentCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState(null);
    const [selectedSubId, setSelectedSubId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [qty, setQty] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // ================= FETCH DATA =================
    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Fetch categories first
            const res = await categoryService.getCategoryList();
            const allCats = res.data || [];

            const currentParent = allCats.find(
                c => String(c._id) === String(categoryId)
            );

            if (!currentParent) {
                toast.error("Category context not found");
                navigate(PATHS.CATEGORIES);
                return;
            }

            setParentCategory(currentParent);
            setSubcategories(currentParent.subcategories || []);

            // 2. Fetch products in background for counts
            try {
                const prodRes = await productService.getProductList();
                setAllProducts(prodRes.data || []);
            } catch (err) {
                console.warn("Product count fetch failed:", err);
            }
        } catch (error) {
            toast.error("Failed to sync subcategories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [categoryId]);

    // ================= FILTER =================
    const filteredList = useMemo(() => {
        return subcategories.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [subcategories, searchTerm]);

    const handleToggleStatus = async (sub) => {
        try {
            if (sub.status === 1) {
                await categoryService.deactivateCategory(sub._id);
                toast.success(`${sub.name} Deactivated`);
            } else {
                await categoryService.reactivateCategory(sub._id);
                toast.success(`${sub.name} Reactivated`);
            }

            setSubcategories(prev =>
                prev.map(item =>
                    item._id === sub._id
                        ? { ...item, status: item.status === 1 ? 0 : 1 }
                        : item
                )
            );
        } catch {
            toast.error("Action failed");
        }
    };

    const getProductCount = (subId) => {
        return allProducts.filter(p => {
            const pSubId = p.subcategory?._id || p.subcategory;
            return String(pSubId) === String(subId);
        }).length;
    };

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith("http")) return img;
        return `${IMAGE_BASE_URL}/${img}`;
    };

    const handleEditSubcategory = (subcategory) => {
        setEditingSubcategory(subcategory);
        setName(subcategory.name);
        setDescription(subcategory.description || "");
        setPreviewUrl(getImageUrl(subcategory.image));
        setIsModalOpen(true);
    };

    const handleOpenProductModal = (subId) => {
        resetForm();
        setSelectedSubId(subId);
        setIsProductModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setPrice("");
        setQty("");
        setSelectedFile(null);
        setPreviewUrl(null);
        setSelectedSubId(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsProductModalOpen(false);
        setEditingSubcategory(null);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("categoryId", categoryId);

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            if (editingSubcategory) {
                await categoryService.updateCategory(editingSubcategory._id, formData);
                toast.success("Updated successfully");
            } else {
                await categoryService.addCategory(formData);
                toast.success("Added successfully");
            }

            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) return toast.error("Image required");

        try {
            setSubmitting(true);

            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("qty", qty);

            //  IMPORTANT FIX
            formData.append("categoryId", selectedSubId);

            formData.append("image", selectedFile);

            await categoryService.addProduct(formData);

            toast.success("Product added successfully");

            handleCloseModal();
            fetchData();

        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed");
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="premium-page">
            <div className="premium-shell">

                <button
                    onClick={() => navigate(PATHS.CATEGORIES)}
                    className="group flex items-center gap-3 mb-8 text-slate-500 hover:text-indigo-600 transition-all font-semibold text-xs uppercase tracking-[0.14em]"
                >
                    <div className="p-3 bg-white border-2 border-slate-100 rounded-2xl group-hover:border-indigo-200 group-hover:bg-indigo-50 shadow-sm group-hover:-translate-x-1 transition-all">
                        <ArrowLeft size={18} strokeWidth={3} />
                    </div>
                    Return to Main Category
                </button>

                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-300">
                            <Layers size={12} strokeWidth={2.5} />
                            {parentCategory?.name || 'Loading...'}
                        </div>
                        <h1 className="premium-page-title text-slate-900 dark:text-slate-100">
                            Subcategories
                        </h1>
                        <p className="premium-body-text text-slate-600 dark:text-slate-300 max-w-xl">
                            Managing Sub-Categories for: {parentCategory?.name || 'the current category'}.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="premium-btn premium-btn-primary px-6 py-3.5 uppercase tracking-[0.14em]"
                    >
                        <Plus size={18} strokeWidth={3} />
                        New Sub-Category
                    </button>
                </header>

                <div className="relative mb-14 max-w-2xl group">
                    <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Search size={24} strokeWidth={3} />
                    </div>
                    <input
                        type="text"
                        placeholder={`Search in ${parentCategory?.name || 'subcategories'}...`}
                        className="w-full pl-14 pr-6 py-3.5 bg-white/80 dark:bg-[#0f172a]/60 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <div className="hidden md:grid grid-cols-12 gap-6 px-12 py-4 mb-4 premium-table-head">
                        <div className="col-span-5">SubCategory Identity</div>
                        <div className="col-span-2 text-center">Inventory</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-3 text-right">Actions</div>
                    </div>

                    <div className="space-y-6">
                        {!loading && filteredList.map((sub) => (
                            <div
                                key={sub._id}
                                className={`group grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 premium-card ${sub.status === 0 ? 'opacity-75 grayscale-[0.3]' : ''}`}
                            >
                                <div className="col-span-5 flex items-center gap-8">
                                    <div className="h-20 w-20 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/10">
                                        {sub.image ? (
                                            <img
                                                src={getImageUrl(sub.image)}
                                                alt={sub.name}
                                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <ImageIcon className="text-slate-200" size={36} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                                            {sub.name}
                                        </h3>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                                            {sub.description || 'No metadata description provided.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-xs border border-slate-200/50">
                                        <ShoppingBag size={14} className="text-indigo-600" strokeWidth={3} />
                                        {getProductCount(sub._id)} Products
                                    </div>
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    {sub.status === 1 ? (
                                        <div className="status-pill bg-emerald-50 text-emerald-700 border-emerald-100">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Active
                                        </div>
                                    ) : (
                                        <div className="status-pill bg-rose-50 text-rose-600 border-rose-100">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                            Deactivated
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-3 flex items-center justify-end gap-3">
                                    {sub.status === 1 ? (
                                        <>
                                            <ActionIcon onClick={() => navigate(PATHS.SUBCATEGORY_PRODUCTS.replace(':categoryId', categoryId).replace(':subcategoryId', sub._id))} icon={<Eye size={16} />} label="View Products" theme="indigo" />
                                            <ActionIcon onClick={() => handleOpenProductModal(sub._id)} icon={<ShoppingBag size={16} />} label="Add Product" theme="blue" />
                                            <ActionIcon onClick={() => handleEditSubcategory(sub)} icon={<Edit3 size={16} />} label="Edit SubCategory" theme="emerald" />
                                            <ActionIcon onClick={() => handleToggleStatus(sub)} icon={<Power size={16} />} label="Deactivate" theme="rose" />
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleToggleStatus(sub)}
                                            className="premium-btn premium-btn-primary px-5 py-2.5 text-xs uppercase tracking-[0.14em]"
                                        >
                                            Activate
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subcategory Add/Edit Modal */}
            {isModalOpen && (
                <div className="premium-modal">
                    <div className="premium-modal-card max-w-2xl">
                        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                                    {editingSubcategory ? 'Modify Sub-Node' : 'New Sub-Category'}
                                </h2>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                                    <CheckCircle2 size={14} /> Parent Category: {parentCategory?.name}
                                </p>
                            </div>
                            <button onClick={handleCloseModal} className="p-4 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-500 rounded-3xl transition-all duration-300">
                                <X size={28} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="pt-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-8">
                                    <div className="group">
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block ml-1">Subcategory name</label>
                                        <input
                                            type="text"
                                            className="premium-input"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Mechanical Keyboards"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block ml-1">Description</label>
                                        <textarea
                                            rows="4"
                                            className="premium-input min-h-28 resize-none"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="System context..."
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block ml-1">Image</label>
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className="flex-1 relative group bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-indigo-500 rounded-3xl cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-500 min-h-48"
                                    >
                                        {previewUrl ? <img src={previewUrl} className="h-full w-full object-cover" /> : <div className="text-center p-8"><Upload size={32} className="mx-auto text-indigo-600 mb-2" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Upload Image</p></div>}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>
                            <button type="submit" disabled={submitting} className="premium-btn premium-btn-primary w-full py-3.5 text-sm uppercase tracking-[0.16em]">
                                {submitting ? 'COMMITTING DATA...' : 'Add Sub Category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Product Modal with Image Upload */}
            {isProductModalOpen && (
                <div className="premium-modal">
                    <div className="premium-modal-card max-w-4xl">
                        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Add New Product</h2>
                                <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                    <ShoppingBag size={14} /> NEW INVENTORY ITEM
                                </p>
                            </div>
                            <button onClick={handleCloseModal} className="p-4 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-500 rounded-3xl transition-all duration-300">
                                <X size={28} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleProductSubmit} className="pt-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Product Name</label>
                                        <input type="text" className="premium-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Titan Watch" required />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Description</label>
                                        <textarea rows="3" className="premium-input min-h-24 resize-none" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product details..." required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Price ($)</label>
                                            {/* HTML Validation: min="0" */}
                                            <input type="number" min="0" className="premium-input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="500" required />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Stock Qty</label>
                                            {/* HTML Validation: min="0" */}
                                            <input type="number" min="0" className="premium-input" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="10" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Product Image</label>
                                    <div
                                        onClick={() => productFileRef.current.click()}
                                        className="flex-1 relative group bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-indigo-500 rounded-3xl cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-500 min-h-[260px]"
                                    >
                                        {previewUrl ? (
                                            <img src={previewUrl} className="h-full w-full object-cover" alt="Product preview" />
                                        ) : (
                                            <div className="text-center p-8">
                                                <Upload size={40} className="mx-auto text-indigo-600 mb-4" />
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Select Product Photo</p>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={productFileRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <button type="submit" disabled={submitting} className="premium-btn premium-btn-primary w-full py-3.5 text-sm uppercase tracking-[0.16em]">
                                {submitting ? 'ADDING TO SYSTEM...' : 'CONFIRM & ADD PRODUCT'}
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
        indigo: "text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10",
        blue: "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10",
        emerald: "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
        rose: "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
    };

    return (
        <button onClick={onClick} className={`h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200 ${themes[theme]}`} title={label}>
            {icon}
        </button>
    );
};

export default SubcategoryList;