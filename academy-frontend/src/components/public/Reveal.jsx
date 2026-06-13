"use client";

import { motion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  y = 40,
  duration = 0.7,
  className = ""
}) {

  return (

    <motion.div
      initial={{
        opacity: 0,
        y
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true,
        amount: 0.2
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.25, 0, 1]
      }}
      className={className}
    >

      {children}

    </motion.div>

  );

}