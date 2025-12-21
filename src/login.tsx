import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { appWindow } from "@tauri-apps/api/window";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(localStorage.getItem("savedEmail") || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(localStorage.getItem("rememberMe") === "true");

  useEffect(() => {
    if (localStorage.getItem("rememberMe") === "true") {
      navigate("/onboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/\S+@\S+\.\S+/.test(email))
      return setError("Please enter a valid email.");

    if (password.length < 6)
      return setError("Password must be at least 6 characters.");

    setLoading(true);

    try {
      const res = await fetch("https://26.28.39.1:8080/routes/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Invalid email or password");
      }

      // Save auth token
      localStorage.setItem("token", data.token);

      // Remember Me
      if (remember) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("rememberMe");
      }

      navigate("/onboard");
    } catch (err: any) {
      setError(err.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[1500px] h-[800px] flex relative select-none overflow-hidden font-sans">
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://i.ibb.co/fzJx9sB8/image-1.webp"
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      <div
        className="absolute top-0 left-0 w-full h-10 flex justify-between items-center px-4 text-white font-semibold bg-black/80 z-50"
        style={{ WebkitAppRegion: "drag" } as any}
      >
        <span>Nexus Launcher - Online</span>
        <div className="flex gap-2">
          <button
            onClick={() => appWindow.minimize()}
            className="w-7 h-7 flex items-center justify-center hover:bg-white/20 rounded"
            style={{ WebkitAppRegion: "no-drag" } as any}
          >
            -
          </button>
          <button
            onClick={() => appWindow.close()}
            className="w-7 h-7 flex items-center justify-center hover:bg-red-600 rounded"
            style={{ WebkitAppRegion: "no-drag" } as any}
          >
            X
          </button>
        </div>
      </div>

      <div className="w-[460px] h-full bg-black/80 backdrop-blur-xl border-r border-white/10 flex flex-col px-10 py-10 z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col flex-1"
        >
          <img
            src="https://i.ibb.co/BHXyFNwH/TLogo-Trident.png"
            alt="Logo"
            className="w-32 mb-10 self-center drop-shadow-lg"
          />

          <h1 className="text-4xl font-bold mb-6 text-white text-center">
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col">
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full mt-1 px-4 py-3 bg-neutral-900/90 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col relative">
              <label className="text-sm text-gray-300">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full mt-1 px-4 py-3 bg-neutral-900/90 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-300"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember Me
            </label>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-400/30 rounded-lg p-2">
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
