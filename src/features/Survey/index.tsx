import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm dòng này
import return_arrow from '../../shared/Assets/return_arrow.svg';
import bot_like from '../../shared/Assets/Mascots/bot_like.svg';
import bot_yay from '../../shared/Assets/Mascots/bot_yay.svg';
import bot_hi from '../../shared/Assets/Mascots/bot_hi.svg';

import money_icon from './Assets/money_icon.svg';
import ProcessBar from './Components/ProcessBar';
import BotAsk from './Components/BotAsk';
import OptionButton from './Components/OptionButton';
import GreetingScene from './Components/GreetingScene';
import CreateAccountScene from './Components/CreateAccountScene';

// Import data cấu hình
import { surveyQuestions } from './surveyData';

function SurveyPage() {
  const navigate = useNavigate(); // Thêm dòng này
  // --- BỔ SUNG: Dùng Lazy Init để đọc localStorage. Không cần useEffect. ---
  const [phase, setPhase] = useState<'greeting' | 'question' | 'create_account'>(() => {
    return localStorage.getItem('survey_job') ? 'create_account' : 'greeting';
  });

  const [greetingIndex, setGreetingIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = surveyQuestions[currentStep];
  const isOptionSelected = !!answers[currentQuestion.id];

  const greetings = [
    'Hi there, I am Cận !',
    'I will be your AI assistant today.',
    "Let's answer a few questions so I can help you better!",
  ];

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
      const jobMap: Record<string, string> = {
        job_1: 'Accountant',
        job_2: 'Marketing',
        job_3: 'Software Engineer',
        job_4: 'Designer',
        job_5: 'Teacher',
        job_6: 'Other',
      };
      const levelMap: Record<string, number> = {
        lvl_1: 1,
        lvl_2: 2,
        lvl_3: 3,
        lvl_4: 4,
        lvl_5: 5,
      };

      const selectedJob = jobMap[answers['q1_job']] || 'Other';
      const selectedLevel = levelMap[answers['q2_level']] || 1;

      localStorage.setItem('survey_job', selectedJob);
      localStorage.setItem('survey_level', selectedLevel.toString());

      // --- THAY VÌ NAVIGATE, TA CHUYỂN PHASE SANG TẠO TÀI KHOẢN ---
      setPhase('create_account');
    }
  };

  // --- BỔ SUNG CÁC HÀM XỬ LÝ ACTION MỚI ---
  const handleNextGreeting = () => {
    if (greetingIndex < greetings.length - 1) {
      setGreetingIndex((prev) => prev + 1);
    } else {
      setPhase('question');
    }
  };

  const handleCreateProfile = () => {
    // Chuyển tới roadmap và phát tín hiệu ngầm yêu cầu Layout mở form
    navigate('/roadmap', { state: { autoOpenSignup: true } });
  };

  const handleMaybeLater = () => {
    alert('This feature is still in developing process, you have to create account to use');
  };
  // ----------------------------------------

  const handleBack = () => {
    if (currentStep == 0) {
      navigate('/landing');
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      console.log('Exit survey');
    }
  };

  if (phase === 'greeting') {
    return (
      <GreetingScene
        mascotSrc={bot_hi}
        message={greetings[greetingIndex]}
        onNext={handleNextGreeting}
      />
    );
  }

  if (phase === 'create_account') {
    return (
      <CreateAccountScene
        mascotSrc={bot_yay}
        onCreateProfile={handleCreateProfile}
        onMaybeLater={handleMaybeLater}
      />
    );
  }

  // Phase mặc định là 'question' (Giữ nguyên giao diện render cũ của bạn)
  return (
    <div className="min-h-screen flex flex-col bg-white transition-all duration-300 animate-fadeIn">
      {/* ... Toàn bộ nội dung lưới câu hỏi, botAsk và footer của bạn giữ nguyên ở đây ... */}
      {/* Chỉ cần bao bọc lại bằng phần if/else ở trên là được */}
      {/* PHẦN NỘI DUNG CHÍNH */}
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

      {/* PHẦN FOOTER */}
      <div className="w-full border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-8 py-6 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!isOptionSelected}
            className={`text-white font-semibold text-[18px] px-9 py-[12px] rounded-[15px] transition-colors duration-200
                            ${
                              !isOptionSelected
                                ? 'bg-[#9DA9C9] cursor-not-allowed'
                                : 'bg-[#1E3A8A] hover:bg-[#112255] cursor-pointer'
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
