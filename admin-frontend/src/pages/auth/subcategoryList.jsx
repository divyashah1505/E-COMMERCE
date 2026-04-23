import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Search, Plus, Edit3, Layers, Image as ImageIcon,
    X, Upload, Power, ArrowLeft, CheckCircle2,
    AlertCircle, Eye, RefreshCw, ShoppingBag
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PATHS } from "../../routes/routePaths";
import { categoryService } from "../../services/categoryService";
import toast from "react-hot-toast";

const IMAGE_BASE_URL = "http://localhost:3000/uploads/IMG";

const SubcategoryList = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const fileInputRef = useRef(null);

    const [subcategories, setSubcategories] = useState([]);
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

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await categoryService.getCategoryList();
            const allCats = res.data || [];
            const currentParent = allCats.find(c => String(c._id) === String(categoryId));

            if (currentParent) {
                setParentCategory(currentParent);
                setSubcategories(currentParent.subcategories || []);
            } else {
                toast.error("Category context not found");
                navigate(PATHS.CATEGORIES);
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

    const filteredList = useMemo(() => {
        return subcategories.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [subcategories, searchTerm]);

    const handleToggleStatus = async (sub) => {
        try {
            if (sub.status === 1) {
                await categoryService.deactivateCategory(sub._id);
                toast.success(`${sub.name} Deactivated`);
                setSubcategories(prev => prev.map(item => 
                    item._id === sub._id ? { ...item, status: 0 } : item
                ));
            } else {
                await categoryService.reactivateCategory(sub._id);
                toast.success(`${sub.name} Reactivated`);
                setSubcategories(prev => prev.map(item => 
                    item._id === sub._id ? { ...item, status: 1 } : item
                ));
            }
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const handleEditSubcategory = (subcategory) => {
        setEditingSubcategory(subcategory);
        setName(subcategory.name);
        setDescription(subcategory.description || "");
        setPreviewUrl(subcategory.image ? `${IMAGE_BASE_URL}/${subcategory.image}` : null);
        setIsModalOpen(true);
    };

    const handleOpenProductModal = (subId) => {
        setSelectedSubId(subId);
        setName("");
        setDescription("");
        setPrice("");
        setQty("");
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsProductModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsProductModalOpen(false);
        setEditingSubcategory(null);
        setSelectedSubId(null);
        setName("");
        setDescription("");
        setPrice("");
        setQty("");
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const data = new FormData();
            data.append("name", name);
            data.append("description", description);
            if (selectedFile) data.append("image", selectedFile);

            if (editingSubcategory) {
                await categoryService.updateCategory(editingSubcategory._id, data);
                toast.success("Subcategory updated successfully");
            } else {
                data.append("categoryId", categoryId);
                await categoryService.addCategory(data);
                toast.success("Subcategory added successfully");
            }

            handleCloseModal();
            fetchData();
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();

        // VALIDATION: No negative values
        if (Number(price) < 0) {
            return toast.error("Price cannot be a negative value.");
        }
        if (Number(qty) < 0) {
            return toast.error("Stock quantity cannot be a negative value.");
        }
        if (!selectedFile) {
            return toast.error("Please upload a product image");
        }
        
        try {
            setSubmitting(true);
            
            const productFormData = new FormData();
            productFormData.append("name", name);
            productFormData.append("description", description);
            productFormData.append("qty", Number(qty));
            productFormData.append("price", Number(price));
            productFormData.append("categoryId", selectedSubId);
            productFormData.append("image", selectedFile);

            await categoryService.addProduct(productFormData);
            toast.success("Product added successfully");
            handleCloseModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Product creation failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7FA] text-[#1E293B] font-sans antialiased">
            <div className="max-w-[1440px] mx-auto px-8 py-12 lg:px-16">

                <button
                    onClick={() => navigate(PATHS.CATEGORIES)}
                    className="group flex items-center gap-3 mb-10 text-slate-500 hover:text-indigo-600 transition-all font-black text-xs uppercase tracking-[0.2em]"
                >
                    <div className="p-3 bg-white border-2 border-slate-100 rounded-2xl group-hover:border-indigo-200 group-hover:bg-indigo-50 shadow-sm group-hover:-translate-x-1 transition-all">
                        <ArrowLeft size={18} strokeWidth={3} />
                    </div>
                    Return to Main Category
                </button>

                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-indigo-200">
                            <Layers size={12} strokeWidth={3} />
                            {parentCategory?.name || 'Loading...'}
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                            Sub-Categories <span className="text-indigo-600/80 font-bold">Panel</span>
                        </h1>
                        <p className="text-slate-600 font-semibold max-w-xl text-lg leading-relaxed italic opacity-80">
                            Managing Sub-Categories for: {parentCategory?.name || 'the current category'}.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-4 px-10 py-5 bg-[#0F172A] hover:bg-indigo-700 text-white rounded-3xl font-black text-sm transition-all duration-300 shadow-xl shadow-slate-300 active:scale-95"
                    >
                        <Plus size={22} strokeWidth={3} />
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
                        className="w-full pl-20 pr-10 py-6 bg-white border-2 border-slate-100 rounded-[32px] focus:ring-[12px] focus:ring-indigo-500/10 focus:border-indigo-600 outline-none shadow-xl shadow-slate-200/50 text-lg font-bold transition-all placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <div className="hidden md:grid grid-cols-12 gap-6 px-12 py-4 mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
                        <div className="col-span-7">SubCategory Identity</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-3 text-right">Actions</div>
                    </div>

                    <div className="space-y-6">
                        {!loading && filteredList.map((sub) => (
                            <div
                                key={sub._id}
                                className={`group grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 bg-white border border-slate-200/50 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 relative ${sub.status === 0 ? 'opacity-75 grayscale-[0.3]' : ''}`}
                            >
                                <div className="col-span-7 flex items-center gap-8">
                                    <div className="h-28 w-28 rounded-[36px] bg-slate-50 flex items-center justify-center overflow-hidden border-2 border-slate-100">
                                        {sub.image ? (
                                            <img 
                                                src={`${IMAGE_BASE_URL}/${sub.image}`} 
                                                alt={sub.name} 
                                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        ) : (
                                            <ImageIcon className="text-slate-200" size={36} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase">
                                            {sub.name}
                                        </h3>
                                        <p className="text-sm font-bold text-slate-500 mt-2 line-clamp-2 leading-relaxed italic opacity-80">
                                            {sub.description || 'No metadata description provided.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    {sub.status === 1 ? (
                                        <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-full font-black text-[10px] uppercase tracking-widest border-2 border-emerald-100 shadow-sm">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Active
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 px-5 py-2.5 bg-rose-50 text-rose-600 rounded-full font-black text-[10px] uppercase tracking-widest border-2 border-rose-100 shadow-sm">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                            Deactivated
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-3 flex items-center justify-end gap-3">
                                    {sub.status === 1 ? (
                                        <>
                                            <ActionIcon onClick={() => navigate(PATHS.SUBCATEGORY_PRODUCTS.replace(':categoryId', categoryId).replace(':subcategoryId', sub._id))} icon={<Eye size={20} />} label="View Products" theme="indigo" />
                                            <ActionIcon onClick={() => handleOpenProductModal(sub._id)} icon={<ShoppingBag size={20} />} label="Add Product" theme="blue" />
                                            <ActionIcon onClick={() => handleEditSubcategory(sub)} icon={<Edit3 size={20} />} label="Edit SubCategory" theme="emerald" />
                                            <ActionIcon onClick={() => handleToggleStatus(sub)} icon={<Power size={20} />} label="Deactivate" theme="rose" />
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => handleToggleStatus(sub)}
                                            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-100"
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
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="relative w-full max-w-2xl bg-white rounded-[56px] shadow-2xl overflow-hidden border-8 border-white">
                        <div className="flex items-center justify-between p-12 border-b border-slate-100">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                                    {editingSubcategory ? 'Modify Sub-Node' : 'New Sub-Category'}
                                </h2>
                                <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                    <CheckCircle2 size={14} /> Parent Category: {parentCategory?.name}
                                </p>
                            </div>
                            <button onClick={handleCloseModal} className="p-4 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-500 rounded-3xl transition-all duration-300">
                                <X size={28} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="group">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Sub-Category Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 rounded-3xl outline-none font-bold text-slate-900 transition-all shadow-inner"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Mechanical Keyboards"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Description</label>
                                        <textarea
                                            rows="4"
                                            className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 rounded-3xl outline-none font-bold text-slate-900 transition-all shadow-inner resize-none"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="System context..."
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Upload Image</label>
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className="flex-1 relative group bg-slate-50 border-4 border-dashed border-slate-200 hover:border-indigo-500 rounded-[48px] cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-500"
                                    >
                                        {previewUrl ? <img src={previewUrl} className="h-full w-full object-cover" /> : <div className="text-center p-8"><Upload size={32} className="mx-auto text-indigo-600 mb-2" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Upload Image</p></div>}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>
                            <button type="submit" disabled={submitting} className="w-full h-24 bg-[#0F172A] hover:bg-indigo-600 text-white rounded-[36px] font-black text-sm uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl active:scale-95 disabled:opacity-50">
                                {submitting ? 'COMMITTING DATA...' : 'Add Sub Category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Product Modal with Image Upload */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="relative w-full max-w-4xl bg-white rounded-[56px] shadow-2xl overflow-hidden border-8 border-white">
                        <div className="flex items-center justify-between p-12 border-b border-slate-100">
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

                        <form onSubmit={handleProductSubmit} className="p-12 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Product Name</label>
                                        <input type="text" className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none font-bold" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Titan Watch" required />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Description</label>
                                        <textarea rows="3" className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none font-bold resize-none" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product details..." required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Price ($)</label>
                                            {/* HTML Validation: min="0" */}
                                            <input type="number" min="0" className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none font-bold" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="500" required />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Stock Qty</label>
                                            {/* HTML Validation: min="0" */}
                                            <input type="number" min="0" className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none font-bold" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="10" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Product Image</label>
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className="flex-1 relative group bg-slate-50 border-4 border-dashed border-slate-200 hover:border-indigo-500 rounded-[48px] cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-500 min-h-[300px]"
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
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <button type="submit" disabled={submitting} className="w-full h-24 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[36px] font-black text-sm uppercase tracking-[0.4em] transition-all duration-500 shadow-xl shadow-indigo-200 active:scale-95">
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
        indigo: "text-indigo-600 border-indigo-100 hover:bg-indigo-600",
        blue: "text-blue-600 border-blue-100 hover:bg-blue-600",
        emerald: "text-emerald-600 border-emerald-100 hover:bg-emerald-600",
        rose: "text-rose-600 border-rose-100 hover:bg-rose-600"
    };

    return (
        <button onClick={onClick} className={`p-4 bg-white border-2 rounded-[22px] transition-all duration-300 hover:text-white shadow-sm hover:shadow-lg active:scale-90 group ${themes[theme]}`} title={label}>
            <span className="block group-hover:scale-125 transition-transform duration-300">
                {icon}
            </span>
        </button>
    );
};

export default SubcategoryList;