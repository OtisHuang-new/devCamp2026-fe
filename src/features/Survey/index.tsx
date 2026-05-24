import { useState } from 'react';
import return_arrow from '../../shared/Assets/return_arrow.svg';
import bot_like from '../../shared/Assets/bot_like.svg';
import money_icon from '../../shared/Assets/money_icon.svg';

import ProcessBar from './Components/ProcessBar';
import BotAsk from './Components/BotAsk';
import OptionButton from './Components/OptionButton';

// Import data cấu hình
import { surveyQuestions } from './surveyData';

function SurveyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = surveyQuestions[currentStep];

  // Biến kiểm tra xem người dùng đã chọn option cho câu hỏi hiện tại chưa
  const isOptionSelected = !!answers[currentQuestion.id];

  const handleOptionSelect = (optionId: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionId,
    });
  };

  const handleContinue = () => {
    if (!isOptionSelected) return;

    if (currentStep < surveyQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Survey completed! Final Answers:', answers);
      alert('Survey Completed! Check console for data.');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      console.log('Exit survey');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white transition-all duration-300">
      {/* --- PHẦN NỘI DUNG CHÍNH --- */}
      <div className="py-8 px-8 max-w-4xl mx-auto w-full flex-1">
        {/* 1. Thanh Top/Process */}
        <div className="flex flex-row items-center gap-4 mb-8">
          <img
            src={return_arrow}
            alt="Go back"
            className="w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={handleBack}
          />
          <ProcessBar progress={currentQuestion.progress} />
        </div>

        {/* 2. Bot & Bubble chat */}
        <div className="mb-10">
          <BotAsk iconPath={bot_like} text={currentQuestion.botText} />
        </div>

        {/* 3. Lưới câu hỏi */}
        <div className="mb-12 flex justify-center">
          <div
            className={`grid gap-6 w-fit ${currentQuestion.layout === 'grid-nx1' ? 'grid-cols-1' : 'grid-cols-2'}`}
          >
            {currentQuestion.options.map((option) => (
              <OptionButton
                key={option.id}
                text={option.text}
                iconPath={money_icon}
                layout={currentQuestion.layout}
                isSelected={answers[currentQuestion.id] === option.id}
                onClick={() => handleOptionSelect(option.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- PHẦN FOOTER --- */}
      <div className="w-full border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-8 py-6 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!isOptionSelected} // Vô hiệu hóa click khi chưa chọn
            className={`text-white font-semibold text-[17px] px-10 py-3 rounded-full transition-colors duration-200
                            ${
                              !isOptionSelected
                                ? 'bg-[#9DA9C9] cursor-not-allowed' // State: Chưa chọn
                                : 'bg-[#1E3A8A] hover:bg-[#112255] cursor-pointer' // State: Đã chọn
                            }
                        `}
          >
            {currentStep === surveyQuestions.length - 1 ? 'Finish' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SurveyPage;
