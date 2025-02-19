# File Path Transformer

这是一个 Logseq 插件，提供两个主要功能：
1. 将文件路径转换为 Logseq 的嵌入语法
2. 快速从本地文件夹选择并插入多个文件

## 功能特点

### 1. 路径转换功能
- 将文件路径自动转换为 Logseq 的嵌入语法 `![](FilePath)`
- 支持批量处理多个块
- 支持处理单个块中的多行路径
- 智能识别有效的文件路径

### 2. 多文件插入功能
- 通过文件选择器一次选择多个文件
- 自动获取文件的绝对路径
- 转换为嵌入格式并插入到当前块
- 多个文件会自动插入到同级块中

## 使用方法

### 路径转换功能
1. 在 block 中输入一个或多个文件的绝对路径（换行符分隔）
2. 使用以下方式之一触发转换：
   - 斜杠命令：`/Convert to Embed`
   - 快捷键：`cmd+shift+I`（macOS）或 `ctrl+shift+I`（Windows/Linux）

### 多文件插入功能
1. 将光标定位到目标块
2. 使用以下方式之一打开文件选择器：
   - 斜杠命令：`/📂 Insert multiple files from local folder`
   - 快捷键：`shift+alt+i`
3. 选择一个或多个文件
4. 插件会自动将所选文件转换为嵌入格式：
   - 第一个文件插入到当前块
   - 其他文件会自动创建为同级块

## 示例

### 路径转换示例

输入:
```
/Users/username/recording.mp3
/Users/username/image.jpg
```

转换后:
```
![](/Users/username/recording.mp3)
![](/Users/username/image.jpg)
```

### 多文件插入示例

选择多个文件后，会生成如下格式的块：
```
![](/path/to/first/file.jpg)

![](/path/to/second/file.pdf)

![](/path/to/third/file.mp3)
```

## 使用注意

路径转换功能只会处理以下内容：
- 包含文件扩展名（如 .mp3, .txt）
- 符合文件路径格式（以 / 或 C:\ 开头，包含路径分隔符）

示例有效路径：
```
/Users/name/file.mp3
C:\Documents\file.txt
./folder/image.jpg
~/Downloads/document.pdf
file_with_extension.md
```

## 快捷键

- 路径转换：`cmd+shift+I`（macOS）或 `ctrl+shift+I`（Windows/Linux）
- 多文件插入：`shift+alt+i`（所有平台）

## 致谢

感谢 [logseq-plugin-multiple-assets](https://github.com/YU000jp/logseq-plugin-multiple-assets) 插件的作者，提供了多文件插入的思路。