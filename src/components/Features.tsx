import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import image from "../assets/growth.png";
import image3 from "../assets/reflecting.png";
import image4 from "../assets/looking-ahead.png";

interface FeatureProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
}

const features: FeatureProps[] = [
  {
    title: "SinhHAI StudyPlace",
    subtitle: "Nơi học tập & làm việc thông minh",
    description:
      "Trợ lý AI đồng hành giúp tóm tắt tài liệu, soạn thảo văn bản, trợ giúp nghiên cứu và giải quyết bài toán phức tạp chỉ trong vài giây.",
    image: image3,
    badge: "Học tập & Làm việc",
  },
  {
    title: "SinhHAI Studio",
    subtitle: "Sáng tạo & Chỉnh sửa hình ảnh AI",
    description:
      "Tạo và nâng cấp hình ảnh kích thước lớn, chất lượng cao với độ chi tiết vượt trội. Nâng tầm ý tưởng thiết kế chỉ bằng một vài câu lệnh.",
    image: image4,
    badge: "Thiết kế & Đồ họa",
  },
  {
    title: "SinhHAI Vault & Data",
    subtitle: "Lưu trữ & Giải quyết dữ liệu thông minh",
    description:
      "Lưu trữ an toàn và phân tích tập tin tự động. AI hỗ trợ trích xuất thông tin, tổng hợp báo cáo và tìm kiếm dữ liệu tức thì.",
    image: image,
    badge: "Lưu trữ & Dữ liệu",
  },
  {
    title: "SinhHAI Workflow",
    subtitle: "Tự động hóa chuỗi công việc",
    description:
      "Kết nối và tự động hóa các tác vụ lặp đi lặp lại. Xây dựng quy trình làm việc liền mạch, giúp bạn tiết kiệm tối đa thời gian và công sức.",
    image: image,
    badge: "Tự động hóa",
  },
];

const featureList: string[] = [
  "Trợ lý AI đa năng",
  "Tạo ảnh 4K/Kích thước lớn",
  "Xử lý dữ liệu thông minh",
  "Chuỗi tự động hóa Workflow",
  "Bảo mật dữ liệu cao",
  "Hỗ trợ Tiếng Việt 100%",
  "Tương thích đa nền tảng",
  "Tốc độ xử lý siêu tốc",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-sm font-semibold border-purple-500/30 text-purple-600 dark:text-purple-400">
          Hệ sinh thái SinhHAI
        </Badge>
        <h2 className="text-3xl lg:text-4xl font-bold">
          Sức mạnh đột phá từ{" "}
          <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-400 text-transparent bg-clip-text">
            SinhHAI AI
          </span>
        </h2>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          Tích hợp toàn diện các công cụ AI tiên tiến giúp bạn tối ưu hóa học tập, sáng tạo hình ảnh và tự động hóa quy trình công việc.
        </p>
      </div>

      {/* Danh sách các thẻ Nổi bật (Badges) */}
      <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm py-1 px-3 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50"
            >
              ✓ {feature}
            </Badge>
          </div>
        ))}
      </div>

      {/* Lưới các tính năng chính */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 pt-6">
        {features.map(({ title, subtitle, description, image, badge }: FeatureProps) => (
          <Card key={title} className="flex flex-col justify-between border-purple-100 dark:border-purple-900/40 hover:border-purple-300 transition-all shadow-sm hover:shadow-md">
            <CardHeader className="space-y-2">
              <div className="flex justify-between items-center">
                <Badge className="bg-purple-600/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-300 hover:bg-purple-600/20 border-none">
                  {badge}
                </Badge>
              </div>
              <CardTitle className="text-2xl text-purple-950 dark:text-purple-100">{title}</CardTitle>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{subtitle}</p>
            </CardHeader>

            <CardContent className="text-muted-foreground leading-relaxed">
              {description}
            </CardContent>

            <CardFooter className="pt-4">
              <img
                src={image}
                alt={title}
                className="w-[220px] lg:w-[260px] mx-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
