import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { buttonVariants, Button } from "./ui/button";
import { Menu, LogIn, LogOut, User, Mail, Lock, AlertCircle, X, CreditCard } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./Icons";

// Import Firebase Auth & Providers
import { auth, googleProvider, facebookProvider } from "../firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "Tính năng SinhHAI",
  },
  {
    href: "#pricing",
    label: "Bảng giá gói cước",
  },
  {
    href: "#faq",
    label: "Hỏi & Đáp",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  // State Form
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Đảm bảo client-side rendering cho Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lắng nghe trạng thái đăng nhập Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Đóng Modal Auth
  const closeAuthModal = () => {
    setIsAuthOpen(false);
    setAuthError("");
    setEmail("");
    setPassword("");
    setLoading(false);
  };

  // Lắng nghe phím ESC để đóng Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthOpen]);

  // Điều hướng đến Trang Thanh Toán (/checkout)
  const handleNavigateToCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    window.location.href = "/checkout";
  };

  // Điều hướng đến Trang Hồ sơ (/profile)
  const handleNavigateToProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    window.location.href = "/profile";
  };

  // Đăng nhập Google
  const handleGoogleLogin = async () => {
    setAuthError("");
    try {
      await signInWithPopup(auth, googleProvider);
      closeAuthModal();
    } catch (error: any) {
      console.error("Lỗi Google Login:", error);
      setAuthError("Đăng nhập Google thất bại!");
    }
  };

  // Đăng nhập Facebook
  const handleFacebookLogin = async () => {
    setAuthError("");
    try {
      await signInWithPopup(auth, facebookProvider);
      closeAuthModal();
    } catch (error: any) {
      console.error("Lỗi Facebook Login:", error);
      setAuthError("Đăng nhập Facebook thất bại! Kiểm tra lại cài đặt App Facebook.");
    }
  };

  // Đăng nhập / Đăng ký bằng Email & Mật khẩu
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      closeAuthModal();
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setAuthError("Email này đã được đăng ký!");
      } else if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        setAuthError("Email hoặc mật khẩu không chính xác!");
      } else if (error.code === "auth/weak-password") {
        setAuthError("Mật khẩu phải từ 6 ký tự trở lên!");
      } else {
        setAuthError("Đã có lỗi xảy ra. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (window.location.pathname === "/profile") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <>
      <header className="sticky border-b top-0 z-40 w-full bg-white/95 backdrop-blur dark:border-b-purple-900/40 dark:bg-background/95 border-purple-200">
        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between">
            <NavigationMenuItem className="font-bold flex">
              <a
                rel="noreferrer noopener"
                href="/"
                className="ml-2 font-bold text-xl flex items-center gap-2 text-purple-700 dark:text-purple-400"
              >
                <LogoIcon />
                SinhHAI
              </a>
            </NavigationMenuItem>

            {/* Mobile nav */}
            <span className="flex md:hidden items-center gap-2">
              <ModeToggle />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger className="px-2">
                  <Menu className="flex md:hidden h-5 w-5 text-purple-700 dark:text-purple-300" onClick={() => setIsOpen(true)}>
                    <span className="sr-only">Thực đơn</span>
                  </Menu>
                </SheetTrigger>
                <SheetContent side={"left"}>
                  <SheetHeader>
                    <SheetTitle className="font-bold text-xl text-purple-600">Nền tảng SinhHAI</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                    {routeList.map(({ href, label }: RouteProps) => (
                      <a
                        key={label}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        {label}
                      </a>
                    ))}

                    {/* Nút thanh toán Mobile */}
                    <a
                      href="/checkout"
                      onClick={handleNavigateToCheckout}
                      className="w-[170px] mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 px-4 rounded-md font-medium text-sm shadow cursor-pointer transition-all"
                    >
                      <CreditCard className="w-4 h-4" />
                      Thanh toán
                    </a>

                    {user ? (
                      <>
                        <a
                          href="/profile"
                          onClick={handleNavigateToProfile}
                          className="w-[170px] mt-2 flex items-center justify-center gap-2 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 text-purple-700 dark:text-purple-300 py-2 px-4 rounded-md font-medium text-sm transition-all"
                        >
                          <User className="w-4 h-4 text-purple-600" />
                          Hồ sơ của tôi
                        </a>
                        <Button
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          variant="destructive"
                          className="w-[170px] mt-2 flex gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          setIsAuthOpen(true);
                        }}
                        className="w-[170px] mt-2 flex gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <LogIn className="w-4 h-4" />
                        Đăng nhập
                      </Button>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </span>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-2">
              {routeList.map((route: RouteProps, i) => (
                <a
                  href={route.href}
                  key={i}
                  className={`text-[17px] hover:text-purple-600 transition-colors ${buttonVariants({
                    variant: "ghost",
                  })}`}
                >
                  {route.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex gap-2 items-center">
              {/* Nút thanh toán Desktop */}
              <a
                href="/checkout"
                onClick={handleNavigateToCheckout}
                className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium px-3.5 py-1.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                Thanh toán
              </a>

              {user ? (
                <div className="flex items-center gap-2">
                  <a
                    href="/profile"
                    onClick={handleNavigateToProfile}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-md text-sm font-medium transition-all"
                  >
                    <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="max-w-[120px] truncate">
                      {user.displayName || user.email}
                    </span>
                  </a>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="flex gap-1 border-purple-300 hover:bg-purple-50 text-purple-700 dark:border-purple-800 dark:text-purple-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="flex gap-1 bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md shadow-purple-500/20"
                  onClick={() => setIsAuthOpen(true)}
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </Button>
              )}

              <ModeToggle />
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      {/* POPUP AUTH MODAL */}
      {mounted && isAuthOpen && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={closeAuthModal}
        >
          <div 
            className="relative w-full max-w-md bg-background rounded-xl p-6 shadow-2xl border border-purple-500/30 dark:border-purple-800 my-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút X Đóng Popup */}
            <button
              onClick={closeAuthModal}
              className="absolute right-3 top-3 z-20 p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
              title="Đóng (ESC)"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold text-center mb-1 text-purple-600 dark:text-purple-400">
              {isRegister ? "Tạo tài khoản SinhHAI" : "Đăng nhập SinhHAI"}
            </h2>
            <p className="text-xs text-center text-muted-foreground mb-4">
              Nhấn phím <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px] font-mono">ESC</kbd> hoặc nút (X) để đóng
            </p>

            {authError && (
              <div className="flex items-center gap-2 p-3 mb-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200 dark:bg-red-950/50 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
                <input
                  type="email"
                  placeholder="Địa chỉ Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-purple-200 dark:border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-purple-200 dark:border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : isRegister ? "Tạo tài khoản" : "Đăng nhập với Email"}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-purple-200 dark:border-purple-900" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleGoogleLogin} className="flex gap-2 border-purple-200 hover:bg-purple-50 dark:border-purple-900">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google
              </Button>

              <Button variant="outline" onClick={handleFacebookLogin} className="flex gap-2 border-purple-200 hover:bg-purple-50 dark:border-purple-900">
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground mt-4">
              {isRegister ? (
                <p>
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setAuthError("");
                    }}
                    className="text-purple-600 hover:underline font-medium dark:text-purple-400"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              ) : (
                <p>
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(true);
                      setAuthError("");
                    }}
                    className="text-purple-600 hover:underline font-medium dark:text-purple-400"
                  >
                    Đăng ký ngay
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
