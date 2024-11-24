import React, { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react';

interface ModalContextProps {
    modals: number[]; // Stack of modal IDs
    addModal: () => number; // Returns the new modal's ID
    removeModal: (id: number) => void;
    isTopModal: (id: number) => boolean;
}

const ModalContext = createContext<ModalContextProps>({
    modals: [],
    addModal: () => 0,
    removeModal: () => { },
    isTopModal: () => false,
});

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modals, setModals] = useState<number[]>([]);
    const idCounter = useRef<number>(0);

    const addModal = useCallback((): number => {
        idCounter.current += 1;
        const newId = idCounter.current;
        setModals(prev => [...prev, newId]);
        return newId;
    }, []);

    const removeModal = useCallback((id: number) => {
        setModals(prev => prev.filter(modalId => modalId !== id));
    }, []);

    const isTopModal = useCallback((id: number): boolean => {
        return modals.length > 0 && modals[modals.length - 1] === id;
    }, [modals]);

    useEffect(() => {
        if (modals.length > 0) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [modals]);

    return (
        <ModalContext.Provider value={{ modals, addModal, removeModal, isTopModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModalContext = () => useContext(ModalContext);