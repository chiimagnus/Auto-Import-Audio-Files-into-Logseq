import "@logseq/libs";
import { setup as l10nSetup, t } from "logseq-l10n";
import zhCN from "./translations/zh-CN.json" assert { type: "json" };
import en from "./translations/en.json" assert { type: "json" };
import { registerFileCommands } from './utils/embedHelpers';
import { registerPathConverterCommands } from './utils/pathConverter';
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

// 创建获取设置项的函数
function getSettings(): SettingSchemaDesc[] {
  return [{
    key: "splitPathsIntoBlocks",
    type: "boolean",
    default: false,
    title: t("Split Multiple Paths into Separate Blocks"),
    description: t("Split paths description")
  }];
}

async function main() {
  // 首先进行 l10n 初始化
  try {
    await l10nSetup({ 
      builtinTranslations: { 
        en, 
        zhCN,
        'zh-CN': zhCN
      } 
    });
  } finally {
    console.log("l10n initialized");
  }

  // 在 l10n 初始化之后再注册设置
  logseq.useSettingsSchema(getSettings());

  // 确保 root 元素存在
  if (!document.getElementById("root")) {
    const rootEl = document.createElement("div");
    rootEl.id = "root";
    document.body.append(rootEl);
  }

  // 注册所有命令
  const registerCommands = () => {
    registerPathConverterCommands();
    registerFileCommands();
    return () => {/* 清理函数 */};
  };

  return registerCommands();
}

logseq.ready(main).catch(console.error);