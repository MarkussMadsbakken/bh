"use client";

import { useRef, forwardRef } from "react";

export const Button = ({ variant, children, className, onClick, ...rest }: { variant?: string, children?: React.ReactNode, className?: string, onClick?: () => void }) => {
    return (
        <button
            className={
                variant == "primary"
                    ? ` px-7 py-2 max-w-full h-full rounded-lg border hover:bg-neutral-100 active:bg-neutral-200 ${className}`
                    : ` px-7 py-2 max-w-full h-full rounded-lg bg-white border-2 hover:bg-blue-700 text-blue-500 border-blue-500 ${className}`
            }
            {...rest}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

interface TextInputProps {
    placeholder?: string;
    value?: string;
    onSubmit?: (s: string) => void;
    onChange?: (s: string) => void;
    className?: string;
    textCentered?: boolean;
    onEnterClear?: boolean;
    onEnterBlur?: boolean;
    type?: string;
    acceptedValues?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TextInput = forwardRef(function TextInput(props: TextInputProps, ref: any) {
    let element = useRef<HTMLInputElement>(null);
    if (ref) element = ref

    //placeholder
    let pl = "Placeholder...";
    if (props.placeholder) {
        pl = props.placeholder;
    }

    const alwaysAcceptValues = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Tab",
    ];

    //function to handle key down
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, acceptedValues?: string[]) {
        if (acceptedValues) {
            if (!acceptedValues.includes(e.key)) {
                if (!alwaysAcceptValues.includes(e.key)) {
                    e.preventDefault();
                    //add animation?
                }
            }
        }
    }

    //function to handle submit
    function handleSubmit(text: string) {
        if (props.onEnterBlur) element?.current?.blur();

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        props.onEnterClear ? element?.current ? (element.current.value = "") : null : null;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        props.onSubmit ? props.onSubmit(text) : {};
    }

    const heightset = props.className?.includes("h-");

    return (
        <div className={`min-w-52 ${heightset ? "" : "h-full"} flex flex-row align-middle bg-neutral-100 border border-neutral-200 rounded-lg p-1 ${props.className}`}>
            <input
                ref={element}
                type={props.type ? props.type : "text"}
                className={`w-full h-full bg-transparent outline-none px-3 ${props.textCentered || props.textCentered == undefined ? " text-center" : ""}}`}
                placeholder={pl}
                defaultValue={props.value}
                onChange={(e) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    props.onChange ? props.onChange(e.target.value) : null;
                }}
                onKeyDown={(e) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    e.key === "Enter"
                        ? handleSubmit(element.current ? element.current.value : "")
                        : handleKeyDown(e, props.acceptedValues);
                }}
            />
        </div>
    );
});