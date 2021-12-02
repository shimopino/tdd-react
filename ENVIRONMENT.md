# 環境構築

## プロジェクトの初期化

まずはコマンドを実行すればアプリケーションを起動できるようにプロジェクトの初期化を行う。

```bash
npm init vite@latest
> tdd-react

cd tdd-react
npm install
npm run dev
```

## ESLint の初期化

では静的解析に必要なライブラリと設定を追加する。

```bash
# 静的解析ツールの ESLint を導入する
npm install --save-dev eslint

# ESLint の設定ファイルを初期化する
npx eslint --init
```

設定ファイルを作成する際の質問と解答は以下にまとめておく。

<details>
<summary>解答</summary>
<div>

```bash
? How would you like to use ESLint? …
  To check syntax only
❯ To check syntax and find problems
  To check syntax, find problems, and enforce code style

? What type of modules does your project use? …
❯ JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these

? Which framework does your project use? …
❯ React
  Vue.js
  None of these

? Does your project use TypeScript? › Yes

 Where does your code run? …  (Press <space> to select, <a> to toggle all, <i> to invert selection)
✔ Browser
  Node

? What format do you want your config file to be in? …
❯ JavaScript
  YAML
  JSON

The config that you ve selected requires the following dependencies:

eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
? Would you like to install them now with npm? › Yes
```

</div>
</details>

これで `.eslintrc.js` という設定ファイルが作成される。

