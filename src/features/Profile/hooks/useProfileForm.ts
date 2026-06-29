import { useState, useMemo } from 'react';
import type { UserInfo } from '../../../shared/context/types/contextTypes';
import type { UpdateProfileRequest } from '../types/apiTypes';
import { updateProfileApi } from '../api/updateProfileApi';
import { useAuthContext_v2 } from '../../../shared/context/hooks/useAuthContext_v2';
import { useToastStore } from '@/shared/store/useToastStore';

export function useProfileForm(initialUser: UserInfo) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftData, setDraftData] = useState<UserInfo>(initialUser);
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useAuthContext_v2();
  const [prevInitialUser, setPrevInitialUser] = useState<UserInfo>(initialUser);
  const addToast = useToastStore((state) => state.addToast);

  // 2. SO SÁNH TRỰC TIẾP TRONG LÚC RENDER (Không dùng Effect)
  if (initialUser !== prevInitialUser) {
    setPrevInitialUser(initialUser); // Cập nhật lại đồ mốc so sánh
    setDraftData(initialUser); // Đồng bộ bản nháp
  }

  //Tính toán xem dữ liệu nháp có khác dữ liệu gốc không?
  const isChanged = useMemo(() => {
    return JSON.stringify(initialUser) !== JSON.stringify(draftData);
  }, [initialUser, draftData]);

  function toggleEdit() {
    if (isEditing) {
      setDraftData(initialUser);
    }
    setIsEditing(!isEditing);
  }

  function handleInputChange(field: keyof UserInfo, value: string) {
    setDraftData((prev) => ({ ...prev, [field]: value }));
  }
  // dành riêng cho những field bên trong infomation
  function handleNestedChange(field: keyof UserInfo['information'], value: string) {
    setDraftData((prev) => ({
      ...prev,
      information: { ...prev.information, [field]: value },
    }));
  }

  async function handleSaveClick() {
    setIsSaving(true);

    try {
      const reqData: UpdateProfileRequest = {
        _id: draftData._id,
        name: draftData.name,
        information: {
          job: draftData.information.job,
          level: draftData.information.level,
          background: draftData.information.background,
        },
      };

      const respond = await updateProfileApi(reqData);

      updateUser(respond);
      setIsEditing(false);

      // 3. SENIOR UX: Bắn thông báo Toast thành công với timeout 3 giây
      addToast('Updated profile successfully !', 3000, false);
    } catch (error) {
      console.log('thằng useProfileForm.ts lỗi nè bro:', error);
      // Bạn cũng có thể bắt Toast lỗi ở đây nếu muốn (Optional)
      // addToast('Failed to update profile. Please try again!', 3000, true);
    } finally {
      setIsSaving(false);
    }
  }

  function handleButtonClick() {
    if (!isChanged) {
      toggleEdit();
    } else {
      handleSaveClick();
    }
  }

  return {
    isEditing,
    draftData,
    isChanged,
    isSaving,
    setIsSaving,
    toggleEdit,
    handleInputChange,
    handleNestedChange,
    handleButtonClick,
  };
}
