import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink } from "@/components/NavLink";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Check, X } from "lucide-react";
import logo from "@/assets/lamlogo.png";
import { useNavigate } from "react-router-dom";


type AuthMode = "signin" | "register";
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getPasswordStrength = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

const isPasswordValid = (password: string): boolean => {
  const strength = getPasswordStrength(password);
  return Object.values(strength).every(Boolean);
};

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [errorSignIn, setErrorSignIn] = useState("");
  const [errorRegister, setErrorRegister] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Email validation
    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!isValidEmail(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    // Password validation
    if (!formData.password) {
      errors.push("Password is required");
    } else if (mode === "register" && !isPasswordValid(formData.password)) {
      errors.push("Password does not meet requirements");
    }

    // Register-specific validations
    if (mode === "register") {
      if (!formData.name.trim()) {
        errors.push("Full name is required");
      } else if (formData.name.trim().length < 2) {
        errors.push("Name must be at least 2 characters");
      }

      if (!formData.confirmPassword) {
        errors.push("Please confirm your password");
      } else if (formData.password !== formData.confirmPassword) {
        errors.push("Passwords do not match");
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorSignIn("");
    setErrorRegister("");
    setValidationErrors([]);

    // Frontend validation
    if (!validateForm()) {
      return;
    }

    try {
      if (mode=="signin"){
        const email = formData.email
        const password = formData.password
        const res = await fetch(BACKEND_API_URL +"/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password}),

        });

        const data = await res.json();
        if (!data.success) {
          const err = data
          setErrorSignIn(err.detail)
        }
        else{
          // Store user info for display
          localStorage.setItem("lam13_user", JSON.stringify({user_id:data.user.id, name: data.name || formData.email.split('@')[0], email: formData.email, }));
          navigate("/try")
        }


}
else if(mode=="register"){
  const { name, email, password } = formData;

  const res = await fetch(BACKEND_API_URL +"/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({name,email,password}),

  });

  const data = await res.json();

  if (!data.success){
    setErrorRegister(data.detail)

  }
  else{
    // Store user info for display
    localStorage.setItem("lam13_user", JSON.stringify({ user_id:data.data.id, name: name, email: email }));
    navigate("/try")
  }

}
      } catch (err) {
        console.error("Auth error:", err)
      }
    };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent/80">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-accent/30 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, white 1px, transparent 1px),
                linear-gradient(to bottom, white 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-start p-12 pt-16 text-white">
          <NavLink to="/" className="mb-12">
            <img src={logo} alt="LAM13" className="h-16 w-auto brightness-0 invert" />
          </NavLink>

          <h1 className="text-4xl font-bold mb-8 leading-tight text-white">
            Sign in to Lam13.ai
          </h1>

          <div className="space-y-4">
            {[
              "Conduct multi-chats and generate multiple reports simultaneously",
              "Access previous reports in chat history",
              "Be the first to try our upcoming products",
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

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <NavLink to="/" className="inline-block">
              <img src={logo} alt="LAM13" className="h-12 w-auto mx-auto" />
            </NavLink>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-secondary/30 rounded-xl p-1 mb-8">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === "signin"
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === "register"
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {mode === "signin" ? "Welcome back" : "Get started"}
            </h2>
            <p className="text-muted-foreground">
              {mode === "signin"
                ? "Sign in to continue your strategic journey"
                : "Create an account to save your conversations"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                {validationErrors.map((error, i) => (
                  <p key={i} className="text-destructive text-sm">{error}</p>
                ))}
              </div>
            )}
            {errorRegister && mode === "register" && (
              <div className="text-destructive text-sm text-center mb-2">{errorRegister}</div>
            )}
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground/80">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-12 bg-secondary/30 border-border/50 focus:border-accent"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">

              {/* Error Message if login incorrect */}
              {errorSignIn && mode === "signin" && (
                <div className="text-red-500 text-sm text-center mb-2">{errorSignIn}</div>
              )}
              <Label htmlFor="email" className="text-foreground/80">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12 bg-secondary/30 border-border/50 focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signin" ? "Enter your password" : "Create a password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-12 bg-secondary/30 border-border/50 focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password Requirements */}
              {mode === "register" && formData.password && (
                <div className="mt-2 space-y-1">
                  {[
                    { key: 'minLength', label: 'At least 8 characters' },
                    { key: 'hasUppercase', label: 'One uppercase letter' },
                    { key: 'hasLowercase', label: 'One lowercase letter' },
                    { key: 'hasNumber', label: 'One number' },
                    { key: 'hasSpecial', label: 'One special character (!@#$%^&*)' },
                  ].map(({ key, label }) => {
                    const strength = getPasswordStrength(formData.password);
                    const isValid = strength[key as keyof typeof strength];
                    return (
                      <div key={key} className={`flex items-center gap-2 text-xs ${isValid ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {isValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground/80">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 h-12 bg-secondary/30 border-border/50 focus:border-accent"
                  />
                </div>
              </div>
            )}

            {mode === "signin" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold group"
            >
              {mode === "signin" ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

          </form>

          {/* Terms */}
          {mode === "register" && (
            <p className="text-xs text-muted-foreground text-center mt-6">
              By creating an account, you agree to our{" "}
              <NavLink to="/terms" className="text-accent hover:underline">
                Terms of Service
              </NavLink>{" "}
              and{" "}
              <NavLink to="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </NavLink>
            </p>
          )}

          {/* Back to home */}
          <div className="mt-8 text-center">
            <NavLink
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to home
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
