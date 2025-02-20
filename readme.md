# File Path Transformer

这是一个 Logseq 插件，提供两个主要功能：
1. 将文件路径转换为 Logseq 的嵌入语法
2. 快速从本地文件夹选择并插入多个文件

## 1. 路径转换功能
- 将文件路径自动转换为 Logseq 的嵌入语法 `![](FilePath)`
- 支持批量处理多个块
- 支持处理单个块中的多行路径
- 智能识别有效的文件路径

### 使用方法
1. 在 block 中输入一个或多个文件的绝对路径（换行符分隔）
2. 使用以下方式之一触发转换：
   - 斜杠命令：`/Convert to Embed`
   - 快捷键：`cmd+shift+I`（macOS）或 `ctrl+shift+I`（Windows）

### 示例
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

输入：
```
'/path1.mp3' '/path2.mp3' '/path3.mp3'
```

输出（分散到三个block中）：
```
![](/path1.mp3)
![](/path2.mp3)
![](/path3.mp3)
```


## 2. 多文件插入功能
- 通过文件选择器一次选择多个文件
- 自动获取文件的绝对路径
- 转换为嵌入格式并插入到当前块
- 多个文件会自动插入到同级块中

### 使用方法
1. 将光标定位到目标块
2. 使用以下方式之一打开文件选择器：
   - 斜杠命令：`/📂 Insert multiple files from local folder`
   - 快捷键：`shift+option+i`（macOS）或 `shift+alt+i`（Windows）

### 示例
选择多个文件后，会生成如下格式的块：
```
![](/path/to/first/file.jpg)

![](/path/to/second/file.pdf)

![](/path/to/third/file.mp3)
```

## 致谢

感谢 [logseq-plugin-multiple-assets](https://github.com/YU000jp/logseq-plugin-multiple-assets) ，提供了多文件插入、多语言化的思路。