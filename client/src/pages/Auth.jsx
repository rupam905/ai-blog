import { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Auth = () => {
  const { loginUser, registerUser, navigate } = useAppContext();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = isLogin
        ? await loginUser(email, password)
        : await registerUser(name, email, password);

      if (data.success) {
        toast.success(isLogin ? "Welcome back!" : "Account created!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-paper px-4">
      <div className="w-full max-w-sm p-8 border border-ink/10 bg-white rounded-3xl shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={assets.logo}
            alt=""
            className="w-32 mb-6 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <h1 className="font-serif text-2xl text-ink">
            {isLogin ? "Welcome back" : "Join QuickBlog"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLogin
              ? "Log in to write, comment and follow authors"
              : "Create an account to start writing"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label htmlFor="auth-name" className="block text-sm text-gray-600 mb-1.5">
                Name
              </label>
              <input
                id="auth-name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
                placeholder="Your name"
                className="w-full p-3 border border-ink/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
              />
            </div>
          )}
          <div>
            <label htmlFor="auth-email" className="block text-sm text-gray-600 mb-1.5">
              Email
            </label>
            <input
              id="auth-email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              required
              placeholder="you@example.com"
              className="w-full p-3 border border-ink/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="block text-sm text-gray-600 mb-1.5">
              Password
            </label>
            <input
              id="auth-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              required
              minLength={isLogin ? undefined : 8}
              placeholder={isLogin ? "••••••••" : "At least 8 characters"}
              className="w-full p-3 border border-ink/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 font-medium text-sm bg-primary text-white rounded-full hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer">
            {loading ? "Please wait..." : isLogin ? "Login" : "Create account"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? "New to QuickBlog?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(isLogin ? "register" : "login")}
            className="text-primary font-medium hover:underline cursor-pointer">
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
