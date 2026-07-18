import { useRef, useState } from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
  const inputRef = useRef();
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Thanks for subscribing!");
      inputRef.current.value = "";
      setLoading(false);
    }, 400);
  };

  return (
    <div className="mx-8 sm:mx-16 xl:mx-24">
      <div className="bg-ink text-paper rounded-3xl px-6 sm:px-16 py-16 sm:py-20 text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-primary/80 mb-3">
          Newsletter
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl mb-3">
          Never miss a story
        </h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          One email, every week — the best new writing on tech, startups and
          life, straight to your inbox.
        </p>
        <form
          onSubmit={onSubmitHandler}
          noValidate
          className="flex items-center max-w-md mx-auto bg-white/5 border border-white/15 rounded-full p-1 focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
          <input
            ref={inputRef}
            type="email"
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 text-sm bg-transparent outline-none text-paper placeholder:text-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 bg-primary text-white text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer">
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-500">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default Newsletter;
