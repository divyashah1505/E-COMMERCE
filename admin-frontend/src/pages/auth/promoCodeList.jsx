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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
            PROMO <span className="text-indigo-600">Code</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs mt-4 ml-1">Enterprise Discount Management</p>
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
          placeholder="SEARCH REGISTRY BY CODE OR BENEFIT..."
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
              <tr className="bg-slate-50/80 dark:bg-white/[0.02] border-b-2 border-slate-100 dark:border-white/5">
                <th className="px-12 py-9 text-[13px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.35em]">PromoCodes Details</th>
                <th className="px-12 py-9 text-[13px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.35em]">Discount</th>
                <th className="px-12 py-9 text-[13px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.35em]">Duration</th>
                <th className="px-12 py-9 text-[13px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.35em]">Status</th>
                <th className="px-12 py-9 text-[13px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.35em] text-center">Actions</th>
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
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-900 dark:bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all">
                           <Tag size={28} strokeWidth={3} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-2xl leading-none">{promo.code}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                                {promo.type === 1 ? 'Manual Auth' : 'System Generated'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Benefit */}
                    <td className="px-12 py-10">
                      <div className="flex flex-col">
                        <span className="text-4xl font-black text-slate-900 dark:text-white flex items-baseline gap-1 tracking-tighter">
                          {promo.discountValue}
                          <span className="text-sm text-indigo-600 font-black uppercase tracking-widest ml-1">
                            {promo.discountType === 'percentage' ? '%' : 'FIXED'}
                          </span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-1 italic">Discount Payload</span>
                      </div>
                    </td>

                    {/* Timeline - FIXED READABILITY */}
                    <td className="px-12 py-10">
                       <div className="flex flex-col gap-3 font-black">
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-tighter">Start</span>
                            <span className="text-sm text-slate-700 dark:text-slate-200">
                                {new Date(promo.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase tracking-tighter">Ends</span>
                            <span className="text-sm text-slate-700 dark:text-slate-200">
                                {new Date(promo.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                       </div>
                    </td>

                    {/* Status */}
                    <td className="px-12 py-10">
                      {promo.status === 1 ? (
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                          <ShieldCheck size={18} strokeWidth={4} />
                          <span className="text-xs font-black uppercase tracking-[0.2em]">Active</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          <ShieldAlert size={18} strokeWidth={4} />
                          <span className="text-xs font-black uppercase tracking-[0.2em]">Inactive</span>
                        </div>
                      )}
                    </td>

                    {/* Control */}
                    <td className="px-12 py-10">
                      <div className="flex items-center justify-center gap-4">
                        <button 
                          onClick={() => handleEditClick(promo)}
                          className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white dark:bg-white/5 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-white/10 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-90 shadow-sm"
                        >
                          <Edit3 size={22} strokeWidth={3} />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(promo._id, promo.status)}
                          className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all active:scale-90 shadow-xl ${
                            promo.status === 1 
                            ? 'bg-rose-600 text-white shadow-rose-500/20 hover:bg-rose-700' 
                            : 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700'
                          }`}
                        >
                          {promo.status === 1 ? <PowerOff size={22} strokeWidth={3} /> : <Power size={22} strokeWidth={3} />}
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
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative premium-modal-card max-w-2xl animate-in fade-in zoom-in duration-300">
            
            <div className="px-16 py-14 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
              <div>
                <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                   {isEditing ? 'UPDATE' : 'CREATE'} <span className="text-indigo-600">ASSET</span>
                </h2>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mt-4">Registry Config v1.0</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-16 h-16 flex items-center justify-center rounded-full bg-white dark:bg-white/5 text-slate-400 hover:text-rose-500 transition-all border-2 border-slate-100 dark:border-white/10 shadow-xl">
                <X size={36} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-8">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Protocol</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: Number(e.target.value)})}
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
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                  />
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 p-5 bg-indigo-600 text-white rounded-[1.5rem] shadow-2xl">
                    {formData.discountType === 'percentage' ? <Percent size={32} strokeWidth={4}/> : <DollarSign size={32} strokeWidth={4}/>}
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
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Active Until</label>
                  <input
                    type="date"
                    required
                    className="premium-input font-semibold"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
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