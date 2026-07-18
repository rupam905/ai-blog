import { CheckBadgeIcon } from "@heroicons/react/20/solid";

export const Avatar = ({ src, name, className = "w-20 h-20 text-2xl" }) =>
  src ? (
    <img src={src} alt={name} className={`${className} rounded-full object-cover`} />
  ) : (
    <div
      className={`${className} rounded-full bg-ink text-white flex items-center justify-center font-serif shrink-0`}>
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );

export const VerifiedBadge = ({ className = "w-4 h-4" }) => (
  <CheckBadgeIcon
    className={`${className} text-blue-500 shrink-0`}
    aria-label="Verified"
  />
);