なお今回は React 17 を使用しているため、[公式サイトの推奨](https://github.com/yannickcr/eslint-plugin-react#configuration) に従って以下のルールセットを追加する。

```js
module.exports = {
  extends: [
    // ...
    'plugin:react/jsx-runtime',
  ],
};
```

次に ESLint の解析対象外であるファイルを `.eslintignore` という設定ファイルを作成する。

```bash
node_modules
dist
coverage
.eslintrc.js
```

## Prettier の導入

コードの解析は ESLint で行っていくが、コードのフォーマットは Prettier というライブラリを使用する。

そのためには、Prettier 自体のインストールと ESLint と Prettier のルールが競合しないための設定を追加する必要がある。

```bash
npm install --save-dev prettier eslint-config-prettier
```

後は `.eslintrc.js` に競合させないための設定を追加する。

```js
module.exports = {
  // ...
  extends: [
    // other packages
    'prettier',
  ],
  // ...
};
```

これで ESLint で解析を実行する際に、フォーマッター側とのルールで競合することは無くなった。

後は Prettier でのフォーマット設定を `.prettierrc.js` ファイルとして追加する。

```js
module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
};
```

## VSCode の設定

現状でコードの静的解析とフォーマットのための設定を追加することはできたが、それぞれをコマンドで実行する必要がある状態なので、VSCode の設定を追加して、ファイルを保存する際に自動的に適用させる。

```bash
mkdir .vscode
touch .vscode/settings.json
```

設定としては以下を採用する。

```js
{
  // ファイルを保存する際にPrettierによるフォーマットを行う
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    // ESLintに対応しているファイルは保存時にESLintによるフォーマットを行う
    // Prettierとは競合しないフォーマットを行う
    "source.fixAll.eslint": true
  }
}
```

## 追加の ESLint の導入

現状の ESLint のルールセットはデフォルトで作成されたものに、Prettier の設定を追加したのみである。

チームで開発する際には、これだけでは不足しているため、普段使用している ESLint のルールセットを追加する。

- `eslint-plugin-react-hooks`
  - React の公式が推奨する Hooks のルール
- `eslint-plugin-jsx-a11y`
  - アクセシビリティの標準ルール
- `eslint-plugin-import`
  - ライブラリの import の順番を統一
- `eslint-plugin-unused-imports`
  - 不要な import を検知
- `eslint-import-resolver-typescript`

```bash
npm install --save-dev \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y \
  eslint-plugin-import \
  eslint-plugin-unused-imports \
  eslint-import-resolver-typescript
```

それでは追加したライブラリのルールを `.eslintrc.js` に反映させていく。

```js
module.exports = {
  extends: [
    // ...
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    // ...
  ],
  // ...
  plugins: ['react', '@typescript-eslint', 'unused-imports'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
```

これで実装を進めていく準備が整った。

## Jest の導入

TypeScript で記述されている実装のテストを行うために、テスティングフレームワークである Jest を追加する。

```bash
# テストライブラリを追加する
npm install --save-dev \
  jest \
  @types/jest \
  ts-jest
```

次にテストを実行するための設定ファイルを作成する。

```bash
npx ts-jest config:init
```

これで以下のような設定ファイルが作成される。

```js
module.exports = {
  preset: 'ts-jest',
  // デフォルトだと testEnvironment: 'node' が生成されるがブラウザなので以下に修正
  testEnvironment: 'jsdom',
};
```

ここでテストが実行できるか確認するためのサンプルファイルを用意する。

- `src/sample/index.ts`

  ```ts
  export const add = (a: number, b: number) => a + b;
  ```

- `src/sample/index.spec.ts`

  ```ts
  import { add } from '.';

  describe('動作検証用', () => {
    it('足し算のテスト', () => {
      expect(add(1, 2)).toBe(3);
    });
  });
  ```

試しに `package.json` にテストを実行するためのコマンドを追加して、ターミナルでテストの実行結果を確認する。

```bash
❯❯❯ npm run test

> tdd-react@0.0.0 test
> jest

 PASS  src/smaple.spec.ts
  動作検証用
    ✓ 足し算のテスト (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.294 s, estimated 2 s
Ran all test suites.
```

これでテストを実行する準備が整った。

## Jest 用の ESLint を追加

テストファイルのコード品質も一定に保つためにテスト用の静的解析ルールを追加する。

```bash
npm install --save-dev eslint-plugin-jest
```

設定ファイルにも推奨されているルールセットを反映できる様にしておく。

```js
module.exports = {
  extends: [
    // ...
    'plugin:jest/recommended',
    // ...
  ],
};
```

## React Testing Library の導入

フロントエンドの開発を行っていく際は、ボタンや入力欄などの細かい粒度のコンポーネントをベースにして、ユーザー登録フォームやお問合せフォームなどのより具体的な機能を作成していく。

この場合に、コンポーネントに対してもテストを実行できる様にするため、React Testing Library を導入する。

```bash
# Reactのテスト用ライブラリを追加する
npm install --save-dev \
  @testing-library/jest-dom \
  @testing-library/dom \
  @testing-library/react \
  @testing-library/user-event

# React Testing LibraryがおすすめするESLintルールを導入する
npm install --save-dev \
  eslint-plugin-jest-dom \
  eslint-plugin-testing-library
```

ESLint の設定ファイルにも推奨されているルールセットを反映できる様にしておく。

```js
module.exports = {
  extends: [
    // ...
    'plugin:testing-library/react',
    // ...
  ],
};
```

## React Testing Library の挙動確認

ではユーザーのログインフォームのコンポーネントを作成し、実際にテストを行っていく。この際にサーバーからの HTTP レスポンスをモックするために、`msw` を導入する。

```bash
npm install --save-dev msw
```

ではサンプルとしてメールアドレスとパスワードを送信するログインフォーム `src/sample/LoginForm.tsx` を作成する。

<details>
<summary>`src/sample/LoginForm.tsx`</summary>
<div>

```tsx
import { useState } from 'react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('typing');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus('submitting');
    try {
      await fetch('https://exmaple.com/login', {
        method: 'post',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setStatus('success');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus('typing');
      }
    }
  };

  if (status === 'submitting') {
    return <h1>Submitting</h1>;
  }

  if (status === 'suceess') {
    return <h1>Success</h1>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={handleEmailChange}
      />
      <label htmlFor="password">Passowrd</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

</div>
</details>

React Testing Library を使用すれば上記のログインフォームに対するユーザーのインタラクションに関するテストを実行することが可能である。

## 三目並べの実装

[src](./src) 以下に公式チュートリアルの実装サンプルを追加している。

## Storybook の導入

[公式サイト](https://storybook.js.org/blog/storybook-for-vite/) の手順に従い Vite の環境に Storybook を導入する。

```bash
# コンポーネントテスト用のライブラリを追加する
npx sb@next init --builder storybook-builder-vite
>
...
✅ Configuring eslint rules in .eslintrc.js
✅ Adding Storybook to extends list
✅ fixed eslintPlugin
```

また以下の様な設定ファイルが作成されているはずである。

```js
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  core: {
    builder: 'storybook-builder-vite',
  },
};
```

あとはコマンドを実行すれば、Storybook を起動できることがわかる。

## VRT の用意

では次に Storybook でコンポーネント化した `.stories.*` ファイルに対してスクリーンショットを撮影するために、以下のライブラリを導入する。

```bash
npm install --save-dev storycap puppeteer
```

次にスクリーンショットを生成するためのコマンドを追加する。これで各 `.stories.*` ファイルのスクリーンショットを保存できる様になる。

```json
{
  "scripts": {
    "storycap": "storycap --serverCmd \"npm run storybook\" http://localhost:6006 --serverTimeout 60000"
  }
}
```

実際にコマンドを実行すると、以下のように 1 つ 1 つのストーリーに対してスクリーンショットが撮影されていることがわかる。

```bash
./__screenshots__
├── Board
│   ├── All\ O.png
│   ├── All\ Triangle.png
│   ├── All\ X.png
│   └── Default.png
├── Game
│   ├── Default.png
│   ├── Tuen\ No\ 8\ Winner\ O.png
│   ├── Turn\ No\ 1.png
│   ├── Turn\ No\ 2.png
│   └── Turn\ No\ 5.png
├── Move
│   ├── Default.png
│   └── Second\ Tern.png
├── Square
│   ├── Default.png
│   ├── O.png
│   └── X.png
└── Status
    ├── Default.png
    ├── Draw.png
    └── Winner.png
