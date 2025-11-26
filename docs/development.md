# 開発ガイド

## 前提条件

- Node.js 18.x 以上
- npm または yarn
- Expo CLI
- iOS Simulator (macOS) または Android Emulator、もしくは Expo Go アプリ

## 環境構築

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd youtube-summary-frontend-with-react-native
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定（オプション）

本番環境用に `.env` ファイルを作成：

```bash
# APIエンドポイント
API_BASE_URL=https://your-api-server.com
```

> **注意**: 現在は `src/constants/urls.ts` にURLがハードコードされています。
> 本番環境では環境変数に移行することを推奨します。

### 4. 開発サーバーの起動

```bash
npx expo start
```

起動後、以下の方法でアプリを確認できます：
- `i` - iOS Simulatorで開く
- `a` - Android Emulatorで開く
- `w` - Webブラウザで開く
- Expo Goアプリでスキャン

## プロジェクト構造

```
.
├── app/                    # Expo Router ページ
│   ├── (tabs)/            # タブナビゲーション
│   │   ├── _layout.tsx    # タブレイアウト
│   │   ├── index.tsx      # ホーム画面
│   │   ├── youtube-summary.tsx  # 要約画面
│   │   └── explore.tsx    # 探索画面
│   ├── _layout.tsx        # ルートレイアウト
│   └── +not-found.tsx     # 404ページ
├── components/            # 再利用可能コンポーネント
├── constants/             # 定数定義
├── hooks/                 # カスタムフック
├── src/
│   └── constants/
│       └── urls.ts        # API URL定義
├── assets/                # 画像・フォント
└── docs/                  # ドキュメント
```

## 開発コマンド

```bash
# 開発サーバー起動
npm start

# iOS向け起動
npm run ios

# Android向け起動
npm run android

# Web向け起動
npm run web

# テスト実行
npm test

# Lint実行
npm run lint
```

## バックエンドとの接続

### ローカル開発

1. バックエンドAPIサーバー（Rails）を起動
2. `src/constants/urls.ts` のURLをローカルサーバーに変更

```typescript
export const BASE_URL = "http://localhost:3000";
```

### ngrokを使用する場合

外部デバイスからアクセスする場合は ngrok を使用：

```bash
# バックエンド側でngrokを起動
ngrok http 3000
```

生成されたURLを `src/constants/urls.ts` に設定。

## APIエンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | `/videos` | YouTube URLを送信して要約を開始 |
| GET | `/videos?youtube_url=xxx` | 要約結果を取得（ポーリング） |

### リクエスト例

**POST /videos**
```json
{
  "youtube_url": "https://www.youtube.com/watch?v=xxxxx"
}
```

### レスポンス例

**処理中 (202)**
```json
{
  "status": "processing",
  "message": "要約を生成中です"
}
```

**完了 (200)**
```json
{
  "summary": "動画の要約テキスト..."
}
```

## トラブルシューティング

### Metro Bundlerのキャッシュクリア

```bash
npx expo start --clear
```

### node_modulesの再インストール

```bash
rm -rf node_modules
npm install
```

## 依存関係

### 主要ライブラリ

- **expo** (v51) - React Native開発プラットフォーム
- **expo-router** - ファイルベースルーティング
- **expo-clipboard** - クリップボード操作
- **react-native** (v0.74) - モバイルアプリフレームワーク
- **typescript** - 型安全な開発

## コーディング規約

- TypeScriptを使用
- コンポーネントは関数コンポーネントで記述
- スタイルは StyleSheet.create を使用
- ファイル名はケバブケース（例: `youtube-summary.tsx`）
