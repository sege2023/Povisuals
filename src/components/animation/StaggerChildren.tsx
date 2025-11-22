import { motion, HTMLMotionProps } from 'framer-motion';
import React, { ReactNode } from 'react';

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  stagger?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  stagger = 0.2,
  ...props
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: stagger }
      }
    }}
    {...props}
  >
    {children}
  </motion.div>
);

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ children, ...props }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
);