```

## req-suit の追加

では最後に撮影されたスクリーンショットを使用して、画像の差分を検出するためのライブラリを追加する。

```bash
npm install --save-dev reg-suit
```

以下のコマンドで設定を初期化することができる。

```bash
❯❯❯ npx reg-suit init

[reg-suit] info version: 0.11.1
? Plugin(s) to install (bold: recommended)  reg-keygen-git-hash-plugin : Detect the snapshot key to be compare
 with using Git hash.
[reg-suit] info Install dependencies to the local directory. This procedure takes some minutes, please wait.
? Working directory of reg-suit. .reg
? Append ".reg" entry to your .gitignore file. Yes
? Directory contains actual images. __screenshots__
? Threshold, ranges from 0 to 1. Smaller value makes the comparison more sensitive. 0
[reg-suit] info Configuration:
[reg-suit] info {
  "core": {
    "workingDir": ".reg",
    "actualDir": "__screenshots__",
    "thresholdRate": 0,
    "addIgnore": true,
    "ximgdiff": {
      "invocationType": "client"
    }
  },
  "plugins": {
    "reg-keygen-git-hash-plugin": true
  }
}
? Update configuration file Yes
? Copy sample images to working dir Yes
[reg-suit] info Initialization ended successfully ✨
[reg-suit] info Execute 'reg-suit run' ⭐
```

これで以下の様な設定ファイルが作成される。

```js
{
  "core": {
    "workingDir": ".reg",
    "actualDir": "__screenshots__",
    "thresholdRate": 0,
    "addIgnore": true,
    "ximgdiff": {
      "invocationType": "client"
    }
  },
  "plugins": {
    "reg-keygen-git-hash-plugin": true
  }
}
```

これでコマンドを実行すれば、比較用のファイルが作成される。

```bash
npm run vrt
```

プロジェクトで使用する場合には AWS S3 や Github との連携を行う必要があるが、今回はローカル環境で動作を検証する。

そのため作成されたスクリーンショットを比較用の `.reg/expected` フォルダにコピーする。

```bash
cp -rf __screenshots__/* .reg/expected
```

あとはコンポーネントのスタイルを変更して、再度スクリーンショットの撮影と比較コマンドの実行をすれば、以下の様に差分を検出した状態のレポートが出力される。

![](./Visual%20Regression%20Testing.gif)
