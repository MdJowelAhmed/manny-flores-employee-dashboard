import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/redux/slices/authSlice";
import type { UserRoleValue } from "@/redux/slices/authSlice";
import { UserRole } from "@/types/roles";
import { useLoginMutation } from "@/redux/api/authApi";
import { baseApi } from "@/redux/baseApi";
import { decodeJwt } from "@/utils/jwt";
import { getApiErrorMessage } from "@/utils/apiError";
import { toast } from "@/utils/toast";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

function normalizeRole(role: string | undefined): UserRoleValue | null {
  if (!role) return null;
  const lower = role.toLowerCase();
  const isValid = (Object.values(UserRole) as string[]).includes(lower);
  return isValid ? (lower as UserRoleValue) : null;
}

function deriveNameFromEmail(email: string): { firstName: string; lastName: string } {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : "");
  return {
    firstName: cap(parts[0] ?? ""),
    lastName: cap(parts[1] ?? ""),
  };
}

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);
  const sessionExpired = (location.state as { sessionExpired?: boolean } | null)
    ?.sessionExpired;
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    dispatch(loginStart());

    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      const { accessToken, refreshToken, role } = response.data;
      const decoded = decodeJwt(accessToken);
      const userId = decoded?.id ?? "";
      const userRole = normalizeRole(decoded?.role ?? role);

      if (!userRole) {
        const message = t("auth.invalidEmailOrPassword");
        dispatch(loginFailure(message));
        toast({ title: message, variant: "destructive" });
        return;
      }

      const { firstName, lastName } = deriveNameFromEmail(data.email);

      dispatch(
        loginSuccess({
          user: {
            id: userId,
            email: data.email,
            firstName,
            lastName,
            role: userRole,
          },
          token: accessToken,
          refreshToken,
        })
      );

      dispatch(baseApi.util.invalidateTags(['Auth']));

      toast({
        title: response.message || t("auth.welcomeBack"),
        variant: "success",
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message = getApiErrorMessage(err, t("auth.invalidEmailOrPassword"));
      dispatch(loginFailure(message));
      toast({ title: message, variant: "destructive" });
    }
  };


  return (
    <div className="space-y-6">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xl">D</span>
        </div>
        <span className="font-display font-bold text-2xl">{t('auth.dashboard')}</span>
      </div>

      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-bold tracking-tight">{t('auth.welcomeBack')}</h1>
        <p className="text-muted-foreground">
          {t('auth.enterCredentials')}
        </p>
      </div>

      {sessionExpired && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm"
        >
          Your session has expired. Please sign in again to continue.
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={cn("pl-10", errors.email && "border-destructive")}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('auth.password')}</Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={cn(
                "pl-10 pr-10",
                errors.password && "border-destructive"
              )}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-input"
              {...register("remember")}
            />
            <Label
              htmlFor="remember"
              className="text-sm font-normal cursor-pointer"
            >
              {t('auth.rememberMe')}
            </Label>
          </div>
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          {!isLoading && (
            <>
              {t('auth.signIn')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t('auth.dontHaveAccount')}{' '}
        <Link
          to="/auth/signup"
          className="text-primary font-medium hover:underline"
        >
          {t('auth.signUp')}
        </Link>
      </p>
    </div>
  );
}
