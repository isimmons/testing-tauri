import { createContext, useEffect, useState, useContext } from "react";

export type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeProviderContext = createContext<ThemeProviderState | null>(
  null
);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = import.meta.env.VITE_THEME_STORAGE_KEY || "thing-1-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme) return storedTheme;
    }
    return defaultTheme === "system" ? getSystemTheme() : defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

function getSystemTheme(): Theme {
  // check if typeof window is undefined
  if (typeof window === "undefined") return "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// export const useTheme = () => {
//   const context = useContext(ThemeProviderContext);
//   if (context === null) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }
//   return context;
// };
