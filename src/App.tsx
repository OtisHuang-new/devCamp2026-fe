import { useState, useEffect } from 'react';
import axios from 'axios';

// Vì chúng ta dùng TypeScript, nên định nghĩa sẵn cấu trúc dữ liệu trả về cho chuẩn chỉ
interface UserData {
  name: string;
  email: string;
}

function App() {
  // Tạo state để lưu dữ liệu từ API. Ban đầu chưa có data nên để là null.
  const [data, setData] = useState<UserData | null>(null);

  // Tạo state để làm hiệu ứng "Đang tải..."
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // dùng public API
    axios
      .get('https://jsonplaceholder.typicode.com/users/1')
      .then(function (response) {
        console.log('Dữ liệu lấy được:', response.data);
        setData(response.data); // Lưu dữ liệu vào state
        setLoading(false); // Tắt trạng thái loading
      })
      .catch(function (error) {
        console.error('Lỗi rồi:', error);
        setLoading(false);
      });
  }, []); // thay đổi dựa vào dependencies bên trong

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 className="text-red-900">Hello World</h1>
      <p>Frontend Repo - Milestone 1</p>

      <hr style={{ margin: '30px 0' }} />

      <h2>Khu vực Test API:</h2>
      {/* Logic hiển thị: Nếu đang loading thì hiện chữ, nếu có data thì in ra */}
      {loading ? (
        <p>Đang gọi API, chờ chút nhé...</p>
      ) : data ? (
        <div
          style={{
            border: '1px solid #ccc',
            padding: '20px',
            display: 'inline-block',
            borderRadius: '8px',
          }}
        >
          <p>
            <strong>Tên User:</strong> {data.name}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
        </div>
      ) : (
        <p>Không lấy được dữ liệu.</p>
      )}
    </div>
  );
}

export default App;
