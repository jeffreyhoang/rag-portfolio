import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const SuccessCheck = () => {
  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
            <motion.div
                initial={{ opacity: 0, rotate: -200, scale: 0.3 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 text-9xl" />
            </motion.div>
        </div>
    );
};

export default SuccessCheck