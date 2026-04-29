import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    Plus,
    Edit3,
    Layers,
    Image as ImageIcon,
    X,
    Upload,
    LayoutGrid,
    CheckCircle2,
    AlertCircle,
    Eye,
    Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/routePaths";
import { categoryService } from "../../services/categoryService";
import toast from "react-hot-toast";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL

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

        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);

        if (selectedCategoryId && isSubcategoryModalOpen) {
            formData.append("categoryId", selectedCategoryId);
        }

        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        if (editingCategory) {
            await categoryService.updateCategory(editingCategory._id, formData);
            toast.success("Category updated successfully");
        } else {
            await categoryService.addCategory(formData);
            toast.success("Category created successfully");
        }

        handleCloseModal();
        fetchCategories();
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Operation failed");
    } finally {
        setSubmitting(false);
    }
};

    return (
        <div className="premium-page">
            <div className="premium-shell">

                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#242424] text-xs font-medium text-slate-600 dark:text-slate-300">
                            <LayoutGrid size={14} className="text-violet-500" strokeWidth={2.5} />
                            Main Categories
                        </div>
                        <h1 className="premium-page-title text-slate-900 dark:text-slate-100">
                            Categories
                        </h1>
                        <p className="premium-body-text text-slate-600 dark:text-slate-400 max-w-xl">
                            Manage your architectural product hierarchy with live synchronization.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="premium-btn premium-btn-primary px-6 py-3"
                    >
                        <Plus size={18} strokeWidth={2.5} />
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
                    <div className="hidden md:grid grid-cols-12 gap-6 px-12 py-4 mb-4 premium-table-head">
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
                                        <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/10 transition-all">
                                            {category.image ? (
                                                <img
                                                    src={`${IMAGE_BASE_URL}/${category.image}`}
                                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <ImageIcon className="text-slate-300" size={24} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-violet-600 transition-colors tracking-tight">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm font-medium text-slate-500 mt-1 line-clamp-2">
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
                                                <ActionIcon onClick={() => handleViewSubcategories(category._id)} icon={<Eye size={16} />} label="View Subcategories" theme="indigo" />
                                                <ActionIcon onClick={() => handleAddSubcategory(category._id)} icon={<Plus size={16} />} label="Add Subcategory" theme="blue" />
                                                <ActionIcon onClick={() => handleEditCategory(category)} icon={<Edit3 size={16} />} label="Edit Category" theme="emerald" />
                                                <ActionIcon
                                                    onClick={() => handleToggleStatus(category)}
                                                    icon={<Trash2 size={16} />}
                                                    label="Deactivate Category"
                                                    theme="rose"
                                                /> </>
                                        ) : (
                                            <button
                                                onClick={() => handleToggleStatus(category)}
                                                className="premium-btn premium-btn-primary px-5 py-2 text-xs"
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
                                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                                    {isSubcategoryModalOpen ? 'Initialize Sub-Category' : editingCategory ? 'Modify Category' : 'New Category'}
                                </h2>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-violet-500" /> {isSubcategoryModalOpen ? 'Nested Configuration' : 'Secure Entry'}
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
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block ml-1">Category name</label>
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
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block ml-1">Description</label>
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
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block ml-1">Image</label>
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className="flex-1 relative group bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-indigo-500 rounded-3xl cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-500 min-h-48"
                                    >
                                        {previewUrl ? (
                                            <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="text-center p-8 space-y-4">
                                                <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center text-violet-600 shadow-sm mx-auto group-hover:scale-110 transition-transform duration-500">
                                                    <Upload size={28} strokeWidth={2.5} />
                                                </div>
                                                <p className="text-sm font-semibold text-slate-500">Upload Image</p>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="premium-btn premium-btn-primary w-full py-3.5"
                            >
                                {submitting
                                    ? 'Saving...'
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
        indigo: "text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10",
        blue: "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10",
        emerald: "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
        rose: "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
    };

    return (
        <button
            onClick={onClick}
            className={`h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200 ${themes[theme]}`}
            title={label}
        >
            {icon}
        </button>
    );
};

export default CategoryList;