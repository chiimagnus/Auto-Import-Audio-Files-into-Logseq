# File Path to Embed Converter

这是一个 Logseq 插件，用于快速将文件路径转换为 Logseq 的嵌入语法。

## 功能

- 将文件路径自动转换为 Logseq 的嵌入语法`![](FilePath)`

## 使用方法

1. 在 block 中输入文件的绝对路径
2. 使用斜杠命令 `/Convert to Embed` ，或者使用快捷键`cmd+shift+I`
3. 插件会自动将路径转换为 `![](FilePath)` 格式

## 示例

输入:
```
/Users/username/recording.mp3
```

转换后:
```
![](/Users/username/recording.mp3)
```

## 使用注意

插件只会转换以下内容：
- 包含文件扩展名（如 .mp3, .txt）
- 符合文件路径格式（以 / 或 C:\ 开头，包含路径分隔符）

示例有效内容：
```
/Users/name/file.mp3

C:\Documents\file.txt

./folder/image.jpg

~/Downloads/document.pdf

file_with_extension.md
```

## 致谢

感谢 [logseq-plugin-multiple-assets](https://github.com/YU000jp/logseq-plugin-multiple-assets) 插件的作者，提供了多文件插入的思路。