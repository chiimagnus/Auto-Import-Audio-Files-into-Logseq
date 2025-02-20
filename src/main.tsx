import "@logseq/libs";
import { setup as l10nSetup } from "logseq-l10n";
import zhCN from "./translations/zh-CN.json" assert { type: "json" };
import en from "./translations/en.json" assert { type: "json" };
import { registerFileCommands } from './utils/embedHelpers';
import { registerPathConverterCommands } from './utils/pathConverter';
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

// 添加设置项配置
const settings: SettingSchemaDesc[] = [
  {
    key: "splitPathsIntoBlocks",
    type: "boolean",
    default: false,
    title: "将多个文件路径分散到不同块 / Split Multiple Paths into Separate Blocks",
    description: "当一个块中包含多个文件路径时，是否将它们分散到不同的块中\nWhether to split multiple file paths in a block into separate blocks"
  }
];

async function main() {
  // 注册设置
  logseq.useSettingsSchema(settings);

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

  // 注册所有命令
  const registerCommands = () => {
    registerPathConverterCommands();  // 路径转换相关命令
    registerFileCommands();           // 文件处理相关命令
    return () => {/* 清理函数 */};
  };

  return registerCommands();
}

logseq.ready(main).catch(console.error);