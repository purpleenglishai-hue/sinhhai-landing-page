import { useEffect, useState } from "react";
import { User, Zap, HardDrive, CreditCard, Clock, CheckCircle2, ShieldCheck, Sparkles, AlertCircle, ArrowUpRight } from "lucide-react";

// Sửa đường dẫn import firebase từ ./src/firebase để khớp với cấu trúc thư mục
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

  return (
    <div className="container max-w-5xl py-12 space-y-8 min-h-[80vh]">
      {/* Tiêu đề trang */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-purple-500 fill-purple-500/20" />
            Tài Khoản & Hệ Sinh Thái AI
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Quản lý thông tin định danh, hạn mức năng lượng AI và lịch sử dịch vụ cá nhân
          </p>
        </div>
        <a
          href="/#pricing"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200"
        >
          <span>Nâng Cấp Gói Dịch Vụ</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* Header Profile Card */}
      <div className="relative overflow-hidden p-6 md:p-8 bg-gradient-to-br from-card via-card to-purple-950/20 border border-purple-500/20 rounded-3xl shadow-xl shadow-purple-500/5">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-md shadow-purple-500/30 flex-shrink-0">
              <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center text-purple-400">
                <User className="w-9 h-9" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center text-white" title="Tài khoản hoạt động">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">{profile.displayName}</h2>
              <span className="px-3 py-1 bg-purple-500/15 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30 tracking-wide uppercase shadow-sm">
                {profile.planName}
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-mono">{profile.email}</p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Trạng thái hệ thống: Hoạt động bình thường & Bảo mật tuyệt đối
            </div>
          </div>
        </div>
      </div>

      {/* Chỉ số Năng lượng & Dung lượng */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card Thanh Năng Lượng AI */}
        <div className="p-6 md:p-7 bg-card border border-purple-500/20 rounded-3xl space-y-5 shadow-sm hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Zap className="w-5 h-5 fill-amber-500" />
              </div>
              <span className="font-bold text-base tracking-tight">Thanh Năng Lượng AI</span>
            </div>
            <div className="text-right">
              <span className="text-base font-mono font-extrabold text-purple-400">
                {profile.energyBalance.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground font-mono"> / {profile.maxEnergy.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-secondary/80 rounded-full h-3.5 overflow-hidden p-0.5 border border-border">
              <div
                className="bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${energyPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>Đã dùng: {energyPercentage.toFixed(1)}%</span>
              <span>Làm mới mỗi kỳ thanh toán</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/50">
            Năng lượng cốt lõi dùng chung cho toàn bộ hệ thống Chatbot, StudyPlace, Studio & Workflow tự động hóa.
          </p>
        </div>

        {/* Card Thuê bao Lưu trữ & Tri Thức */}
        <div className="p-6 md:p-7 bg-card border border-purple-500/20 rounded-3xl space-y-5 shadow-sm hover:border-purple-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <HardDrive className="w-5 h-5" />
              </div>
              <span className="font-bold text-base tracking-tight">Kho Tri Thức & Lưu Trữ</span>
            </div>
            <span className="text-lg font-mono font-extrabold text-blue-400">{profile.storageQuotaGB} GB</span>
          </div>

          <div className="bg-secondary/40 rounded-2xl p-4 border border-border/50 space-y-1">
            <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              Tích hợp Gemini API Đọc & Phân Tích File Trực Tiếp
            </div>
            <p className="text-xs text-muted-foreground">
              Hỗ trợ xử lý tài liệu PDF, Docx, Code dung lượng cao an toàn trên nền tảng đám mây Firebase Storage.
            </p>
          </div>

          <div className="text-xs text-muted-foreground pt-1 border-t border-border/50">
            Dung lượng lưu trữ và băng thông cao tốc được tối ưu riêng biệt cho tài khoản chuyên nghiệp.
          </div>
        </div>
      </div>

      {/* Lịch sử Thanh toán */}
      <div className="p-6 md:p-8 bg-card border border-purple-500/20 rounded-3xl space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold tracking-tight">Lịch Sử Giao Dịch & Đơn Hàng</h3>
          </div>
          <span className="text-xs font-medium px-3 py-1 bg-secondary rounded-full text-muted-foreground">
            {transactions.length} giao dịch
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            Đang tải dữ liệu giao dịch từ hệ thống...
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-muted-foreground/50" />
            <span>Chưa có giao dịch thanh toán nào được ghi nhận trên hệ thống.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-purple-500/20 text-muted-foreground uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="pb-3.5 pl-2">Mã Đơn Hàng</th>
                  <th className="pb-3.5">Gói Dịch Vụ</th>
                  <th className="pb-3.5">Số Tiền</th>
                  <th className="pb-3.5">Thời Gian</th>
                  <th className="pb-3.5 pr-2">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-purple-500/5 transition-colors group">
                    <td className="py-4 pl-2 font-mono font-bold text-purple-400">{tx.orderCode}</td>
                    <td className="py-4 font-semibold text-foreground">{tx.planTitle}</td>
                    <td className="py-4 font-mono font-bold text-foreground">{tx.amount.toLocaleString()}đ</td>
                    <td className="py-4 text-muted-foreground text-xs flex items-center gap-1.5 pt-5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                      {tx.date}
                    </td>
                    <td className="py-4 pr-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
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
    </div>
  );
};
