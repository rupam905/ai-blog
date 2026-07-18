import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BlogList from "../components/BlogList";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (!target) return;
    if (location.hash === "#search-blogs") {
      target.focus();
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  return (
    <>
      <Navbar />
      <Header />
      <BlogList />
      <Newsletter />
      <Footer />
    </>
  );
};

export default Home;
