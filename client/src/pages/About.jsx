import { Link } from "react-router-dom";
import { PenSquare, Sparkles, Users2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const points = [
  {
    icon: PenSquare,
    title: "Write freely",
    body: "Anyone can create an account and publish a post — no gatekeeping, no waiting for approval. Your writing goes live the moment you hit publish.",
  },
  {
    icon: Sparkles,
    title: "AI-assisted, human-led",
    body: "Stuck on a first draft? Generate a starting point with AI, then make it yours. The byline is always the person who wrote and shaped the piece.",
  },
  {
    icon: Users2,
    title: "A real community",
    body: "Follow writers you like, bookmark posts to read later, and join the conversation in the comments. Trusted authors get a verified badge from the team.",
  },
];

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
        <p className="text-xs font-medium tracking-widest uppercase text-primary mb-3">
          About
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-6">
          A space for ideas, written by anyone
        </h1>
        <p className="text-gray-500 leading-relaxed">
          QuickBlog started as a simple idea: writing online shouldn't require
          permission. It's a place to think out loud, share what you're
          learning, and read stories from people outside your usual feed —
          on technology, startups, lifestyle and finance.
        </p>

        <div className="mt-12 grid sm:grid-cols-1 gap-6">
          {points.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex gap-4 p-6 rounded-2xl border border-ink/10 bg-white">
              <div className="w-11 h-11 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-ink">{title}</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-gray-500">
          Have a question or found a bug? Visit our{" "}
          <Link to="/contact" className="text-primary font-medium hover:underline">
            contact page
          </Link>
          .
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
