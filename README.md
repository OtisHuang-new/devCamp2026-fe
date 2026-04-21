/*
===========================================================================
README - HƯỚNG DẪN CẤU TRÚC THƯ MỤC DỰ ÁN DEVCAMP2026-FE
===========================================================================
Mục tiêu: Giúp 6 anh em trong team đồng bộ cách quản lý source code, 
tách biệt rõ ràng logic và UI, dễ bảo trì khi dự án phình to. 
Dự án sử dụng tư duy chia thư mục theo tính năng (Feature-based).

1. TỔNG QUAN
- Thư mục src/ được chia làm 2 nhánh chính: 'features' và 'shared'.
- Quy tắc cốt lõi: 'features' có thể gọi 'shared', nhưng 'shared' KHÔNG BAO GIỜ được gọi 'features'.

2. THƯ MỤC src/features/
Chứa các module/tính năng nghiệp vụ riêng biệt của ứng dụng (vd: auth, dashboard).
Mỗi feature hoạt động như một ứng dụng thu nhỏ, bao gồm:
  + components/ : Chứa các UI Component phục vụ riêng cho tính năng này (VD: LoginForm.tsx).
  + hooks/      : Custom React Hooks xử lý logic riêng của tính năng (VD: useAuth.ts).
  + services/   : Chứa logic giao tiếp với Backend/API (VD: authAPI.ts gọi API đăng nhập).
  + store/      : Quản lý state cục bộ của tính năng (Redux slice, Zustand store...).
  + types/      : Định nghĩa các interface/type TypeScript cho tính năng này.
  + index.tsx   : File đóng vai trò là cầu nối (Public API). Chỉ export những gì cần thiết 
                  cho các phần khác của app sử dụng, che giấu các logic bên trong.

3. THƯ MỤC src/shared/
Chứa các tài nguyên dùng chung cho toàn bộ dự án, không gắn liền với business logic nào.
  + components/ : Component UI tái sử dụng ở nhiều nơi (VD: Button, Input, Modal, Table).
  + hooks/      : Hooks dùng chung (VD: useClickOutside, useDebounce).
  + store/      : Quản lý state toàn cục (VD: User Session, Theme Light/Dark).
  + types/      : Các interface/type phổ biến dùng ở nhiều nơi.
  + utils/      : Các hàm tiện ích (VD: formatDate, formatCurrency, regex validate).

4. QUY TẮC PHÁT TRIỂN DÀNH CHO TEAM
- Khi code một tính năng mới, hãy tạo folder mới trong 'features'.
- Nếu thấy một component (VD: nút bấm) được lặp lại ở 2 features khác nhau, hãy đưa nó xuống 'shared/components'.
- Các feature giao tiếp với nhau thông qua file 'index.tsx' của feature đó, không import sâu vào các folder con của feature khác.
*/