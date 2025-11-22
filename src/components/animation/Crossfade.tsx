import { motion, HTMLMotionProps } from 'framer-motion';
import React, { ReactNode } from 'react';

interface CrossfadeProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  duration?: number;
  key: string | number;
}

export const Crossfade: React.FC<CrossfadeProps> = ({
  children,
  duration = 0.5,
  key,
  ...props
}) => (
  <motion.div
    key={key}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration }}
    {...props}
  >
    {children}
  </motion.div>
);