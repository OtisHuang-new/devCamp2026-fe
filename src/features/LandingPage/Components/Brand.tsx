import LogoLight from '../../../shared/Brand/Assets/logo_white.svg';

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
