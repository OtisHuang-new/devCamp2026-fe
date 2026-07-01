import { useNavigate } from 'react-router-dom';

interface ButtonProps {
  onOpenLogin: () => void;
}
function Button({ onOpenLogin }: ButtonProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate('/survey')}
        className="bg-white text-xl text-primary px-28 py-3 flex justify-center items-center drop-shadow-[0_0_3px_#ffffff] rounded-[4px] font-bold transition-all hover:scale-105 active:scale-95"
      >
        Start now !
      </button>

      <button
        onClick={onOpenLogin}
        className="bg-primary border text-xl border-white/40 px-28 py-3 text-white flex justify-center items-center drop-shadow-[0_0_2px_#ffffff] rounded-[4px] font-medium transition-all hover:bg-[#081A4F] active:scale-95"
      >
        I Already have an account
      </button>
    </div>
  );
}

export default Button;
