import { useAuthContext_v2 } from '../../shared/context/hooks/useAuthContext_v2';
import { useProfileForm } from './hooks/useProfileForm';
import { EditableField } from './components/EditableField';
import { formatDateTime } from '../../shared/utils/dateFormatter';
import type { UserInfo } from '../../shared/context/types/contextTypes';
import { Return } from '@/shared/components/Return';

const LEVEL_OPTIONS = [
  { value: 1, label: 'Complete Beginner (No prior experience)' },
  { value: 2, label: 'Basic (Understand basic syntax)' },
  { value: 3, label: 'Intermediate (Can build small projects)' },
  { value: 4, label: 'Advanced (Professional experience)' },
  { value: 5, label: 'Expert (Mastery in multiple stacks)' },
];

// 2. SENIOR UX: Khai báo mảng JOB_OPTIONS với thủ thuật chèn icon bằng Text trực tiếp
const JOB_OPTIONS = [
  { value: 'Accountant', label: 'Accountant (✨ AI Customized)' },
  { value: 'Software Engineer', label: 'Software Engineer' },
  { value: 'Data Analyst', label: 'Data Analyst' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Student', label: 'Student' },
  { value: 'Other', label: 'Other' },
];

interface ProfileContentProps {
  user: UserInfo;
  logoutState: () => void;
}

function ProfileContent({ user, logoutState }: ProfileContentProps) {
  const {
    isEditing,
    draftData,
    isChanged,
    handleInputChange,
    handleNestedChange,
    handleButtonClick,
  } = useProfileForm(user);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 pt-4 font-sans">
      <Return text="Return to progress" />

      {/* 2. Cover Photo */}
      <div className="relative mb-[20px] text-4xl font-bold text-primary text-center">
        PROFILE MANAGEMENT
      </div>

      {/* 3. User Basic Info */}
      <div className="flex justify-between items-start mb-[15px] ">
        <div>
          {/* Code mới */}
          <EditableField
            value={draftData.name}
            isEditing={isEditing}
            isMainTitle={true}
            onChange={(val) => handleInputChange('name', val)}
          />
          <p className="text-[#1A2E72] font-medium mt-1">{user.email}</p>
          <p className="text-gray-800 mt-1">Joined since {formatDateTime(user.createdAt)}</p>
        </div>

        <div className="flex flex-col items-end">
          <button
            onClick={handleButtonClick}
            className={`flex items-center gap-2 border font-medium px-5 py-1.5 rounded-lg transition-colors ${
              isEditing
                ? isChanged
                  ? 'bg-[#1A2E72] border-[#1A2E72] text-white hover:opacity-90 shadow-md' // State: SAVE
                  : 'bg-blue-200 text-[#1A2E72] hover:bg-blue-300' // State: CANCEL
                : 'bg-transparent border-[#1A2E72] text-[#1A2E72] hover:bg-blue-50' // State: EDIT (Default)
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor" // Kế thừa tự động từ text-white hoặc text-[#1A2E72]
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
            {isEditing ? (isChanged ? 'Save' : 'Cancle') : 'Edit'}
          </button>

          <div className="text-right mt-3 text-gray-400">
            <p className="text-[#8FA1D8]">Last updated:</p>
            <p className="text-[#8FA1D8] mt-0.5">{formatDateTime(user.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* 4. Detail Information Box */}
      <div className="border-[3px] border-[#0B1A4D] rounded-2xl p-4 relative mb-6 shadow-sm">
        {/* Box Header */}
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-[#0B1A4D]">Detail infomation</h2>
          <div className="bg-[#1A2E72] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              ></path>
            </svg>
            AI Personalize
          </div>
        </div>

        {/* Info Rows */}
        <div className="space-y-3">
          <div className="border border-gray-200 rounded-xl p-4">
            <EditableField
              label="Currently Job"
              // 3. SENIOR UX: Chuyển Job thành Select Box
              type="select"
              options={JOB_OPTIONS}
              value={draftData.information.job}
              isEditing={isEditing}
              onChange={(val) => handleNestedChange('job', val)}
            />

            {(isEditing ? draftData.information.job : user.information.job) === 'Accountant' && (
              <div className="mt-3 flex items-start gap-3 bg-blue-50/80 border border-blue-200 rounded-lg p-3 animate-fadeIn">
                <span className="text-xl leading-none select-none">✨</span>
                <p className="text-[#1E3A8A] text-[13px] font-medium leading-relaxed">
                  <span className="font-bold">High match:</span> Our AI has highly customized
                  exercises crafted specifically for Accountants.
                </p>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <EditableField
              label="Level"
              type="select"
              options={LEVEL_OPTIONS}
              value={draftData.information.level}
              isEditing={isEditing}
              onChange={(val) => handleNestedChange('level', val)}
            />
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <EditableField
              label="Background"
              type="textarea"
              value={draftData.information.background}
              isEditing={isEditing}
              onChange={(val) => handleNestedChange('background', val)}
            />
          </div>
        </div>
      </div>

      {/* 5. Log-out Button */}
      <div
        onClick={function () {
          logoutState();
        }}
        className="flex justify-end"
      >
        <button className="bg-[#db4437] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          Log-out
        </button>
      </div>
    </div>
  );
}

// WRAPPER
export function Profile() {
  const { user, logoutState } = useAuthContext_v2();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen font-bold">Loading Profile...</div>
    );
  }

  return <ProfileContent user={user} logoutState={logoutState} />;
}
