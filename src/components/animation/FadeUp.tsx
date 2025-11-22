import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface FadeUpProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  duration?: number;
  once?: boolean;
}

const FadeUp: React.FC<FadeUpProps> = ({ 
  children, 
  duration = 0.8,
  once = true,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-100px" }}
      transition={{ duration, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeUp;


