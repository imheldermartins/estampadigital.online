"use client";

import { createContext, Dispatch, useContext, useState } from "react";
import { STATIC_COLORS } from "../utils/pallete";
import { DefaultProviderProps } from ".";

type ThemeContextType = {
    theme: STATIC_COLORS;
    setTheme: Dispatch<React.SetStateAction<STATIC_COLORS>>;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const Theme = ({
    children
}: DefaultProviderProps) => {
    const [theme, setTheme] = useState<STATIC_COLORS>("red");
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context || context === null) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
