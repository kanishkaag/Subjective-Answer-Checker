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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const dt = await (await axios.post('http://127.0.0.1:5000/evaluate',{
      teacher_answers:["An ecosystem refers to a community of living organisms (biotic components) interacting with each other and their physical environment (abiotic components) in a specific area. Ecosystems can vary widely in size and can encompass everything from a small pond to a vast rainforest or even the entire planet. They are dynamic and complex systems where various species coexist and interact with each other and their surroundings.", "Biodiversity, short for biological diversity, refers to the variety of life on Earth at all levels of biological organization. It encompasses the diversity of species, ecosystems, and genetic diversity within species. Biodiversity is a measure of the richness and variety of living organisms in a given area, including the variety of plants, animals, fungi, and microorganisms, the genetic differences within these species, and the ecosystems they form."],
      
      student_answers: ["An ecosystem refers to a community of living organisms, including plants, animals, and microorganisms, interacting with each other and their physical environment. It involves the complex web of relationships and interdependencies between different species and their surrounding environment.", "Biodiversity, a contraction of biological diversity, denotes the wide array of life on Earth across various biological levels. It encompasses the diversity found within species, ecosystems, and the genetic variations existing among species. Biodiversity serves as an indicator of the abundance and assortment of living organisms within a specific region, encompassing plants, animals, fungi, and microorganisms. This includes the genetic distinctions within these species and the intricate ecosystems they collectively constitute."],
      weighted_words: "biotic, abiotic, microorganisms,plants, animals, fungi,biological,organization, species, ecosystems"
    })).data;

    if(dt){
      console.log(dt)
    }
    setTimeout(() => setIsSubmitting(false), 2000);
  };

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

      <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
         Ques1 Score
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-base">
          {questions[0]}
        </p>
      </div>
      <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
         Ques2 Score
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-base">
        {questions[0]}
        </p>
      </div>
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