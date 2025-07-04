import { useState, useRef} from 'react';
import { PlusCircle, Send, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

type FormData = {
  questions: {
    text: string;
    correctAnswer: string;
  }[];
  weightedWords: string;
};

export function TeacherDashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useAuth();
  
  const { register, control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      questions: [{ text: '', correctAnswer: '' }],
      weightedWords: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: FormData) => {
    setIsAnalyzing(true);
    // Store questions in localStorage for student dashboard
    localStorage.setItem('assessmentQuestions', JSON.stringify(data.questions));
    localStorage.setItem('weighted', JSON.stringify(data.weightedWords));
    // console.log(data.questions[0].correctAnswer);
    setTimeout(() => setIsAnalyzing(false), 2000);
    alert("Assessment Created!")
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Teacher Dashboard
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-base">
          Welcome back, {user?.name || 'Teacher'}! Create and manage your assessments below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        <div className="bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-900 dark:to-purple-800 rounded-xl shadow-lg p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-purple-800 dark:text-purple-200">
            Questions
          </h2>
          
          <div className="space-y-6 sm:space-y-8">
            {fields.map((field, index) => (
              <div 
                key={field.id} 
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300">
                    Question {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <input
                      {...register(`questions.${index}.text`)}
                        
                      className="w-full rounded-lg border-2  border-purple-200 dark:border-purple-700 p-3 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition-colors text-base"
                      placeholder="Enter your question"
                    />
                  </div>
                  
                  <div>
                    <textarea
                      {...register(`questions.${index}.correctAnswer`)}
                      rows={3}
                      className="w-full rounded-lg border-2 border-yellow-200 dark:border-yellow-700 p-3 focus:border-yellow-400 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition-colors text-base"
                      placeholder="Enter the correct answer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => append({ text: '', correctAnswer: '' })}
            className="mt-4 sm:mt-6 flex items-center px-4 py-2 rounded-lg bg-purple-300 hover:bg-purple-400 dark:bg-purple-700 dark:hover:bg-purple-600 text-purple-800 dark:text-purple-100 transition-colors text-base"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Question
          </button>
        </div>

        <div className="bg-gradient-to-br from-yellow-200 to-yellow-300 dark:from-yellow-900 dark:to-yellow-800 rounded-xl shadow-lg p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-800 dark:text-yellow-200">
            Weighted Words
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 text-base">
            Add important keywords that should be given more weight during assessment.
          </p>
          <textarea
            {...register('weightedWords')}
            rows={3}
            className="w-full rounded-lg border-2 border-yellow-200 dark:border-yellow-700 p-3 focus:border-yellow-400 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition-colors text-base"
            placeholder="Enter important words (comma separated)"
          />
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-md text-white bg-gradient-to-r from-purple-600 to-yellow-600 hover:from-purple-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-1 text-base"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Create Assessment
            </>
          )}
        </button>
      </form>
    </div>
  );
}