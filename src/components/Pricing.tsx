import { Check } from "lucide-react";

interface PricingPlan {
  title: string;
  price: string;
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
    category: "sinhHAI",
    subtitle: "Trợ lý Chatbot AI đa năng thông minh",
    plans: [
      {
        title: "Gói Tháng",
        price: "199.000đ",
        cycle: "/ tháng",
        description: "Dành cho cá nhân trải nghiệm linh hoạt",
        features: ["Truy cập Chatbot AI full tính năng", "Tốc độ phản hồi ưu tiên", "Hỗ trợ 24/7"],
      },
      {
        title: "Gói Quý",
        price: "499.000đ",
        cycle: "/ 3 tháng",
        description: "Tiết kiệm 15% chi phí cho công việc",
        features: ["Tất cả tính năng gói Tháng", "Lưu trữ lịch sử chat không giới hạn", "Tối ưu câu lệnh Prompt"],
      },
      {
        title: "Gói Năm",
        price: "1.490.000đ",
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
        title: "Gói Tháng",
        price: "249.000đ",
        cycle: "/ tháng",
        description: "Không gian ghi chú & quản lý tài liệu AI",
        features: ["Bộ nhớ lưu trữ AI 50GB", "Tự động tóm tắt tài liệu", "Quản lý tiến độ học tập"],
      },
      {
        title: "Gói Quý",
        price: "649.000đ",
        cycle: "/ 3 tháng",
        description: "Dành cho học sinh, sinh viên & tác giả",
        features: ["Bộ nhớ lưu trữ AI 200GB", "Phân tích hồ sơ chuyên sâu", "Chia sẻ workspace học tập"],
      },
      {
        title: "Gói Năm",
        price: "1.990.000đ",
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
        title: "Gói Tháng",
        price: "349.000đ",
        cycle: "/ tháng",
        description: "Tạo ảnh AI sắc nét xuất bản phẩm",
        features: ["Tạo 500 hình ảnh AI khổ lớn/tháng", "Độ phân giải 300 DPI chuẩn in", "Xuất file không dán logo"],
      },
      {
        title: "Gói Quý",
        price: "899.000đ",
        cycle: "/ 3 tháng",
        description: "Dành cho Designer & Nhà sáng tạo nội dung",
        features: ["Tạo 1.800 hình ảnh AI/quý", "Tỷ lệ A4 / 2:3 chuyên nghiệp", "Công cụ chỉnh sửa nâng cao"],
      },
      {
        title: "Gói Năm",
        price: "2.890.000đ",
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
        title: "Gói Tháng",
        price: "499.000đ",
        cycle: "/ tháng",
        description: "Tự động hóa các tác vụ lặp đi lặp lại",
        features: ["Chạy 1.000 Workflow/tháng", "Tích hợp đa nền tảng API", "Giao diện kéo thả trực quan"],
      },
      {
        title: "Gói Quý",
        price: "1.290.000đ",
        cycle: "/ 3 tháng",
        description: "Tăng 500% năng suất làm việc nhóm",
        features: ["Chạy 3.500 Workflow/quý", "Cấu hình Automation phức tạp", "Báo cáo hiệu suất tự động"],
      },
      {
        title: "Gói Năm",
        price: "3.990.000đ",
        cycle: "/ năm",
        description: "Hệ thống tự vận hành 24/7 tối ưu",
        features: ["Không giới hạn Lượt chạy Workflow", "Xử lý dữ liệu song song", "Hỗ trợ tích hợp Custom Node"],
      },
    ],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="container py-16 sm:py-24 space-y-16">
      {/* Tiêu đề chính */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Bảng Giá Dịch Vụ <span className="text-purple-600 dark:text-purple-400">SinhHAI</span>
        </h2>
        <p className="text-xl text-muted-foreground pt-2">
          Lựa chọn gói thuê bao phù hợp để bứt phá hiệu suất công việc của bạn
        </p>
      </div>

      {/* Danh sách dịch vụ */}
      {pricingData.map((service, index) => (
        <div key={index} className="space-y-6">
          <div className="border-l-4 border-purple-600 pl-4 py-1">
            <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {service.category}
            </h3>
            <p className="text-sm text-muted-foreground">{service.subtitle}</p>
          </div>

          {/* Grid 3 cột đều nhau */}
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
                  <button className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md shadow-purple-500/20 transition-colors">
                    Đăng Ký Ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
