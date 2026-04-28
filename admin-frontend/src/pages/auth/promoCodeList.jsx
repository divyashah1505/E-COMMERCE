import React, { useEffect, useState } from 'react';
import {
  Search, Plus, Edit3, Tag, Percent,
  Loader2, DollarSign, X, Power, PowerOff,
  ShieldCheck, ShieldAlert
} from 'lucide-react';
import { promoCodeService } from '../../services/promoCodeService';
import { toast } from 'react-hot-toast';

const PromoCodeList = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const initialFormState = {
    type: 1,
    discountType: 'flat',
    discountValue: '',
    startDate: '',
    endDate: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchPromos = async (query = '') => {
    try {
      setLoading(true);
      const res = await promoCodeService.getPromoCodes(query);
      if (res.success) {
        setPromos(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load promo codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleAddClick = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleEditClick = (promo) => {
    setIsEditing(true);
    setSelectedId(promo._id);
    setFormData({
      type: promo.type,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      startDate: promo.startDate ? new Date(promo.startDate).toISOString().split('T')[0] : '',
      endDate: promo.endDate ? new Date(promo.endDate).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      type: Number(formData.type),
      discountValue: Number(formData.discountValue),
    };

    try {
      if (isEditing) {
        const res = await promoCodeService.updatePromoCode(selectedId, payload);
        if (res.success) {
          toast.success("Promo updated successfully");
          fetchPromos();
          setIsModalOpen(false);
        }
      } else {
        const res = await promoCodeService.addPromoCode(payload);
        if (res.success) {
          toast.success("Promo created successfully");
          fetchPromos();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Operation failed";
      toast.error(errorMsg);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 0 : 1;
    if (!window.confirm(`Confirm status change to ${nextStatus === 1 ? 'Active' : 'Inactive'}?`)) return;

    try {
      const res = await promoCodeService.updatePromoCode(id, { isActive: nextStatus });
      if (res.success) {
        toast.success(`Promo status updated`);
        setPromos(promos.map(p => p._id === id ? { ...p, status: nextStatus } : p));
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="premium-page">
      {/* HEADER SECTION */}
      <div className="premium-shell">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="premium-page-title text-slate-900 dark:text-slate-100">
              Promo Codes
            </h1>
            <p className="premium-body-text text-slate-500 dark:text-slate-300">Manage promotional campaigns and discounts.</p>
          </div>
          <button
            onClick={handleAddClick}
            className="premium-btn premium-btn-primary px-6 py-3.5 text-sm uppercase tracking-[0.14em]"
          >
            <Plus size={18} strokeWidth={3} />
            Generate New Promo
          </button>
        </div>

        {/* SEARCH SYSTEM */}
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by code or discount..."
            className="w-full pl-12 pr-6 py-3.5 bg-white/80 dark:bg-[#0F172A]/70 border border-slate-200 dark:border-white/10 rounded-2xl outline-none text-sm text-slate-800 dark:text-white placeholder:text-slate-400 transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchPromos(e.target.value);
            }}
          />
        </div>

        {/* DATA ARCHITECTURE */}
        <div className="premium-table-shell">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 premium-table-head">
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-12 py-40 text-center">
                      <Loader2 className="animate-spin mx-auto text-indigo-600 mb-6" size={64} strokeWidth={3} />
                      <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-xs">Accessing Secure Records...</p>
                    </td>
                  </tr>
                ) : (
                  promos.map((promo) => (
                    <tr key={promo._id} className="hover:bg-slate-50/60 dark:hover:bg-indigo-500/5 transition-all group">
                      {/* Identity */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-6">
                          <div className="w-10 h-10 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg flex items-center justify-center">
                            <Tag size={18} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white text-base leading-none">{promo.code}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                                {promo.type === 1 ? 'Manual Auth' : 'System Generated'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Benefit */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-2xl font-semibold text-slate-900 dark:text-white flex items-baseline gap-1 tracking-tight">
                            {promo.discountValue}
                            <span className="text-xs text-indigo-600 font-semibold ml-1">
                              {promo.discountType === 'percentage' ? '%' : 'FIXED'}
                            </span>
                          </span>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Discount payload</span>
                        </div>
                      </td>

                      {/* Timeline - FIXED READABILITY */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2 font-medium">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Start</span>
                            <span className="text-sm text-slate-700 dark:text-slate-200">
                              {new Date(promo.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Ends</span>
                            <span className="text-sm text-slate-700 dark:text-slate-200">
                              {new Date(promo.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        {promo.status === 1 ? (
                          <div className="status-pill bg-emerald-50 text-emerald-700 border-emerald-100">
                            <ShieldCheck size={18} strokeWidth={4} />
                            <span className="text-xs">Active</span>
                          </div>
                        ) : (
                          <div className="status-pill bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800">
                            <ShieldAlert size={18} strokeWidth={4} />
                            <span className="text-xs">Inactive</span>
                          </div>
                        )}
                      </td>

                      {/* Control */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => handleEditClick(promo)}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                          >
                            <Edit3 size={16} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(promo._id, promo.status)}
                            className={`h-9 w-9 inline-flex items-center justify-center rounded-lg border transition-colors ${promo.status === 1
                                ? 'border-rose-200 text-rose-600 bg-white dark:bg-slate-950 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                                : 'border-emerald-200 text-emerald-600 bg-white dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                              }`}
                          >
                            {promo.status === 1 ? <PowerOff size={16} strokeWidth={2.5} /> : <Power size={16} strokeWidth={2.5} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GLOBAL CONFIGURATION MODAL */}
        {isModalOpen && (
          <div className="premium-modal">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative premium-modal-card max-w-2xl animate-in fade-in zoom-in duration-300">

              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                    {isEditing ? 'Update Promo' : 'Create Promo'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Promotion configuration</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-950 text-slate-400 hover:text-rose-500 transition-colors border border-slate-200 dark:border-slate-800">
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-8">
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Protocol</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: Number(e.target.value) })}
                      className="premium-input font-semibold appearance-none cursor-pointer"
                    >
                      <option value={1}>MANUAL ENTRY</option>
                      <option value={0}>AUTO GENERATE</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Benefit Logic</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="premium-input font-semibold appearance-none cursor-pointer"
                    >
                      <option value="flat">FLAT CASH</option>
                      <option value="percentage">PERCENT (%)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Magnitude</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-indigo-600 outline-none font-black text-2xl text-slate-900 dark:text-white placeholder:text-slate-200"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    />
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 p-5 bg-indigo-600 text-white rounded-[1.5rem] shadow-2xl">
                      {formData.discountType === 'percentage' ? <Percent size={32} strokeWidth={4} /> : <DollarSign size={32} strokeWidth={4} />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Active From</label>
                    <input
                      type="date"
                      required
                      className="premium-input font-semibold"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Active Until</label>
                    <input
                      type="date"
                      required
                      className="premium-input font-semibold"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    className="premium-btn premium-btn-primary w-full py-3.5 text-sm uppercase tracking-[0.16em]"
                  >
                    {isEditing ? 'DEPLOY UPDATES' : 'EXECUTE AUTHORIZATION'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoCodeList;