import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Write from "./pages/Write";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddBlog from "./pages/admin/AddBlog";
import Comments from "./pages/admin/Comments";
import ListBlog from "./pages/admin/ListBlog";
import Users from "./pages/admin/Users";
import Login from "./components/admin/Login";
import "quill/dist/quill.snow.css";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import NotFound from "./pages/NotFound";

const App = () => {

  const {token} = useAppContext()

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/write" element={<Write />} />
        <Route path="/write/:id" element={<Write />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/author/:id" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin" element={token ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path="addBlog" element={<AddBlog />} />
          <Route path="editBlog/:id" element={<AddBlog />} />
          <Route path="listBlog" element={<ListBlog />} />
          <Route path="comments" element={<Comments />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
