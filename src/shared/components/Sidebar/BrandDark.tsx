import logo_dark from '../../Assets/logo_dark.svg';

function BrandDark() {
  return (
    <div className="flex items-center gap-3 px-4 py-6 cursor-pointer">
      <img src={logo_dark} alt="Cận Code Team Logo" className="w-10 h-10" />
      <span className="font-bold text-lg text-slate-800 tracking-wide">Cận Code Team</span>
    </div>
  );
}

export default BrandDark;
