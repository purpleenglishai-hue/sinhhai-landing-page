import { useEffect, useState } from "react";
import { 
  User, Zap, HardDrive, CreditCard, Clock, CheckCircle2, 
  ShieldCheck, Sparkles, Key, Users, FileText, Bell, 
  Globe, Code, Save, Loader2, AlertCircle, ArrowUpRight 
} from "lucide-react";

// Kết nối Firebase từ cấu trúc dự án
import { auth, db } from "./src/firebase";
import { onAuthStateChanged, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, onSnapshot, updateDoc, collection, query, where, orderBy } from "firebase/firestore";

interface UserProfile {
  displayName: string;
  email: string;
  energyBalance: number;
  maxEnergy: number;
  planName: string;
  storageQuotaGB: number;
  website?: string;
  bio?: string;
  jobTitle?: string;
  altEmail?: string;
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
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    displayName: "Thành Viên SinhHAI",
    email: "Đang tải...",
    energyBalance: 0,
    maxEnergy: 550000,
    planName: "Gói Trải Nghiệm",
    storageQuotaGB: 5,
    website: "https://sinhhai.com",
    bio: "Chuyên gia phát triển ứng dụng AI & Hệ sinh thái số thông minh.",
    jobTitle: "AI Solution Architect",
    altEmail: "",
  });

  // State cho phần đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setProfile((prev) => ({
          ...prev,
          displayName: currentUser.displayName || currentUser.email?.split("@")[0] || "Thành Viên SinhHAI",
          email: currentUser.email || "",
        }));

        // Lắng nghe dữ liệu profile từ Firestore collection 'users'
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setProfile((prev) => ({
              ...prev,
              displayName: data.displayName ?? prev.displayName,
              energyBalance: data.energyBalance ?? prev.energyBalance,
              maxEnergy: data.maxEnergy ?? prev.maxEnergy,
              planName: data.planName ?? prev.planName,
              storageQuotaGB: data.storageQuotaGB ?? prev.storageQuotaGB,
              website: data.website ?? prev.website,
              bio: data.bio ?? prev.bio,
              jobTitle: data.jobTitle ?? prev.jobTitle,
              altEmail: data.altEmail ?? prev.altEmail,
            }));
          }
        });

        // Lắng nghe lịch sử giao dịch
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
            console.warn("Lỗi tải giao dịch:", error);
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

  // Hàm lưu thông tin Profile lên Firebase
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Chưa đăng nhập hệ thống.");

      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        displayName: profile.displayName,
        website: profile.website,
        bio: profile.bio,
        jobTitle: profile.jobTitle,
        altEmail: profile.altEmail,
      });

      setMessage({ text: "Cập nhật hồ sơ thành công!", type: "success" });
    } catch (error: any) {
      setMessage({ text: `Lỗi cập nhật: ${error.message}`, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Hàm đổi mật khẩu bảo mật
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Mật khẩu mới không khớp nhau.", type: "error" });
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) throw new Error("Phiên đăng nhập hết hạn.");

      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      setMessage({ text: "Đổi mật khẩu thành công!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage({ text: `Lỗi đổi mật khẩu (Sai mật khẩu cũ?): ${error.message}`, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const energyPercentage = profile.maxEnergy > 0 
    ? Math.min(100, Math.max(0, (profile.energyBalance / profile.maxEnergy) * 100))
    : 0;

  const storageUsedGB = Math.min(profile.storageQuotaGB, 4.2); // Demo mô phỏng dung lượng đang dùng
  const storagePercentage = (storageUsedGB / profile.storageQuotaGB) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      
      {/* SIDEBAR TÍM ĐẶC TRƯNG GIỐNG ẢNH MẪU */}
      <aside className="w-full md:w-72 bg-purple-950 text-purple-100 flex flex-col justify-between p-6 border-r border-purple-900/50">
        <div className="space-y-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight text-white">SinhHAI Dashboard</h2>
              <p className="text-xs text-purple-300">Hệ Sinh Thái AI Toàn Diện</p>
            </div>
          </div>

          {/* Menu Điều Hướng */}
          <nav className="space-y-1.5 pt-4">
            <a href="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-900/60 transition-colors">
              <Globe className="w-4 h-4 text-purple-300" />
              <span>Trang Chủ Hệ Thống</span>
            </a>
            <a href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-900/65 transition-colors">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Năng Lượng AI</span>
            </a>
            <a href="/#pricing" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-900/60 transition-colors">
              <CreditCard className="w-4 h-4 text-purple-300" />
              <span>Nâng Cấp Gói Cước</span>
            </a>
          </nav>
        </div>

        {/* Widget Used Space ở Sidebar (Giống mẫu) */}
        <div className="mt-8 pt-6 border-t border-purple-900/80 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-purple-200">
              <span>Đã dùng {storageUsedGB}GB / {profile.storageQuotaGB}GB</span>
              <span>{storagePercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-purple-900/90 rounded-full h-2.5 overflow-hidden p-0.5 border border-purple-800">
              <div 
                className="bg-gradient-to-r from-purple-400 to-indigo-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-purple-300/80 leading-relaxed">
            Hạn mức lưu trữ Firebase Storage & phân tích AI tích hợp. Cần thêm dung lượng?
          </p>
          <a
            href="/#pricing"
            className="inline-block text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 px-3 py-1.5 rounded-lg transition-colors shadow-md"
          >
            Nâng cấp ngay &rarr;
          </a>

          {/* User Profile Mini Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-900/80">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                {profile.displayName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{profile.displayName}</p>
                <p className="text-[11px] text-purple-300 truncate">{profile.email}</p>
              </div>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="text-purple-300 hover:text-white transition-colors p-1"
              title="Đăng xuất"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-card/50">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Tiêu Đề Settings */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Cài Đặt Tài Khoản</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Quản lý thông tin cá nhân, bảo mật hồ sơ và tùy chỉnh cấu hình hệ thống
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-500/15 text-purple-500 text-xs font-bold rounded-full border border-purple-500/30">
                {profile.planName}
              </span>
            </div>
          </div>

          {/* Tab Navigation Giống Mẫu */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border text-sm font-medium pb-3">
            {[
              { id: "profile", label: "Hồ Sơ (Profile)" },
              { id: "security", label: "Bảo Mật & Mật Khẩu" },
              { id: "billing", label: "Gói Cước & Giao Dịch" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* THÔNG BÁO TRẠNG THÁI */}
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
              message.type === "success" 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}>
              {message.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* TAB 1: PROFILE / HỒ SƠ */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6 bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <div>
                <h3 className="text-xl font-bold">Thông Tin Hồ Sơ</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Cập nhật ảnh đại diện và chi tiết thông tin cá nhân hiển thị công khai.</p>
              </div>

              <hr className="border-border/60" />

              <div className="grid md:grid-cols-3 gap-6 items-center">
                <label className="text-sm font-semibold text-muted-foreground">Tên hiển thị (Username)</label>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/55 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 items-center">
                <label className="text-sm font-semibold text-muted-foreground">Website cá nhân / Dự án</label>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={profile.website || ""}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://"
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/55 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 items-start">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Ảnh Đại Diện</label>
                  <p className="text-[11px] text-muted-foreground mt-1">Ảnh đại diện bảo mật từ tài khoản Firebase Auth.</p>
                </div>
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-md flex-shrink-0">
                    <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center text-purple-400 font-bold text-xl">
                      {profile.displayName.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-purple-500">{profile.email}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Đã xác thực bảo mật Firebase.</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 items-start">
                <label className="text-sm font-semibold text-muted-foreground pt-2">Tiểu sử (Bio)</label>
                <div className="md:col-span-2">
                  <textarea
                    rows={3}
                    value={profile.bio || ""}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Viết một đoạn ngắn giới thiệu bản thân..."
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/55 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 items-center">
                <label className="text-sm font-semibold text-muted-foreground">Chức danh / Nghề nghiệp</label>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={profile.jobTitle || ""}
                    onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                    placeholder="Ví dụ: Software Developer / Creator"
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/55 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 items-center">
                <label className="text-sm font-semibold text-muted-foreground">Email phụ liên hệ</label>
                <div className="md:col-span-2">
                  <input
                    type="email"
                    value={profile.altEmail || ""}
                    onChange={(e) => setProfile({ ...profile, altEmail: e.target.value })}
                    placeholder="example@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/55 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <hr className="border-border/60" />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: BẢO MẬT & ĐỔI MẬT KHẨU */}
          {activeTab === "security" && (
            <form onSubmit={handleChangePassword} className="space-y-6 bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <div>
                <h3 className="text-xl font-bold">Bảo Mật & Mật Khẩu Tài Khoản</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Đổi mật khẩu định kỳ để bảo vệ tài khoản khỏi các truy cập trái phép.</p>
              </div>

              <hr className="border-border/60" />

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/55 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/55 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/55 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <hr className="border-border/60" />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Cập Nhật Mật Khẩu</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: GÓI CƯỚC & LỊCH SỬ GIAO DỊCH */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Năng lượng AI */}
                <div className="p-6 bg-card border border-border/80 rounded-3xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold text-base text-amber-500">
                      <Zap className="w-5 h-5 fill-amber-500" />
                      Năng Lượng AI Hiện Tại
                    </span>
                    <span className="font-mono font-extrabold text-sm">
                      {profile.energyBalance.toLocaleString()} / {profile.maxEnergy.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3 overflow-hidden p-0.5 border border-border">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${energyPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sử dụng cho Chatbot, StudyPlace, Studio và các tác vụ tự động hóa Workflow AI.
                  </p>
                </div>

                {/* Quản lý Gói */}
                <div className="p-6 bg-card border border-border/80 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base">Gói Thuê Bao Đang Dùng</span>
                    <span className="px-3 py-1 bg-purple-500/15 text-purple-500 text-xs font-bold rounded-full border border-purple-500/30">
                      {profile.planName}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bạn muốn mở rộng hạn mức và tính năng cao cấp hơn? Khám phá ngay bảng giá hệ sinh thái.
                  </p>
                  <a
                    href="/#pricing"
                    className="inline-flex items-center justify-center gap-2 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl text-xs transition-colors shadow-sm"
                  >
                    <span>Nâng Cấp Gói Dịch Vụ</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Lịch sử đơn hàng */}
              <div className="p-6 md:p-8 bg-card border border-border/80 rounded-3xl space-y-6 shadow-sm">
                <h3 className="text-lg font-bold">Lịch Sử Giao Dịch Nâng Cấp</h3>

                {loading ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Đang tải lịch sử giao dịch...</p>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-2xl">
                    Chưa có lịch sử giao dịch nào được ghi nhận.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-border text-muted-foreground text-[11px] font-bold uppercase">
                        <tr>
                          <th className="pb-3">Mã Đơn</th>
                          <th className="pb-3">Gói Dịch Vụ</th>
                          <th className="pb-3">Số Tiền</th>
                          <th className="pb-3">Thời Gian</th>
                          <th className="pb-3">Trạng Thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-secondary/40 transition-colors">
                            <td className="py-4 font-mono font-bold text-purple-500">{tx.orderCode}</td>
                            <td className="py-4 font-medium">{tx.planTitle}</td>
                            <td className="py-4 font-mono font-bold">{tx.amount.toLocaleString()}đ</td>
                            <td className="py-4 text-muted-foreground text-xs flex items-center gap-1.5 pt-5">
                              <Clock className="w-3.5 h-3.5" />
                              {tx.date}
                            </td>
                            <td className="py-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" />
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
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
