import { useState, useMemo } from 'react';
import type { UserInfo } from '../../../shared/context/types/contextTypes';
import type { UpdateProfileRequest } from '../types/apiTypes';
import { updateProfileApi } from '../api/updateProfileApi';
import { useAuthContext_v2 } from '../../../shared/context/hooks/useAuthContext_v2';

export function useProfileForm(initialUser: UserInfo) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftData, setDraftData] = useState<UserInfo>(initialUser);
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useAuthContext_v2();
  // để lưu lại giá trị của initialUser ở lần render trước
  const [prevInitialUser, setPrevInitialUser] = useState<UserInfo>(initialUser);

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
    } catch (error) {
      console.log('thằng useProfileForm.ts lỗi nè bro:', error);
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
