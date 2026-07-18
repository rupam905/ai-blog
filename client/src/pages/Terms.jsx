import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Terms = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
        <p className="text-xs font-medium tracking-widest uppercase text-primary mb-3">
          Legal
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: July 2026</p>

        <div className="rich-text max-w-none">
          <h2>1. Your account</h2>
          <p>
            You need an account to publish posts or comment. You're
            responsible for keeping your login details secure and for
            anything posted from your account.
          </p>

          <h2>2. Your content</h2>
          <p>
            You own what you write. By publishing on QuickBlog, you give us a
            license to host, display, and distribute your content on the
            platform so other readers can see it. You can edit or delete your
            own posts at any time from your profile.
          </p>

          <h2>3. Acceptable use</h2>
          <p>
            Don't post content that is illegal, harassing, or infringes on
            someone else's rights. Don't use the platform to spam, impersonate
            others, or attempt to interfere with the site's normal operation.
            We may remove content or suspend accounts that violate these
            rules.
          </p>

          <h2>4. The verified badge</h2>
          <p>
            The verified badge is granted at our discretion to authors we
            consider trustworthy. It is not for sale and can be revoked at
            any time.
          </p>

          <h2>5. No warranty</h2>
          <p>
            QuickBlog is provided "as is." We don't guarantee the service will
            be uninterrupted or error-free, and we're not liable for content
            posted by other users.
          </p>

          <h2>6. Changes</h2>
          <p>
            We may update these terms as the platform evolves. Continuing to
            use QuickBlog after a change means you accept the updated terms.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
