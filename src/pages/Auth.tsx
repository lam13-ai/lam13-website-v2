import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink } from "@/components/NavLink";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import logo from "@/assets/lamlogo.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveAuth } from "@/lib/auth";

type AuthMode = "signin" | "register" | "forgot" | "reset";
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const queryMode = searchParams.get("mode");
    const queryToken = searchParams.get("token");
    if (queryMode === "reset") {
      setMode("reset");
      setResetToken(queryToken ?? "");
    }
  }, [searchParams]);

  const validate = () => {
    if ((mode === "signin" || mode === "register" || mode === "forgot") && !isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if ((mode === "signin" || mode === "register" || mode === "reset") && formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    if (mode === "register" && !formData.name.trim()) {
      setError("Full name is required.");
      return false;
    }
    if ((mode === "register" || mode === "reset") && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (mode === "reset" && !resetToken) {
      setError("Reset token is missing from URL.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === "signin") {
        const res = await fetch(`${BACKEND_API_URL}/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Signin failed");
        saveAuth({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userId: data.userId,
          email: data.email,
          fullName: data.fullName || data.email?.split("@")[0] || "User",
        });
        navigate("/try");
        return;
      }

      if (mode === "register") {
        const res = await fetch(`${BACKEND_API_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.name.trim(),
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Signup failed");
        saveAuth({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userId: data.userId,
          email: data.email,
          fullName: data.fullName || formData.name.trim(),
        });
        navigate("/try");
        return;
      }

      if (mode === "forgot") {
        const res = await fetch(`${BACKEND_API_URL}/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to request password reset");
        setInfo(data.message || "If your email is registered, you will receive reset instructions.");
        return;
      }

      if (mode === "reset") {
        const res = await fetch(`${BACKEND_API_URL}/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: resetToken, newPassword: formData.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to reset password");
        setInfo("Password updated. Please sign in.");
        setMode("signin");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth error");
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === "signin" ? "Welcome back" :
    mode === "register" ? "Create account" :
    mode === "forgot" ? "Forgot password" :
    "Reset password";

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent/80">
        <div className="relative z-10 flex flex-col justify-start p-12 pt-16 text-white">
          <NavLink to="/" className="mb-12">
            <img src={logo} alt="LAM13" className="h-16 w-auto brightness-0 invert" />
          </NavLink>
          <h1 className="text-4xl font-bold mb-8 leading-tight text-white">Sign in to Lam13.ai</h1>
          <div className="space-y-4">
            {[
              "Conduct multi-chats and generate reports",
              "Access previous reports in chat history",
              "Get early access to new features",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-white">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <NavLink to="/" className="inline-block">
              <img src={logo} alt="LAM13" className="h-12 w-auto mx-auto" />
            </NavLink>
          </div>

          {(mode === "signin" || mode === "register") && (
            <div className="flex bg-secondary/30 rounded-xl p-1 mb-8">
              <button onClick={() => setMode("signin")} className={`flex-1 py-3 px-4 rounded-lg text-sm ${mode === "signin" ? "bg-background" : ""}`}>Sign In</button>
              <button onClick={() => setMode("register")} className={`flex-1 py-3 px-4 rounded-lg text-sm ${mode === "register" ? "bg-background" : ""}`}>Create Account</button>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="text-destructive text-sm">{error}</div>}
            {info && <div className="text-green-600 text-sm">{info}</div>}

            {(mode === "register") && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pl-10 h-12" />
                </div>
              </div>
            )}

            {(mode === "signin" || mode === "register" || mode === "forgot") && (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-10 h-12" />
                </div>
              </div>
            )}

            {(mode === "signin" || mode === "register" || mode === "reset") && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 h-12"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {(mode === "register" || mode === "reset") && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            )}

            {mode === "signin" && (
              <div className="flex justify-end">
                <button type="button" onClick={() => setMode("forgot")} className="text-sm text-accent hover:text-accent/80">Forgot password?</button>
              </div>
            )}

            {(mode === "forgot" || mode === "reset") && (
              <div className="text-sm">
                <button type="button" onClick={() => setMode("signin")} className="text-accent hover:text-accent/80">Back to sign in</button>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold group">
              {loading ? "Please wait..." :
                mode === "signin" ? "Sign In" :
                mode === "register" ? "Create Account" :
                mode === "forgot" ? "Send Reset Link" :
                "Reset Password"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <NavLink to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to home</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
