import clsx from "clsx";

export const ProBadge = ({ className }: { className?: string }) => (
  <div
    className={clsx(
      "h-fit w-fit rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-2 py-1 text-Bold12 text-white",
      className
    )}
  >
    Pro
  </div>
);
