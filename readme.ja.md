# File Path Transformer

[中文](./readme.md) | [English](./readme.en.md) | [日本語](./readme.ja.md)

このLogseqプラグインは、主に2つの機能を提供します：
1. ファイルパスをLogseqの埋め込み構文に変換
2. ローカルフォルダから複数のファイルをクイック挿入

## 1. パス変換機能
- ファイルパスを自動的にLogseqの埋め込み構文 `![](FilePath)` に変換
- 複数のブロックの一括処理に対応
- 単一ブロック内の複数パスを処理
- 有効なファイルパスのスマート検出

### 使用方法
1. ブロック内に1つまたは複数のファイルの絶対パスを入力（改行で区切る）
2. 以下のいずれかの方法で変換を実行：
   - スラッシュコマンド：`/Convert to Embed`
   - ショートカット：`cmd+shift+I`（macOS）または`ctrl+shift+I`（Windows）

### 例
入力:
```
/Users/username/recording.mp3
/Users/username/image.jpg
```

変換後:
```
![](/Users/username/recording.mp3)
![](/Users/username/image.jpg)
```

入力：
```
'/path1.mp3' '/path2.mp3' '/path3.mp3'
```

出力（3つのブロックに分割）：
```
![](/path1.mp3)
![](/path2.mp3)
![](/path3.mp3)
```

## 2. 複数ファイル挿入機能
- ファイル選択ダイアログで複数のファイルを一度に選択
- ファイルの絶対パスを自動取得
- 埋め込み形式に変換して現在のブロックに挿入
- 複数のファイルは自動的に同じレベルのブロックに挿入

### 使用方法
1. カーソルを目的のブロックに配置
2. 以下のいずれかの方法でファイル選択ダイアログを開く：
   - スラッシュコマンド：`/📂 Insert multiple files from local folder`
   - ショートカット：`shift+option+i`（macOS）または`shift+alt+i`（Windows）

### 例
複数のファイルを選択すると、以下の形式でブロックが生成されます：
```
![](/path/to/first/file.jpg)

![](/path/to/second/file.pdf)

![](/path/to/third/file.mp3)
```

## 謝辞

[logseq-plugin-multiple-assets](https://github.com/YU000jp/logseq-plugin-multiple-assets) に感謝します。複数ファイルの挿入と多言語化のアイデアを提供していただきました。 