import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { signInWithPassword, authError, clearAuthError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const visibleError = localError || authError;
  const canSubmit = email.trim().length > 0 && password.length > 0 && !loggingIn;

  function resetErrors() {
    if (localError) {
      setLocalError("");
    }

    if (authError) {
      clearAuthError();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    try {
      resetErrors();
      setLoggingIn(true);

      await signInWithPassword(email.trim(), password);
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Failed to sign in.",
      );
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0D10] p-4 text-slate-100">
      <section className="w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-[#111318] shadow-2xl shadow-black/40">
        <div className="bg-gradient-to-br from-blue-500/[0.12] via-violet-500/[0.08] to-transparent p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0B0D10] text-sm font-black text-white">
              AS
            </div>

            <div>
              <p className="text-lg font-black text-white">Adi Studios</p>
              <p className="text-xs font-semibold text-slate-500">
                Production HQ
              </p>
            </div>
          </div>

          <h1 className="mt-7 text-4xl font-black tracking-tight text-white">
            Sign in
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Enter your account details to continue.
          </p>

          <div className="mt-6 h-1 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-transparent" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6" noValidate>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-300">
              Email
            </span>

            <input
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                resetErrors();
              }}
              type="email"
              inputMode="email"
              autoComplete="username"
              autoFocus
              disabled={loggingIn}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-[#0B0D10] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/70 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-300">
              Password
            </span>

            <div className="flex items-center rounded-lg border border-white/10 bg-[#0B0D10] transition focus-within:border-blue-500/70">
              <input
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  resetErrors();
                }}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                disabled={loggingIn}
                placeholder="Enter password"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                disabled={loggingIn}
                className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-500 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </label>

          {visibleError && (
            <div
              role="alert"
              className="flex gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm font-semibold leading-6 text-red-300"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{visibleError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingIn && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {loggingIn ? "Signing in..." : "Sign In"}
          </button>

          <p className="pt-2 text-center text-xs font-semibold text-slate-500">
            No public signup. Ask admin for access.
          </p>
        </form>
      </section>
    </main>
  );
}