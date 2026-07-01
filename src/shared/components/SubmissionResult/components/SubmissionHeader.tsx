// Vị trí: src/shared/components/SubmissionResult/components/SubmissionHeader.tsx
import { forwardRef } from 'react';
import type { SubmissionHistoryItem } from '../../../../features/Exercise/types/submitTypes';
import { formatDateTime } from '../../../utils/dateFormatter';

interface SubmissionHeaderProps {
  statusText: string;
  statusColor: string;
  history: SubmissionHistoryItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

export const SubmissionHeader = forwardRef<HTMLDivElement, SubmissionHeaderProps>(
  ({ statusText, statusColor, history, selectedIndex, onSelectIndex }, ref) => {
    return (
      <div ref={ref} className="flex items-end justify-between">
        <p className="text-sm font-medium">
          Submission result: <span className={`${statusColor} font-bold`}>{statusText}</span>
        </p>

        <div className="flex flex-col items-end gap-1.5">
          <label className="text-xs font-bold text-slate-500">Choose your version:</label>
          <select
            value={selectedIndex}
            onChange={(e) => onSelectIndex(Number(e.target.value))}
            className="bg-gray-100 border border-gray-300 text-sm font-bold text-slate-700 rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-[#1E3A8A]"
          >
            {history.map((item, index) => (
              <option key={item._id} value={index}>
                {formatDateTime(item.createdAt)}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  },
);

SubmissionHeader.displayName = 'SubmissionHeader';
