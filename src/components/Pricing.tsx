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
    category: "Loại 1: Hệ Sinh Thái SinhHAI (Nâng Cấp Thanh Năng Lượng AI)",
    subtitle: "Mở khóa toàn bộ tính năng Chatbot, StudyPlace, Studio & Workflow AI",
    plans: [
      {
        id: "SH_ECO_1M",
        title: "Gói Trải Nghiệm",
        price: "199.000đ",
        numericPrice: 199000,
        cycle: "/ tháng",
        description: "Phù hợp cho cá nhân mới bắt đầu khám phá hệ sinh thái AI",
        features: [
          "Giới hạn một số tính năng nâng cao",
          "Truy cập Chatbot, StudyPlace, Studio",
          "Cấp Năng Lượng AI tiêu chuẩn",
          "Hỗ trợ qua kênh cộng đồng 24/7",
        ],
      },
      {
        id: "SH_ECO_FULL",
        title: "Gói Full Tính Năng",
        price: "499.000đ",
        numericPrice: 499000,
        cycle: "/ tháng",
        description: "Giải pháp toàn diện cho người dùng chuyên nghiệp & Creator",
        features: [
          "Full 100% tính năng trong hệ sinh thái",
          "Truy cập tất cả các Model AI mạnh nhất",
          "Tự động hóa Workflow không giới hạn",
          "Cấp Thanh Năng Lượng AI dồi dào hàng tháng",
        ],
      },
      {
        id: "SH_ECO_12M",
        title: "Gói Năm Đột Phá",
        price: "5.988.000đ",
        numericPrice: 5988000,
        cycle: "/ 12 tháng",
        description: "Tương đương 499k/tháng - Cam kết đồng hành dài hạn",
        features: [
          "Tất cả quyền lợi Gói Full Tính Năng",
          "Ưu tiên trải nghiệm các tính năng mới cập nhật",
          "Tốc độ phản hồi Server ưu tiên cao nhất",
          "Hỗ trợ kỹ thuật 1-1 trực tiếp",
        ],
      },
    ],
  },
  {
    category: "Loại 2: Thuê Bao Lưu Trữ Firebase Storage & Giáo Viên",
    subtitle: "Dung lượng lưu trữ tài liệu AI & Dịch vụ hỗ trợ học tập kèm Giáo viên",
    plans: [
      {
        id: "SH_STORAGE_1G",
        title: "Lưu Trữ 1GB",
        price: "19.000đ",
        numericPrice: 19000,
        cycle: "/ tháng",
        description: "Dành cho nhu cầu lưu trữ tài liệu nhỏ gọn",
        features: [
          "Dung lượng Firebase Storage 1GB",
          "Tích hợp AI đọc & phân tích tóm tắt file",
          "Bảo mật tài liệu cá nhân",
        ],
      },
      {
        id: "SH_STORAGE_5G",
        title: "Lưu Trữ 5GB",
        price: "49.000đ",
        numericPrice: 49000,
        cycle: "/ tháng",
        description: "Phù hợp cho học sinh, sinh viên lưu giáo trình",
        features: [
          "Dung lượng Firebase Storage 5GB",
          "Tìm kiếm ngữ nghĩa Semantic AI",
          "Sao lưu dữ liệu tự động",
        ],
      },
      {
        id: "SH_STORAGE_10G",
        title: "Lưu Trữ 10GB",
        price: "89.000đ",
        numericPrice: 89000,
        cycle: "/ tháng",
        description: "Lưu trữ sách, tài liệu & hình ảnh nghiên cứu",
        features: [
          "Dung lượng Firebase Storage 10GB",
          "Xử lý tài liệu PDF/Docx dung lượng lớn",
          "Hỗ trợ xuất dữ liệu nhanh chóng",
        ],
      },
      {
        id: "SH_STORAGE_100G",
        title: "Lưu Trữ 100GB",
        price: "299.000đ",
        numericPrice: 299000,
        cycle: "/ tháng",
        description: "Kho tri thức quy mô vừa cho Chuyên gia",
        features: [
          "Dung lượng Firebase Storage 100GB",
          "Tối ưu tốc độ tải & đọc file AI",
          "Phân quyền chia sẻ tài liệu",
        ],
      },
      {
        id: "SH_STORAGE_500G",
        title: "Lưu Trữ 500GB",
        price: "899.000đ",
        numericPrice: 899000,
        cycle: "/ tháng",
        description: "Không gian lưu trữ khổng lồ cho Tổ chức & Nhóm",
        features: [
          "Dung lượng Firebase Storage 500GB",
          "Bảo mật cấp doanh nghiệp",
          "Ưu tiên Băng thông High-speed",
        ],
      },
      {
        id: "SH_STUDY_TEACHER",
        title: "StudyPlace + Giáo Viên",
        price: "1.499.000đ",
        numericPrice: 1499000,
        cycle: "/ tháng",
        description: "Gồm 499k Thuê bao tháng + 1 Triệu Phụ phí Giáo viên kèm 1-1",
        features: [
          "Bao gồm toàn bộ quyền lợi StudyPlace AI",
          "Giáo viên hỗ trợ & định hướng trực tiếp 1-1",
          "Đánh giá & chấm bài chi tiết theo tiến độ",
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
                    <h4 className="text-xl font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                      <span>{plan.title}</span>
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
                    <span>Nâng Cấp Ngay</span>
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
