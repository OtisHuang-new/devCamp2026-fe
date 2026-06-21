/**
 * Hàm thuần khiết (Pure Function) chuyển đổi URL video thông thường
 * thành URL định dạng nhúng (embed) cho iframe.
 */
export function getEmbeddableVideoUrl(url?: string): string | undefined {
  if (!url) return undefined;

  // Xử lý link Google Drive: Chuyển /view... thành /preview
  if (url.includes('drive.google.com/file/d/')) {
    // Regex này sẽ thay thế '/view' và toàn bộ query params (như ?usp=drive_link) thành '/preview'
    return url.replace(/\/view.*/, '/preview');
  }

  // (Scale up) Xử lý link YouTube nếu sau này DB có trả về link Youtube
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  }

  // Trả về mặc định nếu không thuộc các trường hợp trên
  return url;
}
