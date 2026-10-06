import { Check, ArrowRight, HardDrive, GraduationCap, Zap } from "lucide-react";

interface PricingPlan {
  id: string;
  title: string;
  price: string;
  numericPrice: number;
  cycle: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface ProductService {
  category: string;
  subtitle: string;
  plans: PricingPlan[];
}

const pricingData: ProductService[] = [
  {
    category: "Gói Năng Lượng Hệ Sinh Thái SinhHAI",
    subtitle: "Truy cập toàn bộ Chatbot, Studio Tạo Ảnh, Workflow & StudyPlace",
    plans: [
      {
        id: "SH_ECO_TRY",
        title: "Gói Trải Nghiệm",
        price: "199.000đ",
        numericPrice: 199000,
        cycle: "/ tháng",
        description: "Dành cho cá nhân bắt đầu khám phá hệ sinh thái AI",
        features: [
          "Cấp Hạn Mức AI cơ bản hàng tháng",
          "Giới hạn một số Workflow & Model cao cấp",
          "Truy cập Chatbot, Studio & StudyPlace",
          "Hỗ trợ kỹ thuật qua Community",
        ],
      },
      {
        id: "SH_ECO_FULL",
        title: "Gói Full Tính Năng",
        price: "499.000đ",
        numericPrice: 499000,
        cycle: "/ tháng",
        description: "Mở khóa toàn bộ sức mạnh AI không giới hạn tính năng",
        popular: true,
        features: [
          "Cấp Hạn Mức AI tiêu chuẩn cao",
          "Mở khóa 100% tính năng trong Hệ sinh thái",
          "Sử dụng toàn bộ các Model AI đỉnh cao",
          "Ưu tiên tốc độ xử lý Rendering & Workflow",
          "Hỗ trợ ưu tiên 24/7",
        ],
      },
      {
        id: "SH_ECO_YEAR",
        title: "Gói Năm Đột Phá",
        price: "5.988.000đ",
        numericPrice: 5988000,
        cycle: "/ 12 tháng",
        description: "499.000đ x 12 tháng - Ưu tiên đặc quyền cao nhất",
        features: [
          "Tất cả quyền lợi của Gói Full Tính Năng",
          "Ưu tiên trải nghiệm sớm các tính năng AI mới",
          "Hạn Mức AI tích lũy cả năm",
          "Hỗ trợ 1-1 tối ưu quy trình công việc",
        ],
      },
    ],
  },
  {
    category: "Dịch Vụ Lưu Trữ & Giáo Dục Chuyên Sâu",
    subtitle: "Thuê bao mở rộng dung lượng Firebase Storage & Đồng hành 1-1",
    plans: [
      {
        id: "SH_STORAGE_FLEX",
        title: "Thuê Bao Lưu Trữ AI",
        price: "Từ 49.000đ",
        numericPrice: 49000,
        cycle: "/ tháng",
        description: "Mở rộng bộ nhớ Cloud cho tài liệu & hồ sơ AI",
        features: [
          "Tùy chọn dung lượng: 1GB | 5GB | 10GB | 100GB | 500GB",
          "Lưu trữ hồ sơ tài liệu bảo mật trên Firebase Storage",
          "AI đọc và phân tích tài liệu dung lượng lớn",
          "Đồng bộ thời gian thực trên mọi thiết bị",
        ],
      },
      {
        id: "SH_STUDY_TEACHER",
        title: "StudyPlace + Giáo Viên",
        price: "1.499.000đ",
        numericPrice: 1499000,
        cycle: "/ tháng",
        description: "499k Thuê bao tháng + 1tr Phụ phí Giáo viên đồng hành",
        popular: true,
        features: [
          "Toàn bộ tính năng SinhHAI-StudyPlace",
          "Giáo viên đồng hành & kèm 1-1 trực tiếp",
          "Thiết kế lộ trình học tập & nghiên cứu riêng",
          "Đánh giá & sửa bài chi tiết hàng tuần",
        ],
      },
    ],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="container py-16 sm:py-24 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Bảng Giá Dịch Vụ <span className="text-purple-600 dark:text-purple-400">SinhHAI</span>
        </h2>
        <p className="text-xl text-muted-foreground pt-2">
          Lựa chọn gói hạn mức và dịch vụ phù hợp để tối ưu hóa hiệu suất làm việc của bạn
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

          <div
            className={`grid gap-6 ${
              service.plans.length === 2
                ? "md:grid-cols-2 max-w-4xl mx-auto"
                : "md:grid-cols-3"
            }`}
          >
            {service.plans.map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col justify-between rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${
                  plan.popular
                    ? "border-purple-600 dark:border-purple-500 bg-card shadow-purple-500/10 ring-2 ring-purple-600/20"
                    : "border-purple-200 dark:border-purple-900/50 bg-card hover:border-purple-500"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Khuyên Dùng
                  </span>
                )}

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
                  <a
                    href={`/checkout?plan=${encodeURIComponent(`${service.category} -${plan.title}`)}&price=${plan.numericPrice}`}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md shadow-purple-500/20 transition-colors flex items-center justify-center gap-2 text-center"
                  >
                    <span>Đăng Ký Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
