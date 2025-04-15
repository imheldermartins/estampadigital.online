import React from "react";
import { Theme } from "./Theme";

export type DefaultProviderProps = {
    children: React.ReactNode;
};

export default function AppContext(props: DefaultProviderProps) {
    return (
        <Theme>{props.children}</Theme>
    );
}