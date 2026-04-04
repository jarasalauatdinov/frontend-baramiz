import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthActionError, useAuth, type LoginInput } from "@/features/auth/auth-provider";
import { createLoginSchema } from "@/features/auth/validation";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { LoadingState } from "@/shared/ui/state/LoadingState";

export function LoginPage() {
  const { isAuthenticated, isReady, login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (!isReady) {
    return (
      <>
        <AppHeader title={t("common.actions.login")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState />
        </div>
      </>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await login(values);
      navigate("/profile", {
        replace: true,
        state: { authMessageKey: "auth.success.login" },
      });
    } catch (error) {
      if (error instanceof AuthActionError) {
        setSubmitError(
          t(
            error.code === "email_exists"
              ? "auth.errors.emailExists"
              : "auth.errors.invalidCredentials",
          ),
        );
        return;
      }

      setSubmitError(t("auth.errors.unknown"));
    }
  });

  return (
    <>
      <AppHeader
        title={t("common.actions.login")}
        back
        showLanguageSwitcher
        actions={
          <Link className="app-header__text-action" to="/register">
            {t("auth.login.headerAction")}
          </Link>
        }
      />
      <div className="screen auth-screen">
        <section className="panel auth-panel">
          <div className="auth-panel__copy">
            <h1>{t("auth.login.title")}</h1>
            <p>{t("auth.login.subtitle")}</p>
          </div>
          <form className="auth-form" onSubmit={(event) => void onSubmit(event)}>
            <label className="input-label">
              <span>{t("auth.email.label")}</span>
              <input
                type="email"
                className="text-input"
                placeholder={t("auth.email.placeholder")}
                autoComplete="email"
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <span className="field-error">{form.formState.errors.email.message}</span>
              ) : null}
            </label>

            <label className="input-label">
              <span>{t("auth.password.label")}</span>
              <input
                type="password"
                className="text-input"
                placeholder={t("auth.password.placeholder")}
                autoComplete="current-password"
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <span className="field-error">{form.formState.errors.password.message}</span>
              ) : null}
            </label>

            {submitError ? <div className="field-error">{submitError}</div> : null}

            <button type="submit" className="button accent button--full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
            </button>
          </form>

          <div className="auth-switch">
            <span>{t("auth.switch.loginPrompt")}</span>
            <Link to="/register">{t("auth.switch.loginAction")}</Link>
          </div>
        </section>
      </div>
    </>
  );
}
