import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "@/services/api/auth.api";
import { AuthLayout } from "../components/AuthLayout";
import { Input, Button, Alert } from "@/components/ui";
import { Mail, ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import { ROUTES } from "@/constants";

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid work email"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotFormData) => {
    setServerError(null);
    try {
      await authApi.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send reset link.";
      setServerError(msg);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email associated with your workspace and we'll send you a recovery link."
    >
      {isSubmitted ? (
        <div className="space-y-6 text-center py-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">Check your email</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              We have sent password recovery instructions to:
            </p>
            <p className="text-xs font-semibold text-slate-800 font-mono">{submittedEmail}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500">
            Didn't receive the email? Check your spam folder or try another email address.
          </div>

          <div className="space-y-3 pt-2">
            <Link to={`/reset-password?token=mock_reset_token_${Date.now()}`}>
              <Button variant="primary" size="md" className="w-full justify-center">
                Simulate Clicking Reset Link
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
              onClick={() => setIsSubmitted(false)}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Try another email
            </Button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <Alert variant="destructive" title="Request Failed" description={serverError} dismissible />
          )}

          <Input
            label="Work Email Address"
            type="email"
            placeholder="name@company.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full justify-center"
            isLoading={isSubmitting}
          >
            Send Recovery Link
          </Button>

          <div className="text-center pt-2 border-t border-slate-100">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
