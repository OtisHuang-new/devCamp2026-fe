interface TopicFilterProps {
  topics: string[];
  activeTopic: string;
}

export function TopicFilter({ topics, activeTopic }: TopicFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-[8px] mb-[16px]">
      {topics.map((topic) => (
        <button
          key={topic}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTopic === topic
              ? 'bg-[#1A2E72] text-white'
              : 'bg-[#EAECEF] text-gray-800 hover:bg-gray-300'
          }`}
        >
          {topic}
        </button>
      ))}

      <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#EAECEF] text-gray-800 hover:bg-gray-300 transition-colors">
        More ...
      </button>
    </div>
  );
}
