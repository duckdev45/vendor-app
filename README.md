# 🏗️ Fu-Mao Vendor App

## ⚙️ Tech Stack

- **Core**: [React Native (Expo)](https://expo.dev) + [React 19](https://react.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [NativeWind v4](https://www.nativewind.dev) (Tailwind CSS for RN)
* **Routing**: [Expo Router](https://docs.expo.dev/router/introduction) (File-based routing)
- **State/Async**: [TanStack Query (React Query)](https://tanstack.com/query)
- **Validation**: [Zod](https://zod.dev) (Schema Validation)
- **Hardware**: `expo-camera`, `expo-sensors` (自動水平偵測), `react-native-view-shot` (浮水印合成)

---

## 🎨 Theme & Styling

This project uses **NativeWind v4** for styling, which allows us to use Tailwind CSS utility classes in a React Native environment.

### Core Concepts

1.  **CSS Variables for Theming**:
    The entire color system (light and dark mode) is managed through CSS variables defined in `global.css`.

    -   The `:root` selector defines the default (light) theme colors.
    -   The `.dark` selector defines the overrides for the dark theme.
    -   Semantic color names (e.g., `--background`, `--foreground`, `--primary`, `--card`) are used for consistency.

2.  **Tailwind Configuration**:
    `tailwind.config.js` is configured to use these CSS variables. For example, `colors.background` is mapped to `rgb(var(--background))`. This makes utility classes like `bg-background` and `text-foreground` automatically theme-aware.

3.  **`darkMode: 'class'` Strategy**:
    The dark mode is activated by adding the `dark` class to an ancestor element in the component tree.

### Architectural Pattern for Theme Switching

To avoid conflicts with Expo Router's navigation context, a specific architectural pattern is used:

-   **`app/_layout.tsx` (Root Layout)**: This file is kept minimal. It sets up the global `ThemeProvider` from React Navigation but **does not** apply any dynamic `className` for theming. This ensures the root navigator remains stable and does not crash upon theme changes.

-   **`app/(tabs)/_layout.tsx` (Tab Layout)**: This file is the key to our theme-switching implementation.
    -   It uses the `useColorScheme` hook from NativeWind to get the current theme (`'light'` or `'dark'`).
    -   It wraps the `<Tabs>` component in a `<View className={colorScheme}>`.
    -   This `View` acts as the container for all five tab screens, providing the necessary `.dark` class to its children. This allows all screens to correctly apply their dark mode styles without interfering with the parent navigation context.

This structure ensures that the app is both stable and correctly themed.

---

## Project Structure

採用 **功能導向 (Feature-based)** 搭配 **三層式架構** 來組織程式碼

```text
vendor-app/
├── 📂 app/                 # 頁面路由 (Expo Router)
│   ├── (tabs)/            # 底部導航頁 (首頁、相機、任務、設定)
│   └── _layout.tsx        # 全域佈局與 Theme Provider
│
├── 📂 components/          # UI 元件 (Atomic Design)
│   ├── ui/                # 基礎元件 (Button, Input, Card...)
│   └── ...
│
├── 📂 lib/                 # 第三方套件設定
│   └── api-client.ts       # Axios 實例 (攔截器、Token 注入)
│
├── 📂 services/            # API 服務層 (純邏輯，無 React)
│   └── task.service.ts    # 定義 Endpoint 與 fetch 邏輯
│
├── 📂 schemas/             # 資料驗證層 (Zod)
│   └── task.schema.ts     # 定義資料型別與驗證規則
│
├── 📂 hooks/               # React Hooks
│   └── queries/           # TanStack Query 封裝 (useTasks, useUpload...)
│
├── constants/           # 靜態常數 (Colors, Fonts)
├── global.css           # 全域樣式 (NativeWind v4 主題變數)
└── tailwind.config.js   # Tailwind 設定