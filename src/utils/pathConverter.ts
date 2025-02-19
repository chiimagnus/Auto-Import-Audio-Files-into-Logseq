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

// 在转换函数中添加校验
function convertToEmbed(content: string) {
  if (!isValidPath(content)) {
    throw new Error(t("Content is not a valid file path"));
  }
  return isAlreadyEmbed(content) ? content : `![](${content})`;
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
          const newContent = convertToEmbed(block.content);
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
          const newContent = convertToEmbed(block.content);
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