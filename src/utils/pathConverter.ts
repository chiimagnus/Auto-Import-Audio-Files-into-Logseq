import { t } from "logseq-l10n";

// 增强路径检测逻辑
function isValidPath(content: string) {
  const pathPattern = /^(?:[a-zA-Z]:\\|\\|\\\\|\/|\.\/|~\/)|.*\.[a-zA-Z0-9]{2,4}(?:[?#].*)?$/;
  return pathPattern.test(content) && (content.includes("/") || content.includes("\\"));
}

// 添加格式检测函数
function isAlreadyEmbed(content: string) {
  // 匹配标准的嵌入语法 ![](path)
  const embedPattern = /^!\[\]\(.+\)$/;
  return embedPattern.test(content);
}

// 处理单个路径
function convertToEmbed(content: string) {
  if (!isValidPath(content)) {
    throw new Error(t("Content is not a valid file path"));
  }
  return isAlreadyEmbed(content) ? content : `![](${content})`;
}

// 新增：处理多行内容
function convertMultiplePathsToEmbed(content: string): string {
  // 按换行符分割内容
  const lines = content.split('\n');
  
  // 处理每一行
  return lines.map(line => {
    // 跳过空行
    if (!line.trim()) return line;
    
    try {
      // 尝试转换每一行
      return convertToEmbed(line.trim());
    } catch (error) {
      // 如果某一行不是有效路径，保持原样
      return line;
    }
  }).join('\n'); // 重新用换行符连接
}

export const registerPathConverterCommands = () => {
  // 注册斜杠命令 - 保持英文
  logseq.Editor.registerSlashCommand(
    "Convert to Embed",
    async () => {
      const blocks = await logseq.Editor.getSelectedBlocks();
      if (!blocks?.length) {
        logseq.UI.showMsg(t("Please select multiple blocks first"), "warning");
        return;
      }
      
      await Promise.all(
        blocks.map(async (block) => {
          // 使用新的多行处理函数
          const newContent = convertMultiplePathsToEmbed(block.content);
          await logseq.Editor.updateBlock(block.uuid, newContent);
        })
      );
    }
  );

  // 注册快捷键 - label 使用翻译
  logseq.App.registerCommandPalette({
    key: "convert-path",
    label: t("Convert Path to Embed"),
    keybinding: {
      mode: "non-editing",
      binding: "mod+shift+i"
    }
  }, async () => {
    try {
      const blocks = await logseq.Editor.getSelectedBlocks();
      if (!blocks?.length) {
        logseq.UI.showMsg(t("Please select multiple blocks first"), "warning");
        return;
      }
      
      await Promise.all(
        blocks.map(async (block) => {
          // 使用新的多行处理函数
          const newContent = convertMultiplePathsToEmbed(block.content);
          await logseq.Editor.updateBlock(block.uuid, newContent);
        })
      );
    } catch (error) {
      console.error(error);
      logseq.UI.showMsg(
        (error as Error).message,
        "error"
      );
    }
  });
}; 