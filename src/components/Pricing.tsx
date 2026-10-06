import { Check, ArrowRight, Zap } from "lucide-react";

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

const pricingData: ProductService[] = [
  {
    category: "Loại 1: Hệ Sinh Thái SinhHAI (Nâng Cấp Năng Lượng AI)",
    subtitle: "Mở khóa toàn bộ tính năng Chatbot, StudyPlace, Studio & Workflow AI",
    plans: [
      {
        id: "SH_ECO_1M",
        title: "Gói Starter (Cơ Bản)",
        price: "199.000đ",
        numericPrice: 199000,
        cycle: "/ tháng",
        description: "Phù hợp cho cá nhân mới bắt đầu khám phá hệ sinh thái AI",
        features: [
          "Hạn mức Năng Lượng AI tiêu chuẩn",
          "Truy cập Chatbot, StudyPlace, Studio",
          "Hỗ trợ các Model AI phổ thông tốc độ cao",
          "Hỗ trợ qua kênh cộng đồng 24/7",
        ],
      },
      {
        id: "SH_ECO_FULL",
        title: "Gói Pro (Chuyên Nghiệp)",
        price: "499.000đ",
        numericPrice: 499000,
        cycle: "/ tháng",
        description: "Giải pháp toàn diện với hạn mức cao cho người dùng chuyên sâu & Creator",
        features: [
          "Hạn mức Năng Lượng AI nâng cao hàng tháng",
          "Truy cập đầy đủ các Model AI mạnh nhất",
          "Tự động hóa Workflow (giới hạn định mức an toàn)",
          "Tạo ảnh & xử lý tài liệu đa phương tiện ưu tiên",
        ],
      },
      {
        id: "SH_ECO_12M",
        title: "Gói Annual (Đột Phá Năm)",
        price: "5.988.000đ",
        numericPrice: 5988000,
        cycle: "/ 12 tháng",
        description: "Tương đương 499k/tháng - Cam kết đồng hành dài hạn tiết kiệm",
        features: [
          "Toàn bộ quyền lợi đặc quyền của Gói Pro",
          "Ưu tiên trải nghiệm các tính năng AI mới nhất",
          "Tốc độ phản hồi Server ưu tiên cao nhất",
          "Hỗ trợ kỹ thuật trực tiếp 1-1 qua cổng ưu tiên",
        ],
      },
    ],
  },
  {
    category: "Loại 2: Kho Tri Thức AI & Hỗ Trợ Chuyên Sâu",
    subtitle: "Lưu trữ tài liệu thông minh tích hợp Gemini API trực tiếp & Dịch vụ kèm Giáo viên",
    plans: [
      {
        id: "SH_STORAGE_1G",
        title: "AI Storage Lite (1GB)",
        price: "29.000đ",
        numericPrice: 29000,
        cycle: "/ tháng",
        description: "Lưu trữ gọn nhẹ kèm trợ lý Gemini đọc tài liệu nhanh",
        features: [
          "Dung lượng Firebase Storage 1GB",
          "Tích hợp Gemini API phân tích trực tiếp tài liệu",
          "Hỗ trợ tóm tắt file PDF/Word cơ bản",
        ],
      },
      {
        id: "SH_STORAGE_5G",
        title: "AI Storage Plus (5GB)",
        price: "69.000đ",
        numericPrice: 69000,
        cycle: "/ tháng",
        description: "Tối ưu cho học sinh, sinh viên quản lý giáo trình thông minh",
        features: [
          "Dung lượng Firebase Storage 5GB",
          "Xử lý ngữ nghĩa chuyên sâu qua Gemini API",
          "Truy vấn dữ liệu tài liệu không giới hạn số lần",
        ],
      },
      {
        id: "SH_STORAGE_10G",
        title: "AI Vault Pro (10GB)",
        price: "129.000đ",
        numericPrice: 129000,
        cycle: "/ tháng",
        description: "Kho lưu trữ chuyên nghiệp cho tài liệu nghiên cứu lớn",
        features: [
          "Dung lượng Firebase Storage 10GB",
          "Xử lý tài liệu dung lượng lớn với Context Window cao",
          "Ưu tiên tốc độ phản hồi phân tích từ Gemini",
        ],
      },
      {
        id: "SH_STORAGE_100G",
        title: "AI Expert Vault (100GB)",
        price: "349.000đ",
        numericPrice: 349000,
        cycle: "/ tháng",
        description: "Kho tri thức quy mô lớn dành cho Chuyên gia & Nhà nghiên cứu",
        features: [
          "Dung lượng Firebase Storage 100GB",
          "Phân tích tài liệu đa định dạng khối lượng lớn",
          "Bảo mật cao & Phân quyền chia sẻ tài liệu",
        ],
      },
      {
        id: "SH_STORAGE_500G",
        title: "AI Enterprise Hub (500GB)",
        price: "999.000đ",
        numericPrice: 999000,
        cycle: "/ tháng",
        description: "Không gian lưu trữ & xử lý AI cấp độ doanh nghiệp/tổ chức",
        features: [
          "Dung lượng Firebase Storage 500GB",
          "Bảo mật doanh nghiệp & Băng thông High-speed",
          "Tích hợp sâu hệ thống xử lý AI đa luồng",
        ],
      },
      {
        id: "SH_STUDY_TEACHER",
        title: "StudyPlace + Giáo Viên 1-1",
        price: "1.499.000đ",
        numericPrice: 1499000,
        cycle: "/ tháng",
        description: "Gồm 499k Gói Pro + 1 Triệu Phụ phí Giáo viên định hướng trực tiếp",
        features: [
          "Bao gồm toàn bộ quyền lợi Gói Pro hệ sinh thái",
          "Giáo viên hỗ trợ & định hướng trực tiếp 1-1",
          "Đánh giá & chấm bài chi tiết theo tiến độ học tập",
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
          Lựa chọn gói dịch vụ nâng cấp Năng Lượng AI phù hợp để tối ưu hóa hiệu suất làm việc & học tập
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.plans.map((plan, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-xl border border-purple-200 dark:border-purple-900/50 bg-card p-6 shadow-sm hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
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
                    href={`/checkout?planId=${plan.id}&planName=${encodeURIComponent(plan.title)}&price=${plan.numericPrice}`}
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
