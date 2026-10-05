import React, { useState } from "react";
import { CreditCard, ShieldCheck, CheckCircle2, Copy, Clock, ArrowLeft } from "lucide-react";

interface PaymentPageProps {
  onBack?: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);

  // --- CẤU HÌNH THÔNG TIN CHUYỂN KHOẢN CỦA BẠN ---
  const BANK_ID = "MB"; // Ngân hàng (MB, VCB, TCB, ACB, VPB...)
  const ACCOUNT_NO = "STK_CỦA_BẠN"; // Thay số tài khoản ngân hàng của bạn vào đây
  const ACCOUNT_NAME = "TRAN THIEU LONG"; // Tên chủ tài khoản (viết hoa không dấu)
  const AMOUNT = 199000; // Số tiền sản phẩm/gói dịch vụ (VND)
  const ORDER_CODE = "SH" + Math.floor(100000 + Math.random() * 900000); // Mã đơn hàng ngẫu nhiên

  // URL VietQR tạo mã QR chuẩn Napas247 tự động điền tiền và nội dung
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${AMOUNT}&addInfo=${ORDER_CODE}&accountName=${encodeURIComponent(
    ACCOUNT_NAME
  )}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 text-slate-800 dark:text-slate-100">
      <div className="max-w-4xl mx-auto">
        {/* Nút Quay lại */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Cột Trái: Thông tin Đơn hàng & Cam kết */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" /> Tóm tắt đơn hàng
              </h2>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <p className="font-semibold text-lg">Gói SinhHAI Premium / Bản quyền</p>
                <p className="text-sm text-slate-500">Kích hoạt tài khoản ngay sau khi thanh toán</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã đơn hàng:</span>
                  <span className="font-mono font-bold text-indigo-600">{ORDER_CODE}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Giá gốc:</span>
                  <span className="line-through text-slate-400">499.000 đ</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Tổng thanh toán:</span>
                  <span className="text-indigo-600 text-xl">{AMOUNT.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>
            </div>

            {/* Khối Cam kết Uy tín */}
            <div className="bg-indigo-50/50 dark:bg-indigo-950/30 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium text-indigo-900 dark:text-indigo-300">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Bảo mật giao dịch 100% qua Napas247</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-indigo-900 dark:text-indigo-300">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Kích hoạt tự động / Hỗ trợ kỹ thuật 24/7</span>
              </div>
            </div>
          </div>

          {/* Cột Phải: Mã QR & Thông tin Chuyển khoản */}
          <div className="md:col-span-7">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 mb-4">
                <Clock className="w-3.5 h-3.5" /> Chờ quét mã thanh toán
              </span>

              <h3 className="text-lg font-bold mb-2">Mở App Ngân hàng bất kỳ để Quét QR</h3>
              <p className="text-sm text-slate-500 mb-6">Mã QR đã bao gồm số tiền và nội dung chuyển khoản chính xác</p>

              {/* Ảnh QR VietQR */}
              <div className="inline-block p-3 bg-white rounded-xl border border-slate-200 shadow-inner mb-6">
                <img src={qrUrl} alt="Mã QR Thanh Toán" className="w-64 h-64 object-contain mx-auto" />
              </div>

              {/* Chi tiết Tài khoản Chuyển thủ công */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-left space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Ngân hàng:</span>
                  <span className="font-semibold">{BANK_ID} (Military Bank)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Chủ tài khoản:</span>
                  <span className="font-semibold uppercase">{ACCOUNT_NAME}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base">{ACCOUNT_NO}</span>
                    <button
                      onClick={() => copyToClipboard(ACCOUNT_NO)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition"
                      title="Sao chép"
                    >
                      <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Nội dung chuyển khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600">{ORDER_CODE}</span>
                    <button
                      onClick={() => copyToClipboard(ORDER_CODE)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition"
                      title="Sao chép"
                    >
                      <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>
                </div>
              </div>

              {copied && <p className="text-xs text-emerald-600 font-medium mt-3">✓ Đã sao chép vào bộ nhớ tạm!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
