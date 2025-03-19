import { motion } from 'framer-motion';
import { GraduationCap, School, BookOpen, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RoleSelection() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const roleCards = [
    {
      role: 'teacher',
      title: 'Teacher',
      icon: School,
      description: 'Create and grade assessments with our smart evaluation system',
      color: 'from-purple-300 to-purple-200 hover:from-purple-400 hover:to-purple-300',
      iconColor: 'text-purple-600'
    },
    {
      role: 'student',
      title: 'Student',
      icon: GraduationCap,
      description: 'Take assessments and get instant feedback on your performance',
      color: 'from-yellow-300 to-yellow-200 hover:from-yellow-400 hover:to-yellow-300',
      iconColor: 'text-yellow-600'
    }
  ];

  const handleRoleSelect = (role: string) => {
    if (isAuthenticated) {
      navigate(`/${role}`);
    } else {
      navigate('/auth');
    }
  };

  return (
    
    <div className="h-[100%] w-[100%] ">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {isAuthenticated && (
          <div className="flex justify-end mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-center">
              <span className="text-gray-700 dark:text-gray-300 mb-2 sm:mb-0 sm:mr-4 text-center sm:text-left text-base">
                Welcome, {user?.name || 'User'}
              </span>
              <button 
                onClick={logout}
                className="w-full sm:w-auto px-4 py-2 bg-purple-300 dark:bg-purple-700 text-purple-800 dark:text-purple-100 rounded-lg hover:bg-purple-400 dark:hover:bg-purple-600 transition-colors text-base"
              >
                Logout
              </button>
            </div>
          </div>
        )}
        
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent">
              Welcome to GradeIt
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 px-2">
              Smart Assessment Platform for Modern Education
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-12">
            <div className="flex items-center text-purple-600 dark:text-purple-300">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
              <span className="text-lg">Smart Grading</span>
            </div>
            <div className="flex items-center text-yellow-600 dark:text-yellow-300">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
              <span className="text-lg">Instant Feedback</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {roleCards.map((card) => (
            <motion.button
              key={card.role}
              onClick={() => handleRoleSelect(card.role)}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 sm:p-8 text-gray-800 dark:text-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl group`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <card.icon className={`w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 mx-auto ${card.iconColor} group-hover:scale-110 transition-transform duration-300`} />
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-[black]">{card.title}</h2>
              <p className="text-base sm:text-lg text-gray-700 ">
                {card.description}
              </p>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm sm:text-base">
            Experience the future of assessment with our intelligent grading system
          </p>
        </div>
      </div>
    </div>
  );
}