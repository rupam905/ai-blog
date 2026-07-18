import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Login = () => {
  const {axios, setToken} = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      toast.error("Please fill in all fields correctly");
      return;
    }
    try {
      setLoading(true);
      const {data} = await axios.post('/api/admin/login', {email,password})
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
        axios.defaults.headers.common['Authorization'] = data.token;
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-paper px-4">
      <div className="w-full max-w-sm p-8 border border-ink/10 bg-white rounded-3xl shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <img src={assets.logo} alt="" className="w-32 mb-6" />
          <h1 className="font-serif text-2xl text-ink">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your credentials to access the dashboard
          </p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm text-gray-600 mb-1.5">
              Email
            </label>
            <input
              id="admin-email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              required
              placeholder="you@example.com"
              className="w-full p-3 border border-ink/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm text-gray-600 mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-3 border border-ink/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 font-medium text-sm bg-primary text-white rounded-full hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
