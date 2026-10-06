import { useEffect, useState } from "react";
import {
  User as UserIcon,
  Zap,
  HardDrive,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  LogOut,
  Sparkles,
  Database,
} from "lucide-react";

// Thay đổi đường dẫn import này cho phù hợp với dự án của bạn (ví dụ: "../firebase" hoặc "@/firebase")
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, onSnapshot, collection, query, where, orderBy } from "firebase/firestore";

interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
  energyBalance: number;
  maxEnergy: number;
  planName: string;
  storageQuotaGB: number;
  storageUsedGB?: number;
}

interface TransactionHistory {
  id: string;
  orderCode: string;
  planTitle: string;
  amount: number;
  date: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
}

export const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "Thành Viên SinhHAI",
    email: "Đang tải...",
    energyBalance: 0,
    maxEnergy: 550000,
    planName: "Gói Miễn Phí",
    storageQuotaGB: 1,
    storageUsedGB: 0.1,
  });

  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setProfile((prev) => ({
          ...prev,
          displayName: user.displayName || user.email?.split("@")[0] || "Thành Viên SinhHAI",
          email: user.email || "",
          photoURL: user.photoURL || undefined,
        }));

        // Lắng nghe dữ liệu User Real-time từ Firestore
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeProfile = onSnapshot(
          userDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              setProfile((prev) => ({
                ...prev,
                energyBalance: data.energyBalance ?? prev.energyBalance,
                maxEnergy: data.maxEnergy ?? prev.maxEnergy,
                planName: data.planName ?? prev.planName,
                storageQuotaGB: data.storageQuotaGB ?? prev.storageQuotaGB,
                storageUsedGB: data.storageUsedGB ?? prev.storageUsedGB,
              }));
            }
          },
          (err) => console.warn("Lỗi Firestore Profile:", err)
        );

        // Lắng nghe Lịch sử Giao dịch
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribeTx = onSnapshot(
          q,
          (snapshot) => {
            const txList: TransactionHistory[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                orderCode: data.orderCode || docSnap.id.substring(0, 8).toUpperCase(),
                planTitle: data.planTitle || "Nâng cấp Năng Lượng AI",
                amount: data.amount || 0,
                date: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleString("vi-VN") : "Gần đây",
                status: data.status === "SUCCESS" ? "SUCCESS" : data.status === "PENDING" ? "PENDING" : "FAILED",
              };
            });
            setTransactions(txList);
            setLoading(false);
          },
          (error) => {
            console.warn("Lỗi tải lịch sử giao dịch:", error);
            setLoading(false);
          }
        );

        return () => {
          unsubscribeProfile();
          unsubscribeTx();
        };
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  const energyPercentage = profile.maxEnergy > 0
    ? Math.min(100, Math.max(0, (profile.energyBalance / profile.maxEnergy) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER PROFILE */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/30 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-purple-500/20">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">{profile.displayName}</h1>
                  <ShieldCheck className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-sm text-slate-500 dark:text-zinc-400 font-mono">{profile.email}</p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    {profile.planName}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">
                    • UID: {currentUser?.uid.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="/checkout"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium text-sm shadow-md hover:shadow-purple-500/20 transition-all"
              >
                Nâng cấp gói
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* METRICS & USAGE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Năng lượng AI */}
          <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <Zap className="w-5 h-5 fill-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Năng Lượng AI SinhHAI</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Dùng chung cho Chatbot, Studio & Workflows</p>
                  </div>
                </div>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                  {energyPercentage.toFixed(0)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-3.5 p-0.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${energyPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-500 dark:text-zinc-400 pt-1">
                  <span>Khả dụng: <strong>{profile.energyBalance.toLocaleString()}</strong> Token</span>
                  <span>Tối đa: {profile.maxEnergy.toLocaleString()} Token</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
              <span>Tự động làm mới hoặc nạp thêm khi nâng cấp gói.</span>
              <a href="/pricing" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">Mua thêm token &rarr;</a>
            </div>
          </div>

          {/* Card 2: Dung lượng Cloud */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Lưu Trữ Tệp AI</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Firebase Storage Cloud</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500 dark:text-zinc-400">Đã sử dụng</span>
                    <span className="font-semibold font-mono">{profile.storageQuotaGB} GB</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2">
                    <div className="bg-blue-500 h-full rounded-full w-[15%]" />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl text-xs text-slate-600 dark:text-zinc-400 space-y-1">
                  <p className="font-medium flex items-center gap-1 text-slate-700 dark:text-zinc-300">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    Hỗ trợ tài liệu:
                  </p>
                  <p>PDF, DOCX, TXT, CSV dùng cho AI đàm thoại và phân tích dữ liệu.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 dark:text-zinc-500">
              Cần thêm bộ nhớ? Nâng cấp lên gói Business.
            </div>
          </div>

        </div>

        {/* TRANSACTION HISTORY */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Lịch Sử Giao Dịch & Nâng Cấp</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Tất cả hóa đơn thanh toán của bạn trên SinhHAI</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 dark:text-zinc-400 text-sm">
              <div className="inline-block w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-2" />
              <p>Đang đồng bộ dữ liệu thanh toán...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
              <CreditCard className="w-10 h-10 mx-auto text-slate-300 dark:text-zinc-700 mb-3" />
              <p className="text-slate-600 dark:text-zinc-400 font-medium text-sm">Chưa có giao dịch nào</p>
              <p className="text-slate-400 dark:text-zinc-500 text-xs mt-1">Các gói đăng ký nâng cấp sẽ được ghi nhận tại đây.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    <th className="py-3 px-4 font-medium">Mã Đơn</th>
                    <th className="py-3 px-4 font-medium">Gói Dịch Vụ</th>
                    <th className="py-3 px-4 font-medium">Số Tiền</th>
                    <th className="py-3 px-4 font-medium">Thời Gian</th>
                    <th className="py-3 px-4 font-medium text-right">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-medium">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="py-4 px-4 font-mono text-purple-600 dark:text-purple-400 font-bold">
                        #{tx.orderCode}
                      </td>
                      <td className="py-4 px-4 text-slate-800 dark:text-zinc-200">
                        {tx.planTitle}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {tx.amount.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {tx.date}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {tx.status === "SUCCESS" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Thành công
                          </span>
                        ) : tx.status === "PENDING" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3.5 h-3.5" />
                            Chờ xử lý
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Thất bại
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
