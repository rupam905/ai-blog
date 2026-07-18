import { Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
        <p className="text-xs font-medium tracking-widest uppercase text-primary mb-3">
          Contact
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-6">
          Get in touch
        </h1>
        <p className="text-gray-500 leading-relaxed max-w-xl">
          Questions about your account, a bug you've spotted, or feedback on
          the platform — we'd like to hear it. Drop us an email and we'll get
          back to you as soon as we can.
        </p>

        <a
          href="mailto:hello@quickblog.example"
          className="mt-8 inline-flex items-center gap-3 p-5 rounded-2xl border border-ink/10 bg-white hover:shadow-md transition-shadow">
          <span className="w-11 h-11 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </span>
          <span>
            <span className="block font-medium text-ink">hello@quickblog.example</span>
            <span className="block text-sm text-gray-500">
              We usually reply within 2 business days
            </span>
          </span>
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
