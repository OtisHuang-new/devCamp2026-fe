import google from './Assets/Google icon.svg';
import background from './Assets/backGround.jpg';

function Login() {
  return (
    /* Lớp nền xám nhạt bao phủ toàn màn hình, căn giữa hộp Login */
    <div className="min-h-screen w-full bg-[#7c7b7b] flex justify-center items-center p-4 font-sans">
      {/* Hộp Login chính - Khóa chiều cao cố định, bo góc tròn và đổ bóng mượt */}
      <div className="bg-white w-full max-w-4xl h-[620px] rounded-[8px] shadow-2xl overflow-hidden flex flex-row">
        {/* ================= BÊN TRÁI: FORM ĐĂNG NHẬP ================= */}
        <div className="w-3/5 h-full flex flex-col justify-center px-16 bg-white">
          {/* Tiêu đề & Link chuyển đổi sang Đăng ký */}
          <h2 className="text-3xl font-extrabold text-primary mb-1">Đăng nhập</h2>
          <p className="text-gray-600 text-sm mb-6 font-medium">
            Chưa có tài khoản?{' '}
            <span className="text-primary font-bold underline cursor-pointer hover:opacity-80">
              Đăng ký
            </span>
          </p>

          {/* Nút Đăng nhập nhanh bằng Google */}
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 px-4 py-2.5 rounded-lg text-gray-700 font-medium text-sm transition-all hover:bg-gray-50 active:scale-[0.99] mb-6">
            <img src={google} className="w-5 h-5" alt="Google icon" />
            <span>Đăng nhập bằng Google</span>
          </button>

          {/* Đường phân cách HOẶC */}
          <div className="flex items-center my-2 mb-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-xs font-bold text-primary tracking-wider">HOẶC</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Khu vực điền thông tin Form */}
          <form className="flex flex-col gap-4">
            {/* Ô nhập Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-extrabold text-primary">Username</label>
              <input
                type="text"
                placeholder="3-30 ký tự (chữ , số, _.-)"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary placeholder:text-gray-400 placeholder:text-xs"
              />
            </div>

            {/* Ô nhập Mật khẩu */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-sm font-extrabold text-primary">Mật khẩu</label>
              <input
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary placeholder:text-gray-400 placeholder:text-xs"
              />
            </div>

            {/* Quên mật khẩu? (Căn lề phải chuẩn Figma) */}
            <div className="flex justify-end -mt-1">
              <span className="text-sm font-bold text-primary underline cursor-pointer hover:opacity-80">
                Quên mật khẩu?
              </span>
            </div>

            {/* Nút Đăng nhập chính */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-bold text-sm mt-4 transition-all hover:opacity-95 active:scale-[0.99] shadow-md shadow-primary/20"
            >
              Đăng nhập
            </button>
          </form>
        </div>

        {/* ================= BÊN PHẢI: ẢNH NỀN PHỦ LỚP MÀU XANH BẢN QUYỀN ================= */}
        <div
          className="w-2/5 bg-cover bg-center hidden md:block relative before:absolute before:inset-0 before:bg-primary/60"
          style={{ backgroundImage: `url(${background})` }}
        ></div>
      </div>
    </div>
  );
}

export default Login;
