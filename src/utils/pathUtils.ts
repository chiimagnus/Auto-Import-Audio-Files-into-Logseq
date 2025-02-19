/**
 * 从文件路径中提取文件名
 * @param path 文件路径
 * @returns 文件名（不含扩展名）
 */
export function extractFileName(path: string): string {
  // 处理 Windows 和 Unix 风格的路径
  const fileName = path.split(/[/\\]/).pop() || '';
  // 移除扩展名
  return fileName.replace(/\.[^/.]+$/, '');
}

/**
 * 生成嵌入格式的链接
 * @param path 文件路径
 * @returns 嵌入格式的链接
 */
export function generateEmbed(path: string): string {
  const fileName = extractFileName(path);
  return `![${fileName}](${path})`;
} 