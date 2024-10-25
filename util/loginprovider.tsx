"use client"

import LoginModal from "@/components/loginmodal";
import { createContext, useContext, useState } from "react";


interface LoginProviderContext {
    open: () => void;
}

const LoginProviderContext = createContext<LoginProviderContext>({} as LoginProviderContext);


export function LoginProvider({ children }: { children: React.ReactNode }) {
    const [modalopen, setmodalopen] = useState(false);
    let _onClose: (success: boolean) => void;

    const open = (onClose?: (success: boolean) => void) => {
        setmodalopen(true);
        if (onClose) _onClose = onClose;
    }


    return (
        <LoginProviderContext.Provider value={{ open }}>
            {modalopen && <LoginModal onFinish={() => { setmodalopen(false); _onClose?.(true) }} onCancel={() => { setmodalopen(false); _onClose?.(false) }} />}
            {children}
        </LoginProviderContext.Provider>
    )
}

export function useLoginModal() {
    return useContext(LoginProviderContext);
}