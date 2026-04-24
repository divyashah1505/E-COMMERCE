import React, { useEffect, useState } from "react";
import { Search, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { userService } from "../../services/userService";

const CustomerList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch users from backend
    const fetchUsers = async () => {
        try {
            // Fetching a large limit to allow for local filtering in this view
            const res = await userService.getUserList({ page: 1, limit: 100 });
            setUsers(res.data?.users || res.users || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Network synchronization failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Logic to handle both Activation and Deactivation
    const handleStatusToggle = async (userId, currentStatus) => {
        const isDeactivating = currentStatus === 1;
        const actionLabel = isDeactivating ? "deactivate" : "activate";

        if (window.confirm(`Are you sure you want to ${actionLabel} this user?`)) {
            try {
                let res;
                if (isDeactivating) {
                    // Calls DELETE /admin/user/:userId
                    res = await userService.deleteUser(userId);
                } else {
                    // Calls PUT /admin/user/activate/:userId
                    res = await userService.activateUser(userId);
                }

                toast.success(res?.message || `User ${actionLabel}d successfully`);
                fetchUsers(); // Refresh the list to update UI
            } catch (error) {
                // Specific handling for backend errors (like CANNOTREACTIVATE)
                const serverMessage = error.response?.data?.message;

                if (error.response?.status === 403) {
                    // This handles the case where user.deletedBy === userId
                    toast.error(serverMessage || "This user cannot be reactivated manually.");
                } else {
                    toast.error(serverMessage || `Failed to ${actionLabel} user`);
                }
                console.error(`${actionLabel} error details:`, error.response?.data);
            }
        }
    };

    // Filter users based on search input
    const filteredUsers = users.filter((user) => {
        const term = searchTerm.toLowerCase();
        return (
            user.userName?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term) ||
            user.mobile?.includes(term)
        );
    });

    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "??";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100/70 dark:bg-[#07090f]">
                <div className="w-10 h-10 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="premium-page">
            <div className="premium-shell">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">Customers</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-300">Manage user identities and system access.</p>
                    </div>
                </header>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
                        <Search size={18} strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search By Email, "
                        className="w-full pl-12 pr-6 py-3.5 bg-white/80 dark:bg-[#0f172a]/60 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none shadow-sm text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Users Table */}
                <div className="premium-table-shell">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03]">
                                    <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Id</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">userName</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400"> Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Security</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, index) => (
                                        <tr key={user._id} className="group hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-6 text-xs font-bold text-slate-300">
                                                {String(index + 1).padStart(2, '0')}
                                            </td>

                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                                        {getInitials(user.userName)}
                                                    </div>
                                                    <div className="font-bold text-slate-900 text-sm">{user.userName}</div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-6 font-medium text-slate-600 dark:text-slate-300 text-[13px]">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-slate-400" />
                                                    {user.email}
                                                </div>
                                            </td>

                                            <td className="px-6 py-6">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border tracking-wider ${user.status === 1
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                        : "bg-rose-50 text-rose-600 border-rose-100"
                                                    }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${user.status === 1 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                                                    {user.status === 1 ? "Active" : "Deactivated"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-6">
                                                <div className="flex items-center justify-center gap-4">
                                                    <Mail size={15} title="Email Verified" className={user.isVerifiedByEmail ? "text-indigo-600" : "text-slate-200"} />
                                                    <Phone size={15} title="Mobile Verified" className={user.isVerifiedByMobile ? "text-indigo-600" : "text-slate-200"} />
                                                </div>
                                            </td>

                                            <td className="px-6 py-6 text-right">
                                                <button
                                                    onClick={() => handleStatusToggle(user._id, user.status)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-[0.14em] border transition-all ${user.status === 1
                                                            ? "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white"
                                                            : "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                                                        }`}
                                                >
                                                    {user.status === 1 ? "Deactivate" : "Activate"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium">
                                            No customers found matching "{searchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-8 flex flex-col sm:flex-row items-center justify-between px-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Showing: <span className="text-slate-900">{filteredUsers.length}</span> / Total: <span className="text-slate-900">{users.length}</span>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default CustomerList;