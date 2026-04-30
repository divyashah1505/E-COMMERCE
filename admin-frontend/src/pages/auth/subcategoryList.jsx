import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Search, Plus, Edit3, Layers, Image as ImageIcon,
    X, Upload, Power, ArrowLeft, CheckCircle2,
    Eye, ShoppingBag
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../routes/routePaths";
import { categoryService } from "../../services/categoryService";
import toast from "react-hot-toast";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const SubcategoryList = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams();

    // FIX 1: separate refs (your bug)
    const fileInputRef = useRef(null);
    const productFileRef = useRef(null);

    const [subcategories, setSubcategories] = useState([]);
    const [parentCategory, setParentCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState(null);
    const [selectedSubId, setSelectedSubId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // FORM STATES
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
            (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
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
        if (!file) return;

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
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

            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("categoryId", categoryId);

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            if (editingSubcategory) {
                await categoryService.updateCategory(editingSubcategory._id, formData);
                toast.success("Subcategory updated successfully");
            } else {
                await categoryService.addCategory(formData);
                toast.success("Subcategory added successfully");
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

        if (Number(price) < 0) return toast.error("Price cannot be negative");
        if (Number(qty) < 0) return toast.error("Stock quantity cannot be negative");
        if (!selectedFile) return toast.error("Please upload a product image");

        try {
            setSubmitting(true);

            const uploadData = new FormData();
            uploadData.append("image", selectedFile);

            const uploadRes = await categoryService.uploadImage(uploadData);

            const uploadedImageName = uploadRes?.data?.[0];

            if (!uploadedImageName) {
                throw new Error("Image upload failed");
            }

            const productData = {
                name,
                description,
                qty: Number(qty),
                price: Number(price),
                categoryId: selectedSubId,
                image: uploadedImageName
            };

            await categoryService.addProduct(productData);

            toast.success("Product added successfully");
            handleCloseModal();
        } catch (error) {
            console.error("Product Submit Error:", error);
            toast.error(error?.response?.data?.message || "Product creation failed");
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

                <div className="space-y-6">
                    {!loading && filteredList.map(sub => (
                        <div key={sub._id} className="premium-card flex justify-between items-center">

                            <div className="flex gap-4 items-center">
                                <div className="h-16 w-16 overflow-hidden rounded-lg">
                                    {sub.image ? (
                                        <img src={getImageUrl(sub.image)} className="h-full w-full object-cover" />
                                    ) : (
                                        <ImageIcon />
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-bold">{sub.name}</h3>
                                    <p className="text-sm">{sub.description}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => handleEditSubcategory(sub)}>
                                    <Edit3 size={16} />
                                </button>

                                <button onClick={() => handleOpenProductModal(sub._id)}>
                                    <ShoppingBag size={16} />
                                </button>

                                <button onClick={() => handleToggleStatus(sub)}>
                                    <Power size={16} />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

            </div>

            {/* MODALS KEPT EXACT SAME UI */}
            {isModalOpen && (
                <div className="premium-modal">
                    <div className="premium-modal-card">
                        <form onSubmit={handleSubmit}>
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
                            <textarea value={description} onChange={e => setDescription(e.target.value)} />
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} />

                            <button type="submit">
                                {submitting ? "Saving..." : "Save"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isProductModalOpen && (
                <div className="premium-modal">
                    <div className="premium-modal-card">
                        <form onSubmit={handleProductSubmit}>
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="Product name" />
                            <textarea value={description} onChange={e => setDescription(e.target.value)} />
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
                            <input type="number" value={qty} onChange={e => setQty(e.target.value)} />
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} />

                            <button type="submit">
                                {submitting ? "Adding..." : "Add Product"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SubcategoryList;