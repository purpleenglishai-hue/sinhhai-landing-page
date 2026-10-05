import { useState } from "react";
import { Check, X, Copy, CheckCircle2, QrCode } from "lucide-react";
import { auth } from "../firebase";

interface PricingPlan {
  id: string;
  title: string;
  price: string;
  numericPrice: number;
  cycle: string;
  description: string;
  features: string[];
}

interface ProductService {
  category: string;
  subtitle: string;
  plans: PricingPlan[];
}

// Cấu hình Thông tin Ngân Hàng Cá Nhân của Anh Long
const BANK_CONFIG = {
  bankId: "MB", // Ngân hàng MBBank (hoặc VCB, TCB, ACB...)
  accountNo: "090123456789", // <-- SỬA THÀNH SỐ TÀI KHOẢN CỦA ANH
  accountName: "TRAN THIEU LONG", // <-- SỬA THÀNH TÊN CỦA ANH KHÔNG DẤU
};

const pricingData: ProductService[] = [
  {
    category: "sinhHAI",
    subtitle: "Trợ lý Chatbot AI đa năng thông minh",
    plans: [
      {
        id: "SH_BOT_M",
        title: "Gói Tháng",
        price: "199.000đ",
        numericPrice: 199000,
        cycle: "/ tháng",
        description: "Dành cho cá nhân trải nghiệm linh hoạt",
        features: ["Truy cập Chatbot AI full tính năng", "Tốc độ phản hồi ưu tiên", "Hỗ trợ 24/7"],
      },
      {
        id: "SH_BOT_Q",
        title: "Gói Quý",
        price: "499.000đ",
        numericPrice: 499000,
        cycle: "/ 3 tháng",
        description: "Tiết kiệm 15% chi phí cho công việc",
        features: ["Tất cả tính năng gói Tháng", "Lưu trữ lịch sử chat không giới hạn", "Tối ưu câu lệnh Prompt"],
      },
      {
        id: "SH_BOT_Y",
        title: "Gói Năm",
        price: "1.490.000đ",
        numericPrice: 1490000,
        cycle: "/ năm",
        description: "Giải pháp toàn diện tiết kiệm tối đa",
        features: ["Tất cả quyền lợi nâng cao", "Cập nhật mô hình AI mới nhất", "Hỗ trợ 1-1 chuyên sâu"],
      },
    ],
  },
  {
    category: "sinhhai-studyplace",
    subtitle: "Không gian học tập & làm việc tích hợp hồ sơ lưu trữ AI",
    plans: [
      {
        id: "SH_STUDY_M",
        title: "Gói Tháng",
        price: "249.000đ",
        numericPrice: 249000,
        cycle: "/ tháng",
        description: "Không gian ghi chú & quản lý tài liệu AI",
        features: ["Bộ nhớ lưu trữ AI 50GB", "Tự động tóm tắt tài liệu", "Quản lý tiến độ học tập"],
      },
      {
        id: "SH_STUDY_Q",
        title: "Gói Quý",
        price: "649.000đ",
        numericPrice: 649000,
        cycle: "/ 3 tháng",
        description: "Dành cho học sinh, sinh viên & tác giả",
        features: ["Bộ nhớ lưu trữ AI 200GB", "Phân tích hồ sơ chuyên sâu", "Chia sẻ workspace học tập"],
      },
      {
        id: "SH_STUDY_Y",
        title: "Gói Năm",
        price: "1.990.000đ",
        numericPrice: 1990000,
        cycle: "/ năm",
        description: "Tối ưu hóa toàn bộ kho tri thức cá nhân",
        features: ["Không giới hạn dung lượng lưu trữ", "Tìm kiếm tri thức Semantic AI", "Hỗ trợ backup dữ liệu"],
      },
    ],
  },
  {
    category: "sinhhai-studio",
    subtitle: "Công cụ sáng tạo & thiết kế hình ảnh AI khổ lớn",
    plans: [
      {
        id: "SH_STUDIO_M",
        title: "Gói Tháng",
        price: "349.000đ",
        numericPrice: 349000,
        cycle: "/ tháng",
        description: "Tạo ảnh AI sắc nét xuất bản phẩm",
        features: ["Tạo 500 hình ảnh AI khổ lớn/tháng", "Độ phân giải 300 DPI chuẩn in", "Xuất file không dán logo"],
      },
      {
        id: "SH_STUDIO_Q",
        title: "Gói Quý",
        price: "899.000đ",
        numericPrice: 899000,
        cycle: "/ 3 tháng",
        description: "Dành cho Designer & Nhà sáng tạo nội dung",
        features: ["Tạo 1.800 hình ảnh AI/quý", "Tỷ lệ A4 / 2:3 chuyên nghiệp", "Công cụ chỉnh sửa nâng cao"],
      },
      {
        id: "SH_STUDIO_Y",
        title: "Gói Năm",
        price: "2.890.000đ",
        numericPrice: 2890000,
        cycle: "/ năm",
        description: "Sản xuất tài sản số & sản phẩm commercial",
        features: ["Không giới hạn tạo ảnh AI", "Bản quyền thương mại đầy đủ", "Ưu tiên Rendering tốc độ cao"],
      },
    ],
  },
  {
    category: "workflow automatic AI",
    subtitle: "Hệ thống tự động hóa quy trình làm việc AI thông minh",
    plans: [
      {
        id: "SH_WORKFLOW_M",
        title: "Gói Tháng",
        price: "499.000đ",
        numericPrice: 499000,
        cycle: "/ tháng",
        description: "Tự động hóa các tác vụ lặp đi lặp lại",
        features: ["Chạy 1.000 Workflow/tháng", "Tích hợp đa nền tảng API", "Giao diện kéo thả trực quan"],
      },
      {
        id: "SH_WORKFLOW_Q",
        title: "Gói Quý",
        price: "1.290.000đ",
        numericPrice: 1290000,
        cycle: "/ 3 tháng",
        description: "Tăng 500% năng suất làm việc nhóm",
        features: ["Chạy 3.500 Workflow/quý", "Cấu hình Automation phức tạp", "Báo cáo hiệu suất tự động"],
      },
      {
        id: "SH_WORKFLOW_Y",
        title: "Gói Năm",
        price: "3.990.000đ",
        numericPrice: 3990000,
        cycle: "/ năm",
        description: "Hệ thống tự vận hành 24/7 tối ưu",
        features: ["Không giới hạn Lượt chạy Workflow", "Xử lý dữ liệu song song", "Hỗ trợ tích hợp Custom Node"],
      },
    ],
  },
];

