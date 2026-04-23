import React, { useState, useEffect, useRef } from "react";
import { 
    Search, Plus, Edit3, Layers, Image as ImageIcon, 
    X, Upload, Power, LayoutGrid, 
    CheckCircle2, AlertCircle, Eye, RefreshCw
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
        <div className="min-h-screen bg-[#F4F7FA] text-[#1E293B] font-sans antialiased">
            <div className="max-w-[1440px] mx-auto px-8 py-12 lg:px-16">
                
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
                        className="flex items-center gap-4 px-10 py-5 bg-[#0F172A] hover:bg-indigo-700 text-white rounded-3xl font-black text-sm transition-all duration-300 shadow-xl shadow-slate-300 active:scale-95"
                    >
                        <Plus size={22} strokeWidth={3} />
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
                        className="w-full pl-20 pr-10 py-6 bg-white border-2 border-slate-100 rounded-[32px] focus:ring-[12px] focus:ring-indigo-500/10 focus:border-indigo-600 outline-none shadow-xl shadow-slate-200/50 text-lg font-bold transition-all placeholder:text-slate-300"
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
                                    className={`group grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 bg-white border border-slate-200/50 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-500 relative ${category.status === 0 ? 'opacity-75 grayscale-[0.5]' : ''}`}
                                >
                                    <div className="col-span-5 flex items-center gap-8">
                                        <div className="h-28 w-28 rounded-[36px] bg-slate-50 flex items-center justify-center overflow-hidden border-2 border-slate-100 group-hover:border-indigo-300 transition-all shadow-inner">
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
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm font-bold text-slate-500 mt-2 line-clamp-2 leading-relaxed italic opacity-80">
                                                {category.description || 'Metadata description not provided.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex justify-center">
                                        <div className="inline-flex items-center gap-2.5 px-6 py-3 bg-slate-100 text-slate-800 rounded-2xl font-black text-[12px] group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                            <Layers size={16} strokeWidth={3} />
                                            {category.subcategories?.length || 0} Sub-Category
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex justify-center">
                                        {category.status === 1 ? (
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
                                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-100"
                                            >
                                                Activate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        {!loading && categories.length === 0 && (
                            <div className="py-40 bg-white rounded-[48px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center">
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
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="relative w-full max-w-2xl bg-white rounded-[56px] shadow-2xl overflow-hidden border-8 border-white">
                        <div className="flex items-center justify-between p-12 border-b border-slate-100">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                                    {isSubcategoryModalOpen ? 'Initialize Sub-Node' : editingCategory ? 'Modify Protocol' : 'New Master Entity'}
                                </h2>
                                <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                    <CheckCircle2 size={14} /> {isSubcategoryModalOpen ? 'NESTED CONFIGURATION' : 'SECURE ENTRY MODE'}
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
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-2">Protocol Identity</label>
                                        <input
                                            type="text"
                                            className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 rounded-3xl outline-none font-bold text-slate-900 transition-all shadow-inner placeholder:text-slate-300"
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
                                            className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 rounded-3xl outline-none font-bold text-slate-900 transition-all shadow-inner resize-none placeholder:text-slate-300"
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
                                        className="flex-1 relative group bg-slate-50 border-4 border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-[48px] cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-500"
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
                                className="w-full h-24 bg-[#0F172A] hover:bg-indigo-600 text-white rounded-[36px] font-black text-sm uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl active:scale-95 disabled:opacity-50"
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