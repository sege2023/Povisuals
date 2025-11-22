import { AnimatePresence } from 'framer-motion';

interface CrossfadeGroupProps {
  children: React.ReactNode;
  mode?: 'wait' | 'sync';
}

export const CrossfadeGroup: React.FC<CrossfadeGroupProps> = ({ 
  children, 
  mode = 'wait' 
}) => (
  <AnimatePresence mode={mode}>
    {children}
  </AnimatePresence>
);