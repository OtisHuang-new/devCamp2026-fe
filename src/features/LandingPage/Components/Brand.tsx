import LogoLight from '@Assets/Brand/Assets/logo_white.svg';
// C:\Users\Admin\Desktop\devCamp2026\devCamp2026-fe\src\shared\Assets\Brand\Assets\logo_white.svg

function Brand() {
  return (
    <div className="w-full px-6 py-6">
      <div className="flex flex-row gap-2 items-center">
        <img src={LogoLight} className="w-8" alt="" />
        <span className="text-white text-xl font-semibold">Cận Code Team</span>
      </div>
    </div>
  );
}

export default Brand;
