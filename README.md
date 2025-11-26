# YouTube Summary App

YouTube動画のURLを入力するだけで、AIが動画の内容を要約してくれるモバイルアプリです。

## スクリーンショット

| ホーム画面 | 要約結果 |
|:---:|:---:|
| ![ホーム](docs/01_home.png) | ![要約](docs/02_1_summary.png) |

## 機能

- YouTube URLを入力して動画の要約を取得
- 要約結果をクリップボードにコピー

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | React Native, Expo, TypeScript |
| バックエンド | Ruby on Rails, Solid Queue |
| AI | Google Gemini 1.5 |
| 外部API | YouTube Transcript API |

## システム構成

![アーキテクチャ図](docs/00_youtube-summary-flow.png)

## ローカル開発

```bash
npm install
npx expo start
```

詳細は [docs/development.md](docs/development.md) を参照。
