import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Question = {
  text: string;
  correctAnswer: string;
};

type FormData = {
  answers: Record<number, string>;
};

export function StudentDashboard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [ta, setta] = useState([]);
  const [ww, setww] = useState("");
  const { user } = useAuth();

  //@ts-ignore
  const { register, handleSubmit } = useForm<FormData>();

  const navigate = useNavigate();

  useEffect(() => {
    const storedQuestions = localStorage.getItem('assessmentQuestions');
    const weighted_words = localStorage.getItem('weighted');
    if (storedQuestions) {
      let a = JSON.parse(storedQuestions);
      //@ts-ignore
      let b=[];
      setQuestions(JSON.parse(storedQuestions));
      //@ts-ignore
      a.forEach(element => {
        b.push(element.correctAnswer);
      });
      //@ts-ignore
      setta(b);
    }
    //@ts-ignore
    setww(weighted_words);
  }, []);

  const onSubmit = async (data: FormData) => {
   
    setIsSubmitting(true);
    const dt = await (await axios.post('https://subjective-answer-checker.onrender.com/evaluate',{
      teacher_answers:ta,
      
      student_answers: data.answers,
      weighted_words: ww
    })).data;

    if(dt){
      console.log(dt)
      localStorage.setItem("ques", JSON.stringify(dt.question_scores))
      localStorage.setItem("total", JSON.stringify(dt.total_score))
      navigate('/score')


    }
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Student Dashboard
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-base">
          Welcome, {user?.name || 'Student'}! Complete your assessment below.
        </p>
      </div>

      {questions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 text-center">
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            No assessments available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            There are no assessments assigned to you yet. Please check back later.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          <div className="bg-gradient-to-br from-purple-200 to-yellow-300 dark:from-purple-900 dark:to-yellow-900 rounded-xl shadow-lg p-4 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-purple-800 dark:text-purple-200">
              Assessment Questions
            </h2>
            
            <div className="space-y-6 sm:space-y-8">
              {questions.map((question, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-2">
                      Question {index + 1}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 text-lg">
                      {question.text}
                    </p>
                    <textarea
                    //@ts-ignore
                      {...register(`answers.${index}`)}
                      rows={4}
                      className="w-full rounded-lg border-2 border-purple-200 dark:border-purple-700 p-3 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition-colors text-base"
                      placeholder="Enter your answer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-md text-white bg-gradient-to-r from-purple-600 to-yellow-600 hover:from-purple-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-1 text-base"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Answers
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}