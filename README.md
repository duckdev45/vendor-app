# 🏗️ Fu-Mao Vendor App

## ⚙️ Tech Stack

- **Core**: [React Native (Expo)](https://expo.dev) + [React 19](https://react.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**:
    - [NativeWind v4](https://www.nativewind.dev) (Tailwind CSS for RN)
    - `expo-linear-gradient` (漸層背景)
    - `lucide-react-native` (Icon 庫)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction) (File-based routing)
- **State/Networking**:
    - [TanStack Query (React Query)](https://tanstack.com/query) (Async State Management)
    - [Axios](https://axios-http.com/) (HTTP Client)
- **Validation**: [Zod](https://zod.dev) (Schema Validation)
- **Utilities**:
    - [Day.js](https://day.js.org/) (日期時間處理)
- **Hardware & Device**:
    - `expo-camera` (相機功能)
    - `expo-location` (GPS 定位與反向地理編碼)
    - `expo-sensors` (水平儀與感測器)
    - `expo-haptics` (觸覺回饋)
    - `react-native-view-shot` (浮水印合成與截圖)

---

## 🎨 Theme & Styling

This project uses **NativeWind v4** for styling, which allows us to use Tailwind CSS utility classes in a React Native
environment. The theme system (light/dark mode) is built on three core files: `global.css`, `tailwind.config.js`, and a
specific architectural pattern in the `app` directory.

### 1. `global.css`: The Source of Truth for Colors

All theme colors are defined as CSS variables. This file establishes the color palette for both light and dark modes.

- The `:root` selector defines the default (light) theme.
- The `@media (prefers-color-scheme: dark)` selector defines the overrides for the dark theme.

```css
/* global.css */
@layer base {
    :root {
        --background: 255 255 255;
        --foreground: 9 9 11;
        --primary: 245 158 11;
        /* ... and other light mode colors */
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --background: 9 9 11;
            --foreground: 250 250 250;
            --primary: 251 191 36;
            /* ... and other dark mode colors */
        }
    }
}
```

### 2. `tailwind.config.js`: Consuming CSS Variables

The Tailwind configuration is set up to consume the CSS variables from `global.css`. This is done by referencing the
variables in the `theme.extend.colors` section. This setup makes utility classes like `bg-background` and `text-primary`
automatically theme-aware.

```javascript
// tailwind.config.js
module.exports = {
    // ...
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--background))",
                foreground: "rgb(var(--foreground))",
                primary: {
                    DEFAULT: "rgb(var(--primary))",
                    foreground: "rgb(var(--primary-foreground))",
                },
                // ... and other semantic colors
            },
        },
    },
    // ...
}
```

### 3. Architectural Pattern: Applying the Theme

A specific two-part pattern is used to apply the theme without conflicting with Expo Router's navigation context.

- **`app/_layout.tsx` (Root Layout)**: This file is kept minimal. It sets up the global `ThemeProvider` from React
  Navigation but **does not** apply any dynamic `className` for theming. This ensures the root navigator remains stable
  and does not crash upon theme changes.

- **`app/(tabs)/_layout.tsx` (Tab Layout)**: This file is the key to our theme-switching implementation. It wraps all
  the tab screens in a `View` that dynamically applies the current color scheme as a class (`light` or `dark`).

  ```tsx
  // app/(tabs)/_layout.tsx
  export default function TabLayout() {
      const { colorScheme } = useColorScheme();
      const isDark = colorScheme === 'dark';

      // ... logic for tab bar colors

      return (
          <View className={`${colorScheme} flex-1 bg-background`}>
              <Tabs>
                  {/* All screens here will inherit the theme */}
              </Tabs>
          </View>
      );
  }
  ```

This structure ensures that NativeWind's `darkMode: 'class'` strategy works correctly for all pages, as they are
descendants of the `View` with the `.dark` class applied, while maintaining the stability of the root navigation stack.

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