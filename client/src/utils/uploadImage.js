// Uploads a file straight from the browser to ImageKit using short-lived
// credentials from our server, so the file bytes never pass through our
// Express server (which, on Vercel, would otherwise reject bodies over
// ~4.5MB before the request even reaches our code). Returns the ImageKit
// file path, which the server turns into the final optimized URL.
export const uploadImage = async (axios, file) => {
  const { data: auth } = await axios.get("/api/upload/auth");
  if (!auth.success) {
    throw new Error(auth.message || "Could not get upload authorization");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", auth.publicKey);
  formData.append("signature", auth.signature);
  formData.append("expire", auth.expire);
  formData.append("token", auth.token);

  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: formData,
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Image upload failed");
  }

  return result.filePath;
};
