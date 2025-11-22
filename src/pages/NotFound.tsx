import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div 
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-9xl font-bold text-red-500 mb-4 drop-shadow-md" 
          variants={itemVariants}
        >
          404
        </motion.h1>
        <motion.p 
          className="text-2xl font-bold text-gray-800 mb-3" 
          variants={itemVariants}
        >
          Oops! Halaman tidak ditemukan
        </motion.p>
        <motion.p 
          className="text-gray-600 mb-8 text-base" 
          variants={itemVariants}
        >
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center" 
          variants={itemVariants}
        >
          <button 
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5 transition-transform"
            onClick={() => navigate('/')}
          >
            Kembali ke Beranda
          </button>
          <button 
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5 transition-transform"
            onClick={() => navigate(-1)}
          >
            Kembali
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;