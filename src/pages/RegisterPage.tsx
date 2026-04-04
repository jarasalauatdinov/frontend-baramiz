import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthActionError, useAuth, type RegisterInput } from "@/features/auth/auth-provider";
import { createRegisterSchema } from "@/features/auth/validation";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { LoadingState } from "@/shared/ui/state/LoadingState";

export function RegisterPage() {
  const { isAuthenticated, isReady, register: registerUser } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  if (!isReady) {
    return (
      <>
        <AppHeader title={t("common.actions.register")} back showLanguageSwitcher />
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
      await registerUser(values);
      navigate("/profile", {
        replace: true,
        state: { authMessageKey: "auth.success.register" },
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
        title={t("common.actions.register")}
        back
        showLanguageSwitcher
        actions={
          <Link className="app-header__text-action" to="/login">
            {t("auth.register.headerAction")}
          </Link>
        }
      />
      <div className="screen auth-screen">
        <section className="panel auth-panel">
          <div className="auth-panel__copy">
            <h1>{t("auth.register.title")}</h1>
            <p>{t("auth.register.subtitle")}</p>
          </div>
          <form className="auth-form" onSubmit={(event) => void onSubmit(event)}>
            <label className="input-label">
              <span>{t("auth.name.label")}</span>
              <input
                type="text"
                className="text-input"
                placeholder={t("auth.name.placeholder")}
                autoComplete="name"
                {...form.register("name")}
              />
              {form.formState.errors.name ? (
                <span className="field-error">{form.formState.errors.name.message}</span>
              ) : null}
            </label>

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
                autoComplete="new-password"
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <span className="field-error">{form.formState.errors.password.message}</span>
              ) : null}
            </label>

            {submitError ? <div className="field-error">{submitError}</div> : null}

            <button type="submit" className="button accent button--full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t("auth.register.submitting") : t("auth.register.submit")}
            </button>
          </form>

          <div className="auth-switch">
            <span>{t("auth.switch.registerPrompt")}</span>
            <Link to="/login">{t("auth.switch.registerAction")}</Link>
          </div>
        </section>
      </div>
    </>
  );
}
