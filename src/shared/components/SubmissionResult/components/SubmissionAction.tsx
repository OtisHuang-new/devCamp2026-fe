// Vị trí: src/shared/components/SubmissionResult/components/SubmissionAction.tsx
import { forwardRef } from 'react';

interface SubmissionActionProps {
  isAllPassed: boolean;
  showHighlight: boolean;
  onActionClick?: () => void;
}

export const SubmissionAction = forwardRef<HTMLButtonElement, SubmissionActionProps>(
  ({ isAllPassed, showHighlight, onActionClick }, ref) => {
    return (
      <div className="flex justify-center mt-8">
        <div className="relative group">
          {showHighlight && (
            <>
              <style>{`
                @keyframes border-spin-submission {
                  0% { transform: translate(-50%, -50%) rotate(0deg); }
                  100% { transform: translate(-50%, -50%) rotate(720deg); }
                }
                @keyframes border-fade-submission {
                  0% { opacity: 0; }            
                  10% { opacity: 1; }           
                  80% { opacity: 1; }           
                  100% { opacity: 0; }          
                }
              `}</style>

              <div
                className="absolute -inset-[3px] rounded-[15px] overflow-hidden z-0 pointer-events-none"
                style={{ animation: 'border-fade-submission 3.5s ease-in-out forwards' }}
              >
                <div
                  className="absolute top-1/2 left-1/2 w-[300%] h-[300%] z-[-1]"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 40%, #06b6d4 60%, #a855f7 80%, #ec4899 100%)',
                    animation: 'border-spin-submission 3s ease-in-out forwards',
                  }}
                />
              </div>
            </>
          )}

          <button
            ref={ref}
            onClick={onActionClick}
            className={`relative z-10 ${
              isAllPassed ? 'bg-[#22C55E] hover:bg-[#16a34a]' : 'bg-yellow-500 hover:bg-yellow-600'
            } text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-md`}
          >
            {isAllPassed ? 'Finish lesson' : 'Exit lesson'}
          </button>
        </div>
      </div>
    );
  },
);

SubmissionAction.displayName = 'SubmissionAction';
