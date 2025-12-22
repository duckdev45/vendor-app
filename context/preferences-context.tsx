import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PreferencesContextType = {
    fontScale: number;
    setFontScale: (scale: number) => void;
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider = ({children}: { children: React.ReactNode }) => {
    // 預設 1.0 (標準大小)
    const [fontScale, setFontScaleState] = useState(1.0);

    useEffect(() => {
        // 啟動時讀取設定
        AsyncStorage.getItem('user_font_scale').then(val => {
            if (val) setFontScaleState(parseFloat(val));
        });
    }, []);

    const setFontScale = async (scale: number) => {
        setFontScaleState(scale);
        await AsyncStorage.setItem('user_font_scale', scale.toString());
    };

    return (
        <PreferencesContext.Provider value={{fontScale, setFontScale}}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => {
    const context = useContext(PreferencesContext);
    if (!context) throw new Error('usePreferences must be used within a PreferencesProvider');
    return context;
};