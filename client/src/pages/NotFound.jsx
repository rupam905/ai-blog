import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-gray-600 mt-2">Page not found</p>

      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-primary text-white rounded hover:opacity-90">
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
