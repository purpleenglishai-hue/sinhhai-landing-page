import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { buttonVariants, Button } from "./ui/button";
import { Menu, LogIn, LogOut, User, Mail, Lock, AlertCircle } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./Icons";

// Import Firebase Auth & Providers
import { auth, googleProvider, facebookProvider } from "@/firebase";
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
    label: "Tính năng",
  },
  {
    href: "#pricing",
    label: "Bảng giá",
  },
  {
    href: "#faq",
    label: "Hỏi đáp",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // State cho Form Email & Password
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Lắng nghe trạng thái đăng nhập Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Reset form khi đóng/mở dialog
  const handleAuthOpenChange = (open: boolean) => {
    setIsAuthOpen(open);
    if (!open) {
      setAuthError("");
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };

  // Đăng nhập Google
  const handleGoogleLogin = async () => {
    setAuthError("");
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthOpen(false);
    } catch (error: any) {
      console.error("Lỗi đăng nhập Google:", error);
      setAuthError("Đăng nhập Google thất bại. Vui lòng thử lại!");
    }
  };

  // Đăng nhập Facebook
  const handleFacebookLogin = async () => {
    setAuthError("");
    try {
      await signInWithPopup(auth, facebookProvider);
      setIsAuthOpen(false);
    } catch (error: any) {
      console.error("Lỗi đăng nhập Facebook:", error);
      setAuthError("Đăng nhập Facebook thất bại. Vui lòng kiểm tra lại cấu hình!");
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
      setIsAuthOpen(false);
    } catch (error: any) {
      console.error("Lỗi Auth Email:", error);
      if (error.code === "auth/email-already-in-use") {
        setAuthError("Email này đã được sử dụng!");
      } else if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        setAuthError("Email hoặc mật khẩu không chính xác!");
      } else if (error.code === "auth/weak-password") {
        setAuthError("Mật khẩu phải chứa ít nhất 6 ký tự!");
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
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  // Giao diện Modal Đăng Nhập / Đăng Ký
  const AuthDialogContent = () => (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center">
          {isRegister ? "Tạo tài khoản SinhHAI" : "Đăng nhập SinhHAI"}
        </DialogTitle>
      </DialogHeader>

      {authError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-md text-sm dark:bg-red-950/50 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Form Email / Password */}
      <form onSubmit={handleEmailAuth} className="space-y-3 mt-2">
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            placeholder="Địa chỉ Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Đang xử lý..." : isRegister ? "Đăng ký" : "Đăng nhập với Email"}
        </Button>
      </form>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Hoặc tiếp tục với</span>
        </div>
      </div>

      {/* Nút đăng nhập Google & Facebook */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={handleGoogleLogin} className="flex gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </Button>

        <Button variant="outline" onClick={handleFacebookLogin} className="flex gap-2">
          <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </Button>
      </div>

      {/* Chuyển đổi Đăng nhập / Đăng ký */}
      <div className="text-center text-xs text-muted-foreground mt-3">
        {isRegister ? (
          <p>
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setAuthError("");
              }}
              className="text-primary underline font-medium"
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
              className="text-primary underline font-medium"
            >
              Đăng ký ngay
            </button>
          </p>
        )}
      </div>
    </DialogContent>
  );

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex items-center gap-2"
            >
              <LogoIcon />
              SinhHAI
            </a>
          </NavigationMenuItem>

          {/* Mobile navigation */}
          <span className="flex md:hidden items-center gap-2">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu className="flex md:hidden h-5 w-5" onClick={() => setIsOpen(true)}>
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">SinhHAI</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}

                  {user ? (
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      variant="destructive"
                      className="w-[140px] mt-2 flex gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="w-[140px] mt-2 flex gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Đăng nhập
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2 items-center">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
                  <User className="w-4 h-4" />
                  {user.displayName || user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Dialog open={isAuthOpen} onOpenChange={handleAuthOpenChange}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex gap-1">
                    <LogIn className="w-4 h-4" />
                    Đăng nhập
                  </Button>
                </DialogTrigger>
                <AuthDialogContent />
              </Dialog>
            )}

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Dialog cho Mobile */}
      <Dialog open={isAuthOpen} onOpenChange={handleAuthOpenChange}>
        <AuthDialogContent />
      </Dialog>
    </header>
  );
};
