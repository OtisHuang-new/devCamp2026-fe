import { useModalStore } from '../../store/useModalStore';

interface AuthGatekeeperProps {
  title: string;
  subtitle: string;
  promptText: string;
}

export function AuthGatekeeper({ title, subtitle, promptText }: AuthGatekeeperProps) {
  const openLogin = useModalStore((state) => state.openLogin);

  return (
    <div className="flex flex-col items-center justify-center w-full mt-24 animate-fadeIn">
      <h1 className="text-[42px] font-extrabold text-primary text-center">{title}</h1>
      <p className="text-[18px] text-primary mb-10 font-medium text-center opacity-90">
        {subtitle}
      </p>

      <div className="relative w-full max-w-3xl">
        {/* Khối vuông trang trí trên-trái */}
        <div className="absolute -top-5 -left-5 w-24 h-16 bg-primary rounded-lg z-0"></div>

        {/* Khối vuông trang trí dưới-phải */}
        <div className="absolute -bottom-5 -right-5 w-24 h-16 bg-primary rounded-lg z-0"></div>

        {/* Thẻ trắng nổi lên (Main Card) */}
        <div className="relative z-10 bg-white rounded-xl shadow-[0_8px_20px] shadow-primary/30 px-6 py-8 flex items-center justify-between">
          <span className="text-primary font-medium text-[16px]">{promptText}</span>
          <button
            onClick={openLogin}
            className="bg-primary text-white font-bold px-8 py-2.5 rounded-[6px] hover:bg-[#112255] transition-colors shadow-md active:scale-95"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
