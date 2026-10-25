import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/features/auth/context/AuthContext";
import { AuthLayout } from "../components/AuthLayout";
import { Input, Button, Checkbox, Alert, toast } from "@/components/ui";
import { Mail, Lock, Building2, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid work email"),
  workspaceName: z.string().min(2, "Workspace name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  acceptTerms: z.boolean().refine((val) => val === true, "You must accept the terms of service"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      workspaceName: "",
      password: "",
      acceptTerms: false,
    },
  });

  const passwordVal = watch("password") || "";
  const acceptTerms = watch("acceptTerms") || false;

  // Simple password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(passwordVal);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-emerald-500"];

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerAuth({
        fullName: data.fullName,
        email: data.email,
        workspaceName: data.workspaceName,
        password: data.password,
      });

      toast.success("Registration Submitted", {
        description: `If registration is available for ${data.email}, verification instructions have been sent. Please check your inbox and verify your email before logging in.`,
        duration: 8000,
      });

      navigate(ROUTES.LOGIN);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setServerError(errorMsg);
    }
  };

  return (
    <AuthLayout
      title="Create your OmniFlow Account"
      subtitle="Start your 14-day free trial. No credit card required."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <Alert variant="destructive" title="Registration Error" description={serverError} dismissible />
        )}

        {/* Full Name */}
        <Input
          label="Full Name"
          placeholder="e.g. Sarah Connor"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        {/* Work Email */}
        <Input
          label="Work Email Address"
          type="email"
          placeholder="sarah@company.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Workspace Name */}
        <Input
          label="Workspace / Company Name"
          placeholder="e.g. Cyberdyne Growth Labs"
          leftIcon={<Building2 className="h-4 w-4" />}
          error={errors.workspaceName?.message}
          {...register("workspaceName")}
        />

        {/* Password */}
        <div>
          <Input
            label="Password"
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

          {/* Password Strength Indicator */}
          {passwordVal.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1 h-1.5 w-full">
                {[0, 1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 rounded-full transition-all ${
                      level < strength ? strengthColors[strength - 1] : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Strength: {strength > 0 ? strengthLabels[strength - 1] : "Too short"}</span>
                <span>Use letters, numbers & symbols</span>
              </div>
            </div>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="pt-2">
          <Checkbox
            checked={acceptTerms}
            onChange={(e) => setValue("acceptTerms", e.target.checked, { shouldValidate: true })}
            label="I accept the Terms of Service & Privacy Policy"
            description="I agree to OmniFlow's anti-spam compliance guidelines."
          />
          {errors.acceptTerms && (
            <p className="text-xs text-rose-600 font-medium mt-1">{errors.acceptTerms.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-center mt-2"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Create Workspace & Continue
        </Button>

        {/* Sign In Link */}
        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="font-semibold text-indigo-600 hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
