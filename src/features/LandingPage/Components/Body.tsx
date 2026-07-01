import gemini from '../../../shared/Assets/gemini-png (1).png';
import Button from './Button';

interface BodyProps {
  onOpenLogin: () => void;
}

function Body({ onOpenLogin }: BodyProps) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="pt-20 w-full flex flex-col gap-[50px]">
        <div className="flex flex-col items-center">
          <span className="text-white text-6xl font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.6)]">
            Learning Code with Personalize
          </span>
          <div className="flex flex-row gap-2">
            <img src={gemini} className="w-6" alt="gemini icon" />
            <span className="text-white font-medium text-xl">AI technology integrated</span>
          </div>
        </div>

        <div className="flex flex-row justify-center">
          <div className="flex flex-col gap-3">
            <Button onOpenLogin={onOpenLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Body;
