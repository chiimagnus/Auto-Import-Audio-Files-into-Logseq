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

// 修改：更新多行处理函数，添加分块处理功能
async function processBlock(block: any, content: string) {
  const shouldSplit = logseq.settings?.splitPathsIntoBlocks;
  const newContent = convertMultiplePathsToEmbed(content);
  
  if (shouldSplit && content.includes("'")) {
    // 处理带引号的多个路径
    const pathRegex = /'[^']+'/g;
    const paths = content.match(pathRegex);
    
    if (paths && paths.length > 1) {
      // 更新当前块的内容为第一个路径
      const firstPath = paths[0];
      const firstPathConverted = convertToEmbed(cleanPath(firstPath));
      await logseq.Editor.updateBlock(block.uuid, firstPathConverted);
      
      // 为其余路径创建新块
      for (let i = 1; i < paths.length; i++) {
        const path = paths[i];
        const convertedPath = convertToEmbed(cleanPath(path));
        await logseq.Editor.insertBlock(block.uuid, convertedPath, { sibling: true });
      }
      return;
    }
  } else if (shouldSplit && newContent.includes('\n')) {
    // 处理换行符分隔的多个路径
    const lines = newContent.split('\n').filter(line => line.trim());
    if (lines.length > 1) {
      // 更新当前块的内容为第一行
      await logseq.Editor.updateBlock(block.uuid, lines[0]);
      
      // 为其余行创建新块
      for (let i = 1; i < lines.length; i++) {
        await logseq.Editor.insertBlock(block.uuid, lines[i], { sibling: true });
      }
      return;
    }
  }
  
  // 如果不需要分块或只有一个路径，直接更新当前块
  await logseq.Editor.updateBlock(block.uuid, newContent);
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
          await processBlock(block, block.content);
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
          await processBlock(block, block.content);
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