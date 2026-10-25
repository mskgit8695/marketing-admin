import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { AuthLayout } from "../components/AuthLayout";
import { Input, Button, Switch, Alert, toast } from "@/components/ui";
import { Mail, Lock, Eye, EyeOff, Sparkles, LogIn } from "lucide-react";
import { ROUTES } from "@/constants";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin_1791910163688@test.com");
  const [password, setPassword] = useState("Password123!");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      validationErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    } else if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await login({
        email: trimmedEmail,
        password,
        rememberMe,
      });

      toast.success("Welcome back!", {
        description: "Authenticated successfully. Redirecting to your workspace.",
      });

      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err: unknown) {
      console.error("[Login] Authentication error:", err);
      const errorMsg =
        (err as { message?: string })?.message ||
        (err instanceof Error ? err.message : "Authentication failed. Please try again.");
      setServerError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrors({});
    setServerError(null);
  };

  return (
    <AuthLayout
      title="Sign in to OmniFlow"
      subtitle="Welcome back! Please enter your workspace credentials."
    >
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        {serverError && (
          <Alert variant="destructive" title="Authentication Error" description={serverError} dismissible />
        )}

        {/* Demo Account Quick Buttons */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-indigo-600" />
              Quick Fill Accounts:
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => fillCredentials("admin_1791910163688@test.com", "Password123!")}
              className="text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-1 rounded-md transition-colors cursor-pointer"
            >
              ★ Live Backend Admin
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("test@test.com", "Password123!")}
              className="text-[11px] font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
            >
              User: test@test.com
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("admin@omniflow.io", "OmniFlow2026!")}
              className="text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
            >
              Mock Admin
            </button>
          </div>
        </div>

        {/* Email */}
        <Input
          id="login-email-input"
          data-testid="login-email-input"
          label="Work Email Address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder="name@company.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email}
          autoComplete="email"
          required
        />

        {/* Password */}
        <div>
          <Input
            id="login-password-input"
            data-testid="login-password-input"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="••••••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.password}
            autoComplete="current-password"
            required
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <Switch
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            label="Remember me for 30 days"
          />

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          id="login-submit-button"
          data-testid="login-submit-button"
          type="submit"
          onClick={handleSubmit}
          variant="primary"
          size="md"
          className="w-full justify-center"
          isLoading={isSubmitting}
          rightIcon={<LogIn className="h-4 w-4" />}
        >
          Sign In to Workspace
        </Button>

        {/* Register Link */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have a workspace account?{" "}
          <Link to={ROUTES.REGISTER} className="font-semibold text-indigo-600 hover:underline">
            Create an account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
