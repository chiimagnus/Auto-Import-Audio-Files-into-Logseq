import React from 'react';
import { IAsyncStorage } from '@logseq/libs/dist/modules/LSPlugin.Storage';
import { t } from "logseq-l10n";

interface FileUploaderProps {
  isAsset: boolean;
  onUploadComplete: (links: string[]) => void;
}

const FileUploader = ({ isAsset, onUploadComplete }: FileUploaderProps): JSX.Element => {
  const handleFileSelect = async (files: FileList) => {
    const storage = logseq.Assets.makeSandboxStorage() as IAsyncStorage;
    const links: string[] = [];
    
    for (const file of Array.from(files)) {
      const link = await processFile(file, storage, isAsset);
      links.push(link);
    }
    
    onUploadComplete(links);
  };

  return (
    <input 
      type="file" 
      multiple 
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
        e.target.files && handleFileSelect(e.target.files)
      }
      style={{ display: 'none' }}
    />
  );
};

async function processFile(file: File, storage: IAsyncStorage, isAsset: boolean): Promise<string> {
  // 获取 Electron 环境下的文件路径
  const electronFile = file as unknown as { path: string };
  if (!electronFile.path) {
    throw new Error(t("Error writing file"));
  }
  return electronFile.path;
}

export default FileUploader; 