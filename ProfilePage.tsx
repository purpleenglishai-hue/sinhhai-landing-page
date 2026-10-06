import React, { useEffect, useState } from "react";
import { User, Zap, HardDrive, CreditCard, Clock, CheckCircle2 } from "lucide-react";

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

export const UserProfilePage = () => {
  // Demo State (Thực tế sẽ fetch từ Firebase Firestore theo Auth CurrentUser)
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "Thành Viên SinhHAI",
    email: "user@sinhhai.com",
    energyBalance: 320000,
    maxEnergy: 550000,
    planName: "Gói Full Tính Năng",
    storageQuotaGB: 5,
  });

  const [transactions, setTransactions] = useState<TransactionHistory[]>([
    {
      id: "tx_01",
      orderCode: "SH839120",
      planTitle: "Gói Full Tính Năng",
      amount: 499000,
      date: "06/10/2026 14:30",
      status: "SUCCESS",
    },
  ]);

  const energyPercentage = Math.min(100, (profile.energyBalance / profile.maxEnergy) * 100);

  return (
    <div className="container max-w-5xl py-10 space-y-8">
      {/* Header Profile */}
      <div className="flex items-center gap-4 p-6 bg-card border border-purple-500/20 rounded-2xl shadow-sm">
        <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500 flex items-center justify-center text-purple-500">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{profile.displayName}</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-semibold rounded-full border border-purple-500/30">
            {profile.planName}
          </span>
        </div>
      </div>

      {/* Chỉ số Năng lượng & Dung lượng */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card Thanh Năng Lượng AI */}
        <div className="p-6 bg-card border border-purple-500/20 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-bold text-lg text-purple-400">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              Thanh Năng Lượng AI
            </span>
            <span className="text-sm font-mono font-bold">
              {profile.energyBalance.toLocaleString()} / {profile.maxEnergy.toLocaleString()}
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${energyPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Năng Lượng AI dùng chung cho toàn bộ ứng dụng Chatbot, StudyPlace, Studio & Workflow.
          </p>
        </div>

        {/* Card Thuê bao Lưu trữ */}
        <div className="p-6 bg-card border border-purple-500/20 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-bold text-lg text-blue-400">
              <HardDrive className="w-5 h-5 text-blue-500" />
              Lưu Trữ Firebase Storage
            </span>
            <span className="text-sm font-mono font-bold">{profile.storageQuotaGB} GB</span>
          </div>
          <p className="text-xs text-muted-foreground pt-4">
            Dung lượng tài liệu AI hỗ trợ đọc, tóm tắt và phân tích chuyên sâu.
          </p>
        </div>
      </div>

      {/* Lịch sử Thanh toán */}
      <div className="p-6 bg-card border border-purple-500/20 rounded-2xl space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-500" />
          Lịch Sử Thanh Toán & Nâng Cấp
        </h3>

        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có giao dịch nào được ghi nhận.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-purple-500/20 text-muted-foreground">
                <tr>
                  <th className="pb-3">Mã Đơn</th>
                  <th className="pb-3">Gói Nâng Cấp</th>
                  <th className="pb-3">Số Tiền</th>
                  <th className="pb-3">Thời Gian</th>
                  <th className="pb-3">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-purple-500/5">
                    <td className="py-4 font-mono font-bold text-purple-400">{tx.orderCode}</td>
                    <td className="py-4 font-medium">{tx.planTitle}</td>
                    <td className="py-4 font-bold">{tx.amount.toLocaleString()}đ</td>
                    <td className="py-4 text-muted-foreground flex items-center gap-1">
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
  );
};
