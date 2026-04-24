import React, { useState, useEffect, useRef } from "react";
import { 
    Search, Plus, Edit3, Layers, Image as ImageIcon, 
    X, Upload, Power, LayoutGrid, 
    CheckCircle2, AlertCircle, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/routePaths";
import { categoryService } from "../../services/categoryService";
import toast from "react-hot-toast";

const IMAGE_BASE_URL = "http://localhost:3000/uploads/IMG";

const CategoryList = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const fetchCategories = async (search = "") => {
        try {
            setLoading(true);
            const res = await categoryService.getCategoryList(search);
            setCategories(res.data || []);
        } catch (error) {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => fetchCategories(searchTerm), 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleToggleStatus = async (category) => {
        try {
            if (category.status === 1) {
                await categoryService.deactivateCategory(category._id);
                toast.success(`${category.name} Deactivated`);
                // FIX: Update local state instead of calling fetchCategories() 
                // so it doesn't disappear if backend filters it out
                setCategories(prev => prev.map(item => 
                    item._id === category._id ? { ...item, status: 0 } : item
                ));
            } else {
                await categoryService.reactivateCategory(category._id);
                toast.success(`${category.name} Reactivated`);
                setCategories(prev => prev.map(item => 
                    item._id === category._id ? { ...item, status: 1 } : item
                ));
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleViewSubcategories = (categoryId) => {
        if (!categoryId) return toast.error("Invalid ID");
        navigate(PATHS.SUBCATEGORIES.replace(':categoryId', categoryId));
    };

    const handleAddSubcategory = (categoryId) => {
        setSelectedCategoryId(categoryId);
        resetForm();
        setIsSubcategoryModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setName(category.name);
        setDescription(category.description || "");
        setPreviewUrl(category.image ? `${IMAGE_BASE_URL}/${category.image}` : null);
        setIsModalOpen(true);
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
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsSubcategoryModalOpen(false);
        setEditingCategory(null);
        setSelectedCategoryId(null);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const data = new FormData();
            data.append("name", name);
            data.append("description", description);
            if (selectedFile) data.append("image", selectedFile); 

            if (isSubcategoryModalOpen && selectedCategoryId) {
                data.append("categoryId", selectedCategoryId);
                await categoryService.addCategory(data);
                toast.success("Subcategory added successfully");
            } else if (editingCategory) {
                await categoryService.updateCategory(editingCategory._id, data);
                toast.success("Category updated successfully");
            } else {
                await categoryService.addCategory(data);
                toast.success("New category created successfully");
            }

            handleCloseModal();
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="premium-page">
            <div className="premium-shell">
                
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-indigo-200">
                            <LayoutGrid size={12} strokeWidth={3} />
                            Main Categories
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                            Category <span className="text-indigo-600/80 font-bold">Panel</span>
                        </h1>
                        <p className="text-slate-600 font-semibold max-w-xl text-lg leading-relaxed">
                            Manage your architectural product hierarchy with live synchronization.
                        </p>
                    </div>
                    
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="premium-btn premium-btn-primary px-6 py-3.5 uppercase tracking-[0.14em]"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Add New Category
                    </button>
                </header>

                <div className="relative mb-14 max-w-2xl group">
                    <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Search size={24} strokeWidth={3} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search system resources..."
                        className="w-full pl-14 pr-6 py-3.5 bg-white/80 dark:bg-[#0f172a]/60 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium transition-all placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <div className="hidden md:grid grid-cols-12 gap-6 px-12 py-4 mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
                        <div className="col-span-5">Category Details</div>
                        <div className="col-span-2 text-center">Sub-Category</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-3 text-right">Controls</div>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Cloud...</span>
                            </div>
                        ) : (
                            categories.map((category) => (
                                <div
                                    key={category._id} 
                                    className={`group grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 premium-card ${category.status === 0 ? 'opacity-75 grayscale-[0.4]' : ''}`}
                                >
                                    <div className="col-span-5 flex items-center gap-8">
                                        <div className="h-20 w-20 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/10 transition-all">
                                            {category.image ? (
                                                <img 
                                                    src={`${IMAGE_BASE_URL}/${category.image}`} 
                                                    alt={category.name} 
                                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                />
                                            ) : (
                                                <ImageIcon className="text-slate-200" size={36} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                                                {category.description || 'Metadata description not provided.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex justify-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-xs">
                                            <Layers size={16} strokeWidth={3} />
                                            {category.subcategories?.length || 0} Sub-Category
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex justify-center">
                                        {category.status === 1 ? (
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
                                        {category.status === 1 ? (
                                            <>
                                                <ActionIcon onClick={() => handleViewSubcategories(category._id)} icon={<Eye size={20} />} label="View Subcategories" theme="indigo" />
                                                <ActionIcon onClick={() => handleAddSubcategory(category._id)} icon={<Plus size={20} />} label="Add Subcategory" theme="blue" />
                                                <ActionIcon onClick={() => handleEditCategory(category)} icon={<Edit3 size={20} />} label="Edit Category" theme="emerald" />
                                                <ActionIcon onClick={() => handleToggleStatus(category)} icon={<Power size={20} />} label="Deactivate" theme="rose" />
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleToggleStatus(category)}
                                                className="premium-btn premium-btn-primary px-5 py-2.5 text-xs uppercase tracking-[0.14em]"
                                            >
                                                Activate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        {!loading && categories.length === 0 && (
                            <div className="py-28 premium-card border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center">
                                <div className="p-8 bg-slate-50 rounded-full text-slate-300 mb-6">
                                    <AlertCircle size={64} strokeWidth={1} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Registry Empty</h3>
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Awaiting system initialization...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {(isModalOpen || isSubcategoryModalOpen) && (
                <div className="premium-modal">
                    <div className="premium-modal-card max-w-2xl">
                        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                                    {isSubcategoryModalOpen ? 'Initialize Sub-Node' : editingCategory ? 'Modify Protocol' : 'New Master Entity'}
                                </h2>
                                <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                    <CheckCircle2 size={14} /> {isSubcategoryModalOpen ? 'NESTED CONFIGURATION' : 'SECURE ENTRY MODE'}
                                </p>
                            </div>
                            <button onClick={handleCloseModal} className="p-3 bg-slate-100 dark:bg-white/10 hover:bg-rose-500 hover:text-white text-slate-500 rounded-2xl transition-all duration-300">
                                <X size={28} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="pt-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-8">
                                    <div className="group">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Protocol Identity</label>
                                        <input
                                            type="text"
                                            className="premium-input"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. CORE ELECTRONICS"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Contextual Description</label>
                                        <textarea
                                            rows="4"
                                            className="premium-input min-h-28 resize-none"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Provide node purpose..."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Visual Asset Node</label>
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className="flex-1 relative group bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-indigo-500 rounded-3xl cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-500 min-h-48"
                                    >
                                        {previewUrl ? (
                                            <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="text-center p-8 space-y-4">
                                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl mx-auto group-hover:scale-110 transition-transform duration-500">
                                                    <Upload size={32} strokeWidth={3} />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Upload Resource</p>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="premium-btn premium-btn-primary w-full py-3.5 text-sm uppercase tracking-[0.16em]"
                            >
                                {submitting 
                                    ? 'COMMITTING DATA...' 
                                    : isSubcategoryModalOpen 
                                        ? 'Add Subcategory' 
                                        : editingCategory 
                                            ? 'Update Category' 
                                            : 'Add Category'
                                }
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
        <button 
            onClick={onClick}
            className={`p-4 bg-white border-2 rounded-[22px] transition-all duration-300 hover:text-white shadow-sm hover:shadow-lg active:scale-90 group ${themes[theme]}`}
            title={label}
        >
            <span className="block group-hover:scale-125 transition-transform duration-300">
                {icon}
            </span>
        </button>
    );
};

export default CategoryList;