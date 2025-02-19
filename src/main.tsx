import "@logseq/libs";
import { setup as l10nSetup, t } from "logseq-l10n";
import zhCN from "./translations/zh-CN.json" assert { type: "json" };
import en from "./translations/en.json" assert { type: "json" };
import { registerFileCommands } from './utils/embedHelpers';

async function main() {
  // 将初始化移到最前面
  try {
    await l10nSetup({ 
      builtinTranslations: { 
        en, 
        zhCN, // 注意这里要使用正确的语言代码
        'zh-CN': zhCN // 添加备用键（Logseq使用zh-CN作为中文代码）
      } 
    });
  } finally {
    console.log("plugin loaded");
  }

  // 确保 root 元素存在
  if (!document.getElementById("root")) {
    const rootEl = document.createElement("div");
    rootEl.id = "root";
    document.body.append(rootEl);
  }

  // 将命令注册移到 ready 回调中
  const registerCommands = () => {
    // 注册斜杠命令 - 保持英文
    logseq.Editor.registerSlashCommand(
      "Convert to Embed", // 不使用 t()，保持英文
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
      label: t("Convert Path to Embed"), // 命令面板中的显示可以使用翻译
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

    registerFileCommands(); // 添加新命令注册
    
    return () => {/* 清理函数 */};
  };

  // 返回清理函数
  return registerCommands();
}

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

logseq.ready(main).catch(console.error);
