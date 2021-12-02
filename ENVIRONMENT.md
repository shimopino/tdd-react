# 環境構築

まずはコマンドを実行すればアプリケーションを起動できるようにプロジェクトの初期化を行う。

```bash
npm init vite@latest
> tdd-react

cd tdd-react
npm install
npm run dev
```

必要なライブラリを追加する。

```bash
# テスト用のライブラリを追加する
npm install --save-dev jest ts-jest @types/jest

# Reactのテスト用ライブラリを追加する
npm install --save-dev @testing-library/dom @testing-library/react @testing-library/user-event

# コンポーネントテスト用のライブラリを追加する
npx sb@next init --builder storybook-builder-vite

# E2E用のライブラリを追加する
npm install --save-dev cypress @testing-library/cypress

# 静的解析用のライブラリを追加する
npm install --save-dev eslint-plugin-jest-dom eslint-plugin-testing-library eslint-plugin-cypress
```
