import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [confirmState, setConfirmState] = useState(null);

  const confirm = ({
    title = "Are you sure?",
    message,
    confirmLabel,
    cancelLabel,
    danger,
  } = {}) =>
    new Promise((resolve) => {
      setConfirmState({ title, message, confirmLabel, cancelLabel, danger, resolve });
    });

  const resolveConfirm = (result) => {
    confirmState?.resolve(result);
    setConfirmState(null);
  };

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
      data.success ? setBlogs(data.blogs) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/me");
      if (data.success) setUser(data.user);
    } catch {
      // token invalid/expired — treat as logged out
    }
  };

  const loginUser = async (email, password) => {
    const { data } = await axios.post("/api/user/login", { email, password });
    if (data.success) {
      setUserToken(data.token);
      setUser(data.user);
      localStorage.setItem("userToken", data.token);
      axios.defaults.headers.common["x-auth-token"] = data.token;
    }
    return data;
  };

  const registerUser = async (name, email, password) => {
    const { data } = await axios.post("/api/user/register", {
      name,
      email,
      password,
    });
    if (data.success) {
      setUserToken(data.token);
      setUser(data.user);
      localStorage.setItem("userToken", data.token);
      axios.defaults.headers.common["x-auth-token"] = data.token;
    }
    return data;
  };

  const logoutUser = () => {
    localStorage.removeItem("userToken");
    delete axios.defaults.headers.common["x-auth-token"];
    setUserToken(null);
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    fetchBlogs();

    const adminToken = localStorage.getItem("token");
    if (adminToken) {
      setToken(adminToken);
      axios.defaults.headers.common["Authorization"] = `${adminToken}`;
    }

    const storedUserToken = localStorage.getItem("userToken");
    if (storedUserToken) {
      setUserToken(storedUserToken);
      axios.defaults.headers.common["x-auth-token"] = storedUserToken;
      fetchUser().finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    fetchBlogs,
    input,
    setInput,
    user,
    setUser,
    userToken,
    authLoading,
    loginUser,
    registerUser,
    logoutUser,
    confirm,
  };
  return (
    <AppContext.Provider value={value}>
      {children}
      <ConfirmDialog
        open={!!confirmState}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel}
        cancelLabel={confirmState?.cancelLabel}
        danger={confirmState?.danger}
        onConfirm={() => resolveConfirm(true)}
        onCancel={() => resolveConfirm(false)}
      />
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
