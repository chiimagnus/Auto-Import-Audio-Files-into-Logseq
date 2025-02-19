declare module "@logseq/libs" {
  interface IAppProxy {
    showMsg: (content: string, type?: "success" | "warning" | "error") => void;
  }

  interface Files {
    name: string;
    type: string;
    path?: string;
  }
}

// 组件 props 类型
interface FileUploaderProps {
  isAsset: boolean;
  onUploadComplete: (links: string[]) => void;
}

// 添加这行使文件成为模块
export {};

// 现在可以安全扩展全局类型
declare global {
  interface File {
    path?: string;
  }
} 