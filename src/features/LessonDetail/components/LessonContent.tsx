// Vị trí: src/features/LessonDetail/components/LessonContent.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import type { LessonDataAPI } from '../types/lessonTypes';

interface LessonContentProps {
  data: LessonDataAPI;
}

function LessonContent({ data }: LessonContentProps) {
  return (
    <div className="w-full animate-fadeIn">
      {/* 1. Main Title */}
      <h1 className="text-4xl font-bold text-[#1E3A8A] border-t border-gray-200 py-8">
        Lesson {data.order}: {data.title}
      </h1>

      {/* 2. Markdown Content */}
      <div className="text-slate-700 leading-relaxed font-medium space-y-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h2: ({ node, ...props }) => (
              <h2 className="text-2xl font-extrabold text-slate-800 mt-8 mb-4" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3" {...props} />
            ),
            p: ({ node, ...props }) => <p className="mb-4" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc ml-6 space-y-2 mb-4" {...props} />,
            ol: ({ node, ...props }) => (
              <ol className="list-decimal ml-6 space-y-2 mb-4" {...props} />
            ),
            li: ({ node, ...props }) => <li className="text-base" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-[#1E3A8A] bg-blue-50/50 p-4 italic text-gray-600 my-4"
                {...props}
              />
            ),
            a: ({ node, ...props }) => (
              <a className="text-[#1E3A8A] font-bold underline hover:opacity-80" {...props} />
            ),
            table: ({ node, ...props }) => (
              <table
                className="min-w-full border-collapse border border-gray-200 my-6"
                {...props}
              />
            ),
            th: ({ node, ...props }) => (
              <th
                className="border border-gray-200 bg-gray-50 px-4 py-3 text-left font-bold"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td className="border border-gray-200 px-4 py-3" {...props} />
            ),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            code: ({ node, inline, ...props }: any) =>
              inline ? (
                <code
                  className="bg-gray-100 text-red-500 px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                />
              ) : (
                <code
                  className="block bg-[#1E1E1E] text-white p-4 rounded-xl my-4 overflow-x-auto text-sm font-mono shadow-sm"
                  {...props}
                />
              ),
          }}
        >
          {data.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default LessonContent;
