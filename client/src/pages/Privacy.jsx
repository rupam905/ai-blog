import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Privacy = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
        <p className="text-xs font-medium tracking-widest uppercase text-primary mb-3">
          Legal
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: July 2026</p>

        <div className="rich-text max-w-none">
          <h2>What we collect</h2>
          <p>
            When you create an account we store your name, email address, and
            a securely hashed password (we never store your password in
            plain text). If you add a bio or profile photo, that's stored
            too. When you publish a post or comment, we store the content
            you write along with your author reference. We also keep track
            of likes, bookmarks, and follows so those features work.
          </p>

          <h2>How we use it</h2>
          <p>
            Your data is used to run the core features of the site: showing
            your name and avatar on your posts and comments, letting other
            readers follow you, and keeping your bookmarks in sync across
            visits. We don't sell your data or share it with advertisers.
          </p>

          <h2>Third-party services</h2>
          <p>
            Profile photos and post images are stored and served through{" "}
            <strong>ImageKit</strong>. If you use the "Generate with AI"
            writing assistant, your prompt is sent to <strong>Google
            Gemini</strong> to produce a draft. Neither service receives your
            password or email address.
          </p>

          <h2>Cookies and local storage</h2>
          <p>
            We use your browser's local storage (not tracking cookies) to
            keep you signed in between visits, by storing a session token.
            Clearing your browser storage will sign you out.
          </p>

          <h2>Your choices</h2>
          <p>
            You can edit or remove your bio and avatar at any time from your
            profile. Self-serve account deletion isn't available yet — email
            us via the{" "}
            <Link to="/contact" className="text-primary hover:underline">
              contact page
            </Link>{" "}
            and we'll remove your account and content.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If this policy changes in a meaningful way, we'll update the date
            at the top of this page.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
