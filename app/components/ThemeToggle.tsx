import { ChangeEvent, useEffect, useState } from "react";
import { useTheme } from "~/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <input
        type="checkbox"
        id="theme-toggle"
        checked={theme === "dark"}
        onChange={handleChange}
        className="hidden"
      />
      <label
        htmlFor="theme-toggle"
        className="cursor-pointer flex items-center"
      >
        <div className="relative">
          <div className="w-10 h-6 bg-gray-400 rounded-full shadow-inner"></div>
          <div
            className={`absolute w-6 h-6 bg-white rounded-full shadow -left-1 top-0 transition ${
              theme === "dark" ? "transform translate-x-full bg-indigo-500" : ""
            }`}
          ></div>
        </div>
        <span className="ml-3">{theme === "dark" ? "Dark" : "Light"} Mode</span>
      </label>
    </div>
  );
};

export default ThemeToggle;
