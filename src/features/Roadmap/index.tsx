import Sidebar from '../../shared/Sidebar';
import UserProfileCard from '../../shared/UserProfileCard';
import HeaderInfo from './Components/HeaderInfo';
import LessonButton from './Components/LessonButton';

// Import Assets
import star_icon from './Assets/star_icon_white.svg';
import cup_icon from './Assets/cup_icon_white.svg';
import treasure_icon from './Assets/treasure_icon_prime.svg';

function Roadmap() {
  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* 1. Sidebar cố định */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {/* UserProfileCard: Đặt tuyệt đối hoặc dùng flex để đẩy sang phải */}
        <div className="absolute top-3 right-10 z-30">
          <UserProfileCard userName="Nguyễn Văn A" />
        </div>

        <div className="w-full max-w-4xl mx-auto pb-20">
          {/* Header Info: Sticky bên trong main */}
          <HeaderInfo
            chapterTitle="Chapter 0"
            lessonTitle="Lesson 1: Get Familiar with Python"
            onBackClick={() => console.log('Back clicked')}
          />

          {/* Roadmap Path: Nơi các nút bài học hiển thị */}
          <div className="mt-16 flex flex-col pl-[300px] gap-8 relative">
            {/* Ví dụ về các bài học xếp so le như thiết kế */}
            <div className="translate-x-10">
              <LessonButton iconPath={star_icon} />
            </div>

            <div className="-translate-x-12">
              <LessonButton iconPath={star_icon} />
            </div>

            {/* Cái rương không nằm trong hình tròn */}
            <div className="-translate-x-32 my-4">
              <img
                src={treasure_icon}
                alt="Treasure"
                className="w-[120px] cursor-pointer transition-transform"
              />
            </div>

            <div className="-translate-x-12">
              <LessonButton iconPath={star_icon} />
            </div>

            <div className="translate-x-4">
              <LessonButton largerIcon={true} iconPath={cup_icon} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Roadmap;
