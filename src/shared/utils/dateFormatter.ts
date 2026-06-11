export function formatDateTime(isoString: string | undefined): string {
  if (!isoString) return '';

  const date = new Date(isoString);

  // Tránh lỗi sập UI nếu chuỗi ngày tháng từ API bị sai định dạng
  if (isNaN(date.getTime())) return isoString;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';

  // Chuyển đổi sang định dạng 12 giờ
  hours = hours % 12;
  hours = hours ? hours : 12; // Nếu giờ là 0 thì đổi thành 12
  const strHours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year} ${strHours}:${minutes}${ampm}`;
}
