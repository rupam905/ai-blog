import imagekit from "../configs/imageKit.js";

// Issues short-lived credentials so the browser can upload a file straight
// to ImageKit, bypassing our server entirely. Needed because Vercel's
// serverless functions reject request bodies over ~4.5MB, which routing
// image uploads through Express would otherwise hit.
export const getUploadAuth = async (req, res) => {
  try {
    const { token, expire, signature } = imagekit.getAuthenticationParameters();
    res.json({
      success: true,
      token,
      expire,
      signature,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
