interface BotAskProps {
  iconPath: string;
  text: string;
}

function BotAsk({ iconPath, text }: BotAskProps) {
  return (
    // Dùng items-start để con bot luôn nằm trên cùng nếu text quá dài xuống nhiều dòng
    <div className="flex flex-row items-start gap-4">
      {/* Avatar Bot */}
      <img src={iconPath} alt="Bot assistant" className="w-16 h-16 object-contain" />

      {/* Khối Bubble Chat */}
      <div className="relative mt-2">
        {/* Cái đuôi của bubble chat (tam giác trỏ sang trái).
                    Bản chất là một hình vuông xoay 45 độ, được đẩy lùi sang trái (-left-1.5).
                */}
        <div className="absolute w-3 h-3 bg-gray-200 transform rotate-45 -left-1.5 top-3 rounded-sm" />

        {/* Nội dung text (nền xám, bo góc, padding) */}
        <div className="relative bg-gray-200 px-5 py-3 rounded-lg shadow-sm">
          <span className="text-gray-800 text-base font-medium">{text}</span>
        </div>
      </div>
    </div>
  );
}

export default BotAsk;