export const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const currentUser = auth.currentUser;

  const handleOpenPayment = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsSuccess(false);
  };

  const handleClosePayment = () => {
    setSelectedPlan(null);
    setIsSuccess(false);
  };

  const copyTransferContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getQrUrl = (plan: PricingPlan) => {
    const userIdentifier = currentUser?.email ? currentUser.email.split("@")[0] : "KHACH";
    const memo = `SINHHAI ${plan.id} ${userIdentifier}`.toUpperCase();
    return `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-compact2.png?amount=${plan.numericPrice}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;
  };

  const getTransferMemo = (plan: PricingPlan) => {
    const userIdentifier = currentUser?.email ? currentUser.email.split("@")[0] : "KHACH";
    return `SINHHAI ${plan.id} ${userIdentifier}`.toUpperCase();
  };

  return (
    <section id="pricing" className="container py-16 sm:py-24 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Bảng Giá Dịch Vụ <span className="text-purple-600 dark:text-purple-400">SinhHAI</span>
        </h2>
        <p className="text-xl text-muted-foreground pt-2">
          Lựa chọn gói thuê bao phù hợp để bứt phá hiệu suất công việc của bạn
        </p>
      </div>

      {pricingData.map((service, index) => (
        <div key={index} className="space-y-6">
          <div className="border-l-4 border-purple-600 pl-4 py-1">
            <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {service.category}
            </h3>
            <p className="text-sm text-muted-foreground">{service.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {service.plans.map((plan, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-xl border border-purple-200 dark:border-purple-900/50 bg-card p-6 shadow-sm hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {plan.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.cycle}</span>
                  </div>

                  <hr className="border-purple-100 dark:border-purple-900/40 my-4" />

                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-auto">
                  <button
                    onClick={() => handleOpenPayment(plan)}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md shadow-purple-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    Đăng Ký Ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* MODAL THANH TOÁN QR BANK CÁ NHÂN */}
      {selectedPlan && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={handleClosePayment}
        >
          <div 
            className="relative w-full max-w-lg my-auto rounded-xl bg-background p-6 shadow-2xl border border-purple-500/30 dark:border-purple-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClosePayment}
              className="absolute right-4 top-4 p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSuccess ? (
              <div className="space-y-4 text-center">
                <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  Thanh Toán Dịch Vụ SinhHAI
                </h3>
                <p className="text-sm text-muted-foreground">
                  Gói chọn: <span className="font-bold text-foreground">{selectedPlan.title}</span> ({selectedPlan.price})
                </p>

                <div className="flex justify-center my-3">
                  <div className="p-3 bg-white rounded-xl shadow-md border border-purple-200">
                    <img
                      src={getQrUrl(selectedPlan)}
                      alt="VietQR Payment"
                      className="w-56 h-56 object-contain mx-auto"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left bg-purple-50 dark:bg-purple-950/40 p-4 rounded-lg text-sm border border-purple-200 dark:border-purple-900">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngân hàng:</span>
                    <span className="font-bold">{BANK_CONFIG.bankId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số tài khoản:</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{BANK_CONFIG.accountNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chủ tài khoản:</span>
                    <span className="font-bold">{BANK_CONFIG.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-purple-200 dark:border-purple-800">
                    <span className="text-muted-foreground">Nội dung CK:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                        {getTransferMemo(selectedPlan)}
                      </span>
                      <button
                        onClick={() => copyTransferContent(getTransferMemo(selectedPlan))}
                        className="p-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded transition-colors"
                        title="Sao chép"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-purple-600" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsSuccess(true)}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-md transition-colors"
                >
                  Xác Nhận Đã Chuyển Khoản
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  Gửi Yêu Cầu Thành Công!
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">
                  Hệ thống đang xác nhận giao dịch. Tài khoản sẽ được kích hoạt / cộng Token trong vòng <span className="font-bold text-foreground">3 - 5 phút</span>.
                </p>
                <button
                  onClick={handleClosePayment}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md transition-colors"
                >
                  Hoàn Tất & Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
