import { LogoIcon } from "./Icons";

export const Footer = () => {
  return (
    <footer id="footer" className="bg-purple-50/40 dark:bg-background border-t border-purple-200 dark:border-purple-900/50">
      <hr className="w-11/12 mx-auto border-purple-200 dark:border-purple-900/30" />

      <section className="container py-16 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        {/* Brand Column */}
        <div className="col-span-full xl:col-span-2 space-y-3">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-2xl flex items-center gap-2 text-purple-700 dark:text-purple-400"
          >
            <LogoIcon />
            SinhHAI
          </a>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hệ sinh thái công cụ AI thông minh hỗ trợ tự động hóa, sáng tạo nội dung, thiết kế hình ảnh và tối ưu không gian làm việc.
          </p>
        </div>

        {/* Hệ Sinh Thái Column */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300">Sản Phẩm</h3>
          <div>
            <a href="#pricing" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              sinhHAI
            </a>
          </div>
          <div>
            <a href="#pricing" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              sinhhai-studyplace
            </a>
          </div>
          <div>
            <a href="#pricing" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              sinhhai-studio
            </a>
          </div>
          <div>
            <a href="#pricing" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              Workflow Automatic AI
            </a>
          </div>
        </div>

        {/* Nền Tảng Column */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300">Nền Tảng</h3>
          <div>
            <a href="https://landingpage.sinhhai.com" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              Web Landing
            </a>
          </div>
          <div>
            <a href="#" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              Android App
            </a>
          </div>
          <div>
            <a href="#" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              Cloud Workspace
            </a>
          </div>
        </div>

        {/* Thông Tin Column */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300">Điều Hướng</h3>
          <div>
            <a href="#features" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              Tính năng
            </a>
          </div>
          <div>
            <a href="#pricing" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              Bảng giá
            </a>
          </div>
          <div>
            <a href="#faq" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              Hỏi đáp
            </a>
          </div>
        </div>

        {/* Cộng Đồng Column */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300">Kết Nối</h3>
          <div>
            <a href="#" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              Facebook
            </a>
          </div>
          <div>
            <a href="#" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              GitHub
            </a>
          </div>
          <div>
            <a href="#" className="opacity-75 hover:opacity-100 hover:text-purple-600 transition-colors text-sm">
              YouTube
            </a>
          </div>
        </div>
      </section>

      {/* Developer Copyright Section */}
      <section className="container pb-10 text-center border-t border-purple-200/60 dark:border-purple-900/30 pt-6">
        <h3 className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SinhHAI. Xây dựng & Phát triển hệ thống bởi{" "}
          <span className="font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
            Trần Thiệu Long (Dev)
          </span>
        </h3>
      </section>
    </footer>
  );
};
