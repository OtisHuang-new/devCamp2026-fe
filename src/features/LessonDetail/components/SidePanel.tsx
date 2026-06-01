import bot_like from '../../../shared/Assets/Mascots/bot_like.svg';
import icon_sent_white from '../assets/icon_sent_white.svg';

const SidePanel = ({ videoUrl }: { videoUrl?: string }) => {
  return (
    <div className="w-full h-full flex flex-col p-6 gap-6 bg-[#F9FAFB]">
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm bg-black">
        <iframe
          className="w-full h-full"
          src={videoUrl || ''}
          title="Lesson Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-white">
          <h3 className="font-bold text-[#1E3A8A]">AI Assistant</h3>
        </div>

        <div className="flex-1 p-4 flex flex-col justify-center items-center text-center">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
            <img src={bot_like} className="w-10"></img>
          </div>
          <p className="text-gray-400 italic text-sm px-10">
            If you have any question, just ask me, I can help!
          </p>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your message..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="flex items-center justify-center bg-[#1E3A8A] text-white pl-2 pr-1.5 pt-1 rounded-[9999px]">
              <img src={icon_sent_white} className="w-6"></img>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
