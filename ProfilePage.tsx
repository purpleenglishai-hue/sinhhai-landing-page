import { useEffect, useState } from "react";
import { User, Zap, HardDrive, CreditCard, Clock, CheckCircle2, ShieldCheck, Sparkles, Settings, Bell, Lock, Users, HelpCircle, ArrowUpRight } from "lucide-react";

// Kết nối Firebase từ cấu trúc thư mục hiện tại của bạn
import { auth, db } from "./src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, collection, query, where, orderBy } from "firebase/firestore";

interface UserProfile {
  displayName: string;
  email: string;
  energyBalance: number;
  maxEnergy: number;
  planName: string;
  storageQuotaGB: number;
}

interface TransactionHistory {
  id: string;
  orderCode: string;
  planTitle: string;
  amount: number;
  date: string;
  status: "SUCCESS" | "PENDING";
}

export const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "Thành Viên SinhHAI",
    email: "Đang tải...",
    energyBalance: 0,
    maxEnergy: 550000,
    planName: "Gói Miễn Phí",
    storageQuotaGB: 1,
  });

  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("profile");

  useEffect(() => {
    // Lắng nghe trạng thái đăng nhập Firebase
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Cập nhật thông tin cơ bản từ Auth
        setProfile((prev) => ({
          ...prev,
          displayName: currentUser.displayName || currentUser.email?.split("@")[0] || "Thành Viên SinhHAI",
          email: currentUser.email || "",
        }));

        // Lắng nghe dữ liệu User Real-time từ Firestore collection 'users'
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setProfile((prev) => ({
              ...prev,
              energyBalance: data.energyBalance ?? prev.energyBalance,
              maxEnergy: data.maxEnergy ?? prev.maxEnergy,
              planName: data.planName ?? prev.planName,
              storageQuotaGB: data.storageQuotaGB ?? prev.storageQuotaGB,
            }));
          }
        });

        // Lắng nghe Lịch sử Giao dịch từ collection 'transactions'
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribeTx = onSnapshot(
          q,
          (snapshot) => {
            const txList: TransactionHistory[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                orderCode: data.orderCode || docSnap.id.substring(0, 8),
                planTitle: data.planTitle || "Nâng cấp Năng Lượng AI",
                amount: data.amount || 0,
                date: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleString("vi-VN") : "Gần đây",
                status: data.status === "SUCCESS" ? "SUCCESS" : "PENDING",
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

  const energyPercentage = profile.maxEnergy > 0 
    ? Math.min(100, Math.max(0, (profile.energyBalance / profile.maxEnergy) * 100))
    : 0;

  const storagePercentage = Math.min(100, Math.max(12, (profile.storageQuotaGB / 100) * 100));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar mô phỏng theo mẫu chuẩn UI Dashboard */}
      <aside className="w-full md:w-72 bg-[#6b21a8] text-white flex flex-col justify-between p-6 shadow-xl flex-shrink-0">
        <div className="space-y-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg border border-white/20 shadow-inner">
              SH
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wide block">SinhHAI System</span>
              <span className="text-xs text-purple-200/80">AI Workspace Pro</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5 text-sm font-medium">
            <a href="#home" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-purple-100">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>Tổng quan hệ thống</span>
            </a>
            <a href="#dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-purple-100">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Năng Lượng AI</span>
            </a>
            <a href="#storage" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-purple-100">
              <HardDrive className="w-4 h-4 text-blue-300" />
              <span>Kho Tri Thức & Lưu Trữ</span>
            </a>
            <a href="#team" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-purple-100">
              <Users className="w-4 h-4 text-purple-300" />
              <span>Cộng đồng & Hỗ trợ</span>
            </a>
            <a href="#settings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold shadow-sm">
              <Settings className="w-4 h-4 text-purple-200" />
              <span>Cài đặt tài khoản</span>
            </a>
          </nav>
        </div>

        {/* Storage Widget ở bottom sidebar (giống mẫu hình) */}
        <div className="mt-8 pt-6 border-t border-white/15 space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-purple-200">
              <span>Dung lượng lưu trữ</span>
              <span>{profile.storageQuotaGB} GB / 100 GB</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-purple-300 to-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-purple-200/70 leading-relaxed">
            Nâng cấp gói tài nguyên để mở rộng không gian đọc hiểu tài liệu lớn qua Gemini.
          </p>
          <a
            href="/#pricing"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-white text-[#6b21a8] hover:bg-purple-50 text-xs font-bold rounded-xl transition-all shadow-md"
          >
            <span>Nâng Cấp Ngay</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* User info mini badge dưới cùng sidebar */}
          <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-purple-500/40 border border-white/20 flex items-center justify-center text-white font-bold flex-shrink-0 text-xs">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate text-white">{profile.displayName}</p>
                <p className="text-[10px] text-purple-200 truncate font-mono">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-5xl mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Cài Đặt Hồ Sơ</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Quản lý thông tin cá nhân, hạn mức năng lượng AI và bảo mật tài khoản hệ thống.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full border border-purple-200 dark:border-purple-800 uppercase">
              {profile.planName}
            </span>
          </div>
        </div>

        {/* Tab Navigation (Mô phỏng chính xác menu ngang trong hình mẫu) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 scrollbar-none">
          {["Hồ sơ", "Mật khẩu", "Gói dịch vụ", "Thanh toán", "Thông báo", "Tích hợp AI", "API"].map((tab, idx) => {
            const keyMap = ["profile", "password", "plan", "billing", "notifications", "integrations", "api"];
            const currentKey = keyMap[idx] || "profile";
            const isActive = activeTab === currentKey || (idx === 0 && activeTab === "profile");
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(currentKey)}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-purple-600 text-white font-semibold shadow-sm"
                    : "hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Profile Details Form Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold">Thông Tin Định Danh Cá Nhân</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cập nhật ảnh đại diện và chi tiết thông tin hồ sơ đồng bộ thời gian thực với Firebase.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Họ và tên hiển thị</label>
              <input
                type="text"
                value={profile.displayName}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email đăng nhập</label>
              <input
                type="text"
                value={profile.email}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium font-mono text-purple-600 dark:text-purple-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Metrics: Thanh Năng Lượng AI & Lưu Trữ */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Năng Lượng AI */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-7 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Zap className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Thanh Năng Lượng AI</h3>
                  <p className="text-xs text-slate-500">Dùng chung mọi tính năng hệ sinh thái</p>
                </div>
              </div>
              <span className="text-sm font-mono font-extrabold text-purple-600 dark:text-purple-400">
                {profile.energyBalance.toLocaleString()} / {profile.maxEnergy.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div
                  className="bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${energyPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>Hạn mức khả dụng</span>
                <span>{energyPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Card Lưu Trữ & Gemini API */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-7 space-y-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Kho Tri Thức Firebase</h3>
                  <p className="text-xs text-slate-500">Tích hợp Gemini AI xử lý tài liệu</p>
                </div>
              </div>
              <span className="text-lg font-mono font-extrabold text-blue-500">{profile.storageQuotaGB} GB</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Bảo mật mã hóa dữ liệu đám mây tuyệt đối theo tiêu chuẩn doanh nghiệp.
              </p>
            </div>
          </div>
        </div>

        {/* Lịch Sử Giao Dịch & Nâng Cấp */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">Lịch Sử Giao Dịch Thanh Toán</h3>
                <p className="text-xs text-slate-500">Danh sách các gói dịch vụ đã đăng ký</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 font-mono">
              {transactions.length} đơn hàng
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              Đang đồng bộ dữ liệu giao dịch từ cơ sở dữ liệu...
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              Chưa ghi nhận lịch sử giao dịch thanh toán nào trên hệ thống.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="pb-3 pl-2">Mã Đơn Hàng</th>
                    <th className="pb-3">Gói Dịch Vụ</th>
                    <th className="pb-3">Số Tiền</th>
                    <th className="pb-3">Thời Gian</th>
                    <th className="pb-3 pr-2">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 pl-2 font-mono font-bold text-purple-600 dark:text-purple-400">{tx.orderCode}</td>
                      <td className="py-4 font-semibold">{tx.planTitle}</td>
                      <td className="py-4 font-mono font-bold">{tx.amount.toLocaleString()}đ</td>
                      <td className="py-4 text-slate-500 text-xs flex items-center gap-1.5 pt-5">
                        <Clock className="w-3.5 h-3.5" />
                        {tx.date}
                      </td>
                      <td className="py-4 pr-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Thành công
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
