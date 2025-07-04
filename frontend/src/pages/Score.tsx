import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

type Question = {
  text: string;
  correctAnswer: string;
};

type FormData = {
  answers: Record<number, string>;
};

export function Score() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  //@ts-ignore
  const [questions, setQuestions] = useState([]);
   //@ts-ignore
  const [total, settotal] = useState([]);
  const { user } = useAuth();
  
  

  useEffect(() => {
    const ques = localStorage.getItem('ques');
    const ttl = localStorage.getItem('total');
    if (ques && ttl) {
      setQuestions(JSON.parse(ques));
      settotal(JSON.parse(ttl));
    }
  }, []);

  
  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Score
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-base">
          Welcome, {user?.name || 'Student'}! Here is your score.
        </p>
      </div>


      {questions.map((item,index)=>(
         <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ques{index+1} Score
         </h1>
         <p className="text-gray-700 dark:text-gray-300 text-base">
           {item}
         </p>
       </div>
      ))}

     


      {/* <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
         Ques2 Score
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-base">
        {questions[0]}
        </p>
      </div> */}


      <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
         Total Score
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-base">
          {total}
        </p>
      </div>

      
    </div>
  );
}