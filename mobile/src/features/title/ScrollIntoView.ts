import { createContext, useContext } from 'react';
import type { View } from 'react-native';

type ScrollIntoView = (node: View | null) => void;

/** Provided by the title screen's scroll view: brings a focused input clear of the keyboard. */
export const ScrollIntoViewContext = createContext<ScrollIntoView>(() => {});

export const useScrollIntoView = () => useContext(ScrollIntoViewContext);
