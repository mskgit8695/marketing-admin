import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "@/services/api/auth.api";
import { AuthLayout } from "../components/AuthLayout";
import { Input, Button, Alert } from "@/components/ui";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetFormData) => {
    setServerError(null);
    if (!token) {
      setServerError("Missing password reset token. Please request a new reset link from the forgot password page.");
      return;
    }
    try {
      await authApi.resetPassword({
        token,
        password: data.password,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password.";
      setServerError(msg);
    }
  };

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Your new password must be different from previous passwords."
    >
      {isSuccess ? (
        <div className="space-y-6 text-center py-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">Password Reset Complete</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Your password has been successfully updated. You can now sign in with your new credentials.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            className="w-full justify-center"
            onClick={() => navigate(ROUTES.LOGIN)}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Sign In with New Password
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <Alert variant="destructive" title="Reset Failed" description={serverError} dismissible />
          )}

          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
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
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirm New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Repeat your password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full justify-center"
            isLoading={isSubmitting}
          >
            Update Password & Sign In
          </Button>

          <div className="text-center pt-2 border-t border-slate-100">
            <Link to={ROUTES.LOGIN} className="text-xs font-semibold text-indigo-600 hover:underline">
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
