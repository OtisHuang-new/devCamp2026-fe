- cấu trúc file được cấu trúc theo Nhóm tính năng/ Modules

└── src/
├── assets/
├── modules/
│ ├── core/
│ │ ├── components/
│ │ ├── design-system/
│ │ │ └── Button.tsx
│ │ ├── hooks/
│ │ ├── lib/
│ │ └── utils/
│ ├── payment/
│ │ ├── components/
│ │ │ └── PaymentForm.tsx
│ │ ├── hooks/
│ │ │ └── usePayment.ts
│ │ ├── lib/
│ │ ├── services/
│ │ ├── states/
│ │ └── utils/
│ ├── auth/
│ │ ├── components/
│ │ │ └── SignUpForm.tsx
│ │ ├── hooks/
│ │ │ └── useAuth.ts
│ │ ├── lib/
│ │ ├── services/
│ │ ├── states/
│ │ └── utils/
│ └── employees/
│ ├── components/
│ │ ├── EmployeeList.tsx
│ │ └── EmployeeSummary.tsx
│ ├── hooks/
│ │ ├── useEmployees.ts
│ │ └── useUpdateEmployee.ts
│ ├── services/
│ ├── states/
│ └── utils/
└── ...

#📋 Kế hoạch tổ chức thư mục:
Dưới đây là ý nghĩa của từng thư mục để bạn dễ dàng training lại cho các thành viên trong team:

core/: Chứa những thứ dùng chung cho TOÀN BỘ ứng dụng (Ví dụ: Nút bấm chuẩn của hệ thống Button.tsx, các hàm format ngày tháng, component Layout chính).

Các module tính năng (auth, payment, employees): Mỗi thư mục là một thế giới riêng.

components/: Giao diện chỉ dành riêng cho tính năng này.

hooks/: Logic React riêng biệt.

services/: File chứa Axios để gọi API (ví dụ: auth.service.ts gọi API login).

states/: Quản lý state cục bộ (Zustand, Redux slice, hoặc Context API).

utils/: Các hàm tính toán lặt vặt
