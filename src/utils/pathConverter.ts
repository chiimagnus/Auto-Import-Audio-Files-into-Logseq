import { t } from "logseq-l10n";
import { generateEmbed } from './pathUtils';

// 增强路径检测逻辑
function isValidPath(content: string) {
  // 清理路径中的引号
  const cleanedContent = cleanPath(content);
  const pathPattern = /^(?:[a-zA-Z]:\\|\\|\\\\|\/|\.\/|~\/)|.*\.[a-zA-Z0-9]{2,4}(?:[?#].*)?$/;
  return pathPattern.test(cleanedContent) && (cleanedContent.includes("/") || cleanedContent.includes("\\"));
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
    return isAlreadyEmbed(content) ? content : generateEmbed(content);
  }

// 新增：处理带引号的路径
function cleanPath(path: string): string {
  // 移除开头和结尾的单引号
  return path.replace(/^'|'$/g, '').trim();
}

// 新增：处理空格分隔的多个路径
function handleSpaceSeparatedPaths(content: string): string {
  // 使用正则表达式匹配带引号的路径
  const pathRegex = /'[^']+'/g;
  const paths = content.match(pathRegex);
  
  if (paths) {
    // 处理每个匹配到的路径
    return paths.map(path => {
      const cleanedPath = cleanPath(path);
      try {
        return convertToEmbed(cleanedPath);
      } catch (error) {
        return path;
      }
    }).join('\n');
  }
  
  // 如果没有匹配到带引号的路径，尝试作为单个路径处理
  return content;
}

// 修改：更新多行处理函数
function convertMultiplePathsToEmbed(content: string): string {
  // 首先尝试处理空格分隔的路径
  if (content.includes("'")) {
    return handleSpaceSeparatedPaths(content);
  }

  // 如果不包含引号，按原来的方式处理
  const lines = content.split('\n');
  
  return lines.map(line => {
    if (!line.trim()) return line;
    
    try {
      return convertToEmbed(line.trim());
    } catch (error) {
      return line;
    }
  }).join('\n');
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