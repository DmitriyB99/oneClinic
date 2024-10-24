import React from "react";

import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";

type PageTransitionProps = HTMLMotionProps<"div">;

export function PageTransition({ children, ...rest }: PageTransitionProps) {
  const onTheRight = { opacity: 0 };
  const inTheCenter = { opacity: 1 };
  const onTheLeft = { opacity: 0 };
  const transition = { duration: 0.3, ease: "easeInOut" };

  return (
    <motion.div
      initial={onTheRight}
      animate={inTheCenter}
      exit={onTheLeft}
      transition={transition}
      className="absolute left-0 top-0 h-full w-screen"
      {...rest}
    >
      {children}
    </motion.div>
  );
}
