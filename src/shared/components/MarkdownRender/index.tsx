import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Tường minh Type, tuyệt đối không dùng any
export interface CodeProps extends ComponentPropsWithoutRef<'code'> {
  inline?: boolean;
  node?: unknown;
}

interface MarkdownRenderProps {
  content: string;
  className?: string;
}

// HÀM TIỆN ÍCH (PURE FUNCTION):
// Clone props và xóa thuộc tính 'node' để không gây lỗi React DOM, đồng thời không sinh ra biến thừa để pass 100% ESLint.
function omitNode<T extends { node?: unknown }>(props: T): Omit<T, 'node'> {
  const result = { ...props };
  delete result.node;
  return result;
}

export function MarkdownRender({
  content,
  className = 'text-slate-700 leading-relaxed font-medium space-y-4',
}: MarkdownRenderProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Gọi hàm omitNode thay vì destructuring, code cực kỳ gọn gàng và không có biến thừa
          h2: (props) => (
            <h2 className="text-2xl font-extrabold text-slate-800 mt-8 mb-4" {...omitNode(props)} />
          ),
          h3: (props) => (
            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3" {...omitNode(props)} />
          ),
          p: (props) => <p className="mb-4" {...omitNode(props)} />,
          ul: (props) => <ul className="list-disc ml-6 space-y-2 mb-4" {...omitNode(props)} />,
          ol: (props) => <ol className="list-decimal ml-6 space-y-2 mb-4" {...omitNode(props)} />,
          li: (props) => <li className="text-base" {...omitNode(props)} />,
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-[#1E3A8A] bg-blue-50/50 p-4 italic text-gray-600 my-4"
              {...omitNode(props)}
            />
          ),
          a: (props) => (
            <a
              className="text-[#1E3A8A] font-bold underline hover:opacity-80"
              {...omitNode(props)}
            />
          ),
          table: (props) => (
            <table
              className="min-w-full border-collapse border border-gray-200 my-6"
              {...omitNode(props)}
            />
          ),
          th: (props) => (
            <th
              className="border border-gray-200 bg-gray-50 px-4 py-3 text-left font-bold"
              {...omitNode(props)}
            />
          ),
          td: (props) => <td className="border border-gray-200 px-4 py-3" {...omitNode(props)} />,
          // Sửa triệt để thẻ code: Lấy ra className để nối chuỗi (đảm bảo nó được dùng), phần còn lại đưa qua omitNode
          code: (props: CodeProps) => {
            const { inline, className: customClass, children, ...rest } = props;

            return inline ? (
              <code
                className={`bg-gray-100 text-red-500 px-1.5 py-0.5 rounded text-sm font-mono ${customClass || ''}`.trim()}
                {...omitNode(rest)}
              >
                {children}
              </code>
            ) : (
              <code
                className={`block bg-[#1E1E1E] text-white p-4 rounded-xl my-4 overflow-x-auto text-sm font-mono shadow-sm ${customClass || ''}`.trim()}
                {...omitNode(rest)}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
