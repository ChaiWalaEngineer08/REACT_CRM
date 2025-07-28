import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import ThreeBG from "../components/ThreeBG";
import { useAuth } from "../context/AuthContext";
import { LOGIN_HEADLINE } from "../constants/login.constant";

const EMAIL_RX = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;

export default function Login() {
  const { login, logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    logout();
  }, [logout]);

  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string).trim();
    const password = (fd.get("password") as string).trim();

    setEmailErr(null);
    setPwErr(null);

    if (!EMAIL_RX.test(email)) return setEmailErr("Invalid e-mail address");
    if (password.length < 5) return setPwErr("Min 5 characters");

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome!", { autoClose: 1800 });
      nav("/dashboard", { replace: true });
    } catch (err: any) {
      if (err.response?.status === 401) {
        setPwErr("Incorrect e-mail or password");
      } else {
        toast.error("Login failed – server unavailable");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      role="main"
      className="relative min-h-screen flex items-center justify-center pr-12 overflow-hidden"
    >
      <ThreeBG />

      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-12 w-full text-center text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg pointer-events-none"
      >
        {LOGIN_HEADLINE}
      </motion.h1>

      {/* card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ y: -6, boxShadow: "0 18px 35px rgba(0,0,0,.25)" }}
        className="relative w-full max-w-md group"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-sm opacity-60 group-hover:opacity-90 transition" />
        <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <h2
            id="login-heading"
            className="text-3xl font-extrabold text-gray-800 mb-6 text-center"
          >
            Sign&nbsp;in
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            aria-labelledby="login-heading"
          >
            {/* e-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                disabled={loading}
                aria-invalid={!!emailErr}
                aria-describedby={emailErr ? "email-error" : undefined}
                className={`w-full px-4 py-2 rounded-lg bg-white/70 border
                  ${emailErr ? "border-rose-500" : "border-gray-300"}
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  focus:ring-indigo-400 transition`}
              />
              {emailErr && (
                <p id="email-error" role="alert" className="mt-1 text-sm text-rose-600">
                  {emailErr}
                </p>
              )}
            </div>

            {/* password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  disabled={loading}
                  aria-invalid={!!pwErr}
                  aria-describedby={pwErr ? "password-error" : undefined}
                  className={`w-full pr-10 px-4 py-2 rounded-lg bg-white/70 border
                    ${pwErr ? "border-rose-500" : "border-gray-300"}
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-indigo-400 transition`}
                />
                <InputAdornment
                  position="end"
                  component="div"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <IconButton
                    edge="end"
                    tabIndex={0}
                    onClick={() => setShowPw((p) => !p)}
                    size="small"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              </div>
              {pwErr && (
                <p id="password-error" role="alert" className="mt-1 text-sm text-rose-600">
                  {pwErr}
                </p>
              )}
            </div>

            {/* submit */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg font-semibold text-white
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-500 hover:to-purple-500
                focus:ring-2 focus:ring-offset-2 focus:ring-purple-400
                transition flex items-center justify-center"
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
