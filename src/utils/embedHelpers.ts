import { t } from "logseq-l10n";

export const registerFileCommands = () => {
  // 注册斜杠命令
  logseq.Editor.registerSlashCommand(
    "📂 Insert multiple files from local folder",
    async ({ uuid }) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.onchange = async () => {
        if (input.files) {
          await handleFiles(input.files, uuid);
        }
      };
      input.click();
    }
  );

  // 注册快捷键
  logseq.App.registerCommandPalette({
    key: "insert-local-files",
    label: t("Insert multiple files from local folder"),
    keybinding: {
      mode: "global",
      binding: "shift+alt+i"
    }
  }, async () => {
    const block = await logseq.Editor.getCurrentBlock();
    if (block?.uuid) {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.onchange = async () => {
        if (input.files) {
          await handleFiles(input.files, block.uuid);
        }
      };
      input.click();
    }
  });
};

async function handleFiles(files: FileList, uuid: string) {
  try {
    const fileArray = Array.from(files);
    
    // 获取当前块的内容和位置信息
    const currentBlock = await logseq.Editor.getBlock(uuid);
    if (!currentBlock) return;

    // 处理第一个文件：更新当前块
    if (fileArray.length > 0) {
      const firstFile = fileArray[0];
      const path = (firstFile as any).path;
      if (path) {
        await logseq.Editor.updateBlock(
          uuid,
          `![](${path})`
        );
      }
    }

    // 处理剩余文件：在当前块后插入同级块
    for (let i = 1; i < fileArray.length; i++) {
      const file = fileArray[i];
      const path = (file as any).path;
      if (path) {
        await logseq.Editor.insertBlock(
          currentBlock.uuid,
          `![](${path})`,
          {
            sibling: true,  // 作为同级块插入
            before: false   // 在当前块之后
          }
        );
      }
    }
  } catch (error) {
    console.error(error);
    logseq.UI.showMsg(t("Error inserting files"), 'error');
  }
} 