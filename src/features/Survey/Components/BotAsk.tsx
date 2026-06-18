interface BotAskProps {
  iconPath: string;
  text: string;
}

function BotAsk({ iconPath, text }: BotAskProps) {
  return (
    <div className="flex flex-row items-center gap-4 ">
      <img src={iconPath} alt="Bot assistant" className="w-[120px] h-[120px] object-contain " />

      <div className="relative mt-2">
        <div className="absolute w-3 h-3 bg-gray-200 transform rotate-45 -left-1.5 top-3 rounded-sm" />

        <div className="relative bg-gray-200 px-5 py-3 rounded-lg shadow-sm">
          <span className="text-gray-800 text-[18px] font-medium">{text}</span>
        </div>
      </div>
    </div>
  );
}

export default BotAsk;
