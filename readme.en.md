# File Path Transformer

[中文](./readme.md) | [English](./readme.en.md) | [日本語](./readme.ja.md)

A Logseq plugin that provides two main features:
1. Convert file paths to Logseq embed syntax
2. Quick insert multiple files from local folder

## 1. Path Conversion Feature
- Automatically converts file paths to Logseq embed syntax `![](FilePath)`
- Supports batch processing of multiple blocks
- Handles multiple paths in a single block
- Smart detection of valid file paths

### Usage
1. Enter one or more absolute file paths in a block (separated by newlines)
2. Trigger conversion using one of the following methods:
   - Slash command: `/Convert to Embed`
   - Shortcut: `cmd+shift+I` (macOS) or `ctrl+shift+I` (Windows)

### Examples
Input:
```
/Users/username/recording.mp3
/Users/username/image.jpg
```

After conversion:
```
![](/Users/username/recording.mp3)
![](/Users/username/image.jpg)
```

Input:
```
'/path1.mp3' '/path2.mp3' '/path3.mp3'
```

Output (split into three blocks):
```
![](/path1.mp3)
![](/path2.mp3)
![](/path3.mp3)
```

## 2. Multiple Files Insert Feature
- Select multiple files at once using file picker
- Automatically get absolute file paths
- Convert to embed format and insert into current block
- Multiple files are automatically inserted into sibling blocks

### Usage
1. Position cursor in target block
2. Open file picker using one of the following methods:
   - Slash command: `/📂 Insert multiple files from local folder`
   - Shortcut: `shift+option+i` (macOS) or `shift+alt+i` (Windows)

### Example
After selecting multiple files, blocks will be generated in this format:
```
![](/path/to/first/file.jpg)

![](/path/to/second/file.pdf)

![](/path/to/third/file.mp3)
```

## Acknowledgments

Thanks to [logseq-plugin-multiple-assets](https://github.com/YU000jp/logseq-plugin-multiple-assets) for providing ideas on multiple file insertion and internationalization. 