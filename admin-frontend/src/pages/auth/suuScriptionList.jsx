import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subScriptionService';
import { Plus, Edit2, CheckCircle, XCircle, Loader2, Award, Truck, Percent } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SubscriptionList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Initial State matching your Postman structure
  const initialState = {
    plan_type: 1,
    name: '',
    price: '',
    duration_months: '',
    discount_percent: '',
    max_discount_limit: '',
    min_order_amount: '',
    free_delivery: 0,
    free_delivery_min_amount: '',
    rewards: {
      first_order_points: '',
      slab: {
        "200": '',
        "500": '',
        "1000": '',
        "2000": ''
      }
    }
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await subscriptionService.getAllPlans();
      setPlans(res.data || []);
    } catch (err) {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSlabChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        slab: {
          ...prev.rewards.slab,
          [key]: Number(value)
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure numeric fields are numbers
      const payload = {
        ...formData,
        plan_type: Number(formData.plan_type),
        price: Number(formData.price),
        duration_months: Number(formData.duration_months),
        free_delivery: formData.free_delivery ? 1 : 0
      };

      if (editingPlan) {
        await subscriptionService.updatePlan(editingPlan._id, payload);
        toast.success("Plan updated successfully");
      } else {
        await subscriptionService.addPlan(payload);
        toast.success("Plan created successfully");
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        ...plan,
        rewards: plan.rewards || initialState.rewards // fallback for older entries
      });
    } else {
      setEditingPlan(null);
      setFormData(initialState);
    }
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (plan) => {
    try {
      if (plan.is_active === 1) {
        await subscriptionService.disablePlan(plan._id);
        toast.success("Plan deactivated");
      } else {
        await subscriptionService.enablePlan(plan._id);
        toast.success("Plan activated");
      }
      fetchPlans();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Subscription Plan</h1>
          <p className="text-slate-500 font-medium italic text-sm">Configure Membership Tiers & Benefit Slabs</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-all"
        >
          <Plus size={20} /> Create New Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all">
              <div className="flex justify-between items-center mb-6">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${plan.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {plan.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openModal(plan)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit2 size={18}/></button>
                  <button onClick={() => handleToggleStatus(plan)} className={`p-2 rounded-xl transition-all ${plan.is_active ? 'text-rose-400 hover:bg-rose-50' : 'text-emerald-400 hover:bg-emerald-50'}`}>
                    {plan.is_active ? <XCircle size={18}/> : <CheckCircle size={18}/>}
                  </button>
                </div>
              </div>

              <h2 className="text-xl font-black text-slate-900 mb-1">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-indigo-600">₹{plan.price}</span>
                <span className="text-slate-400 font-bold text-xs">/ {plan.duration_months} Months</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <Percent size={16} className="text-indigo-500" />
                  <span>{plan.discount_percent}% off up to ₹{plan.max_discount_limit}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <Truck size={16} className="text-indigo-500" />
                  <span>Free delivery {plan.free_delivery ? `> ₹${plan.free_delivery_min_amount}` : 'Disabled'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <Award size={16} className="text-indigo-500" />
                  <span>{plan.rewards?.first_order_points} Welcome Points</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Configure Membership</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Basic Info */}
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-[30px] space-y-4">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Base Settings</p>
                  
                  <input required placeholder="Plan Name" className="w-full px-5 py-4 bg-white rounded-2xl font-bold border-none ring-1 ring-slate-200"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Price (₹)" className="px-5 py-4 bg-white rounded-2xl font-bold border-none ring-1 ring-slate-200"
                      value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                    <input type="number" placeholder="Months" className="px-5 py-4 bg-white rounded-2xl font-bold border-none ring-1 ring-slate-200"
                      value={formData.duration_months} onChange={(e) => setFormData({...formData, duration_months: e.target.value})} />
                  </div>

                  <select className="w-full px-5 py-4 bg-white rounded-2xl font-bold border-none ring-1 ring-slate-200"
                    value={formData.plan_type} onChange={(e) => setFormData({...formData, plan_type: e.target.value})}>
                    <option value={1}>Type 1 (Silver)</option>
                    <option value={2}>Type 2 (Gold)</option>
                    <option value={3}>Type 3 (Platinum)</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-6 rounded-[30px] space-y-4">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Offer Rules</p>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Discount %" className="px-5 py-4 bg-white rounded-2xl font-bold border-none ring-1 ring-slate-200"
                      value={formData.discount_percent} onChange={(e) => setFormData({...formData, discount_percent: e.target.value})} />
                    <input type="number" placeholder="Max Limit (₹)" className="px-5 py-4 bg-white rounded-2xl font-bold border-none ring-1 ring-slate-200"
                      value={formData.max_discount_limit} onChange={(e) => setFormData({...formData, max_discount_limit: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-3 p-2">
                    <input type="checkbox" className="w-5 h-5 accent-indigo-600" checked={formData.free_delivery === 1} 
                      onChange={(e) => setFormData({...formData, free_delivery: e.target.checked ? 1 : 0})} />
                    <span className="font-bold text-sm text-slate-600">Free Delivery</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Rewards & Slabs */}
              <div className="space-y-6">
                <div className="bg-indigo-50 p-6 rounded-[30px] space-y-4 border border-indigo-100">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Points & Slabs</p>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Welcome Points</label>
                    <input type="number" className="w-full px-5 py-4 bg-white rounded-2xl font-bold border-none ring-1 ring-slate-200"
                      value={formData.rewards.first_order_points} 
                      onChange={(e) => setFormData({...formData, rewards: {...formData.rewards, first_order_points: e.target.value}})} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(formData.rewards.slab).map((key) => (
                      <div key={key} className="space-y-1">
                        <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">Slab {key}</label>
                        <input type="number" placeholder="Points" className="w-full px-5 py-3 bg-white rounded-xl font-bold border-none ring-1 ring-slate-200 text-sm"
                          value={formData.rewards.slab[key]} 
                          onChange={(e) => handleSlabChange(key, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 font-bold text-slate-400 hover:text-slate-600">Discard</button>
                  <button type="submit" className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    {editingPlan ? 'Update Plan' : 'Save Plan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;