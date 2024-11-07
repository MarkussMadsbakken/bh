"use client";

import { easeIn, easeInOut, easeOut, motion, stagger, useAnimate } from "framer-motion";
import { useEffect, useState, useRef } from "react";

type reactChild = React.JSX.Element;
type multipleReactChildren = React.JSX.Element[];

export type ButtonVariant = "primary" | "secondary" | "confirm";

export const Button = ({ variant, children, className, onClick, ...rest }: { variant?: ButtonVariant, children?: React.ReactNode, className?: String, onClick?: () => void }) => {
    const ButtonVariantMap = {
        primary: "bg-white border-neutral-500 hover:bg-neutral-300 text-black",
        secondary: "bg-neutral-700 hover:bg-blue-500 text-white",
        confirm: "bg-green-500 hover:bg-green-600 text-white",
    }

    return (
        <button
            className={
                `px-7 py-2 max-w-full max-h-full rounded-lg bg-white border text-black ${variant ? ButtonVariantMap[variant] : ButtonVariantMap.primary} ${className}`
            }
            {...rest}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export const TextInput = ({ placeholder, value, onSubmit, onChange, className, textCentered, onEnterClear, type, acceptedValues }: { placeholder?: string, value?: string, onSubmit?: (s: string) => void, onChange?: (s: string) => void, className?: string, textCentered?: boolean, onEnterClear?: boolean, type?: string, acceptedValues?: string[] }) => {
    const element = useRef<HTMLInputElement>(null);

    //placeholder
    let pl = "Placeholder...";
    if (placeholder) {
        pl = placeholder;
    }

    let alwaysAcceptValues = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Tab",
    ];

    //function to handle key down
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
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
        element?.current?.blur();
        onEnterClear ? element?.current ? (element.current.value = "") : null : null;
        onSubmit ? onSubmit(text) : {};
    }

    return (
        <div className={`min-w-52 flex flex-row bg-white border border-neutral-500 rounded-lg p-1 ${className}`}>
            <input
                ref={element}
                type={type || "text"}
                className={`w-full h-full bg-transparent outline-none px-3 ${textCentered ? " text-center" : ""}}`}
                placeholder={pl}
                defaultValue={value}
                onChange={(e) => {
                    onChange?.(e.target.value);
                }}
                onKeyDown={(e) => {
                    e.key === "Enter"
                        ? handleSubmit(element.current ? element.current.value : "")
                        : handleKeyDown(e);
                }}
            />
        </div>
    );
};

export function TextArea({ placeholder, value, onSubmit, onChange, className, textCentered, onEnterClear }: { placeholder?: string, value?: string, onSubmit?: (s: string) => void, onChange?: (s: string) => void, className?: string, textCentered?: boolean, onEnterClear?: boolean }) {
    const element = useRef<HTMLTextAreaElement>(null);

    //function to handle key down
    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            element?.current?.blur();
            onEnterClear ? element?.current ? (element.current.value = "") : null : null;
            onSubmit ? onSubmit(element.current ? element.current.value : "") : {};
        }
    }

    return (
        <div className={`min-w-52 flex flex-row bg-white border border-neutral-500 rounded-lg p-2 h-fit ${className}`}>
            <textarea
                ref={element}
                className={`w-full h-full bg-transparent outline-none px-2 py-2 ${textCentered ? " text-center" : ""}}`}
                placeholder={placeholder}
                defaultValue={value}
                onChange={(e) => {
                    onChange ? onChange(e.target.value) : null;
                }}
                onKeyDown={(e) => {
                    handleKeyDown(e);
                }}
            />
        </div>
    );
}


/**
 * A dropdown component that displays a list of options and allows the user to select one.
 * @param {Object} props - The props object that contains the properties passed to the component.
 * @param {Array} children - The array of child components that represent the options in the dropdown.
 * @returns {JSX.Element} - The JSX element that represents the dropdown component.
 */
export const Dropdown = ({ children, open, className, placeholder, onSelect }: { children: multipleReactChildren, open?: number, className?: string, placeholder?: string, onSelect?: (n: number) => void }) => {
    const staggerMenuItems = stagger(0.02, { startDelay: 0.1 }); //generates a stagger function for the menu items
    const [isOpen, setIsOpen] = useState(false); //if the dropdown is open
    const [selectedItem, setSelectedItem] = useState(
        open ?? (open == 0 ? open : -1)
    ); //truly the worst code ive ever written
    const [scope, animate] = useAnimate(); //animation scope
    const innerButtonRef = useRef<HTMLDivElement>(null);

    Array.isArray(children) ? children : children = [children];

    if (selectedItem >= children.length) setSelectedItem(-1);

    useEffect(() => {
        //checks if a click is outside the dropdown box
        function checkClick(e: MouseEvent) {
            if (!scope.current.contains(e.target)) {
                setIsOpen(false);
                window.removeEventListener("click", checkClick);
            }
        }

        //adds an event listener to the window to check if a click is outside the dropdown box
        if (isOpen) {
            window.addEventListener("click", checkClick);
        }

        //animaes the dropdown box
        animate(
            "#dropdown",
            {
                clipPath: isOpen
                    ? "inset(0% 0% 0% 0% round 6px)"
                    : "inset(10% 50% 90% 50% round 6px)",
            },
            {
                type: "spring",
                bounce: 0,
                duration: 0.2,
            }
        );

        //animates each dropdown item
        animate(
            ".dropdownItem",
            isOpen
                ? { opacity: 1, scale: 1, filter: "blur(0px)", x: 0 }
                : { opacity: 0, scale: 0, filter: "blur(2px)", x: 50 },
            { duration: 0.15, ease: "easeOut", delay: isOpen ? staggerMenuItems : 0 }
        );

        //animates the arrow icon
        animate(".arrow", isOpen ? { rotate: 180 } : { rotate: 0 }, {
            duration: 0.2,
            ease: "easeOut",
        });

        //removes the event listener when the component is unmounted
        return () => {
            window.removeEventListener("click", checkClick);
        };
    }, [isOpen]);

    useEffect(() => {
        onSelect?.(selectedItem);
    }, [selectedItem])

    if (selectedItem >= children.length) setSelectedItem(-1)

    return (
        <div ref={scope} className={'w-52 h-12 ' + className}>
            <motion.button
                className='w-full h-full flex flex-row justify-between rounded-md border border-neutral-500 bg-white'
                onClick={(e) => {
                    if (innerButtonRef.current?.contains(e.target)) {
                        setSelectedItem(-1);
                        setIsOpen(false);
                        return;
                    }
                    setIsOpen(!isOpen)
                }}
            >
                <div className='px-3 h-full flex justify-center items-center'>
                    {selectedItem === -1 ?
                        placeholder ? placeholder : "Select"
                        : children[selectedItem] ? children[selectedItem].props.children : "Select"}
                </div>

                <div className="flex flex-row self-center">
                    {children[selectedItem] &&
                        <div ref={innerButtonRef} className="self-center w-fit h-fit" onClick={(e) => {
                            console.log("clicked");
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>

                        </div>
                    }
                    <div
                        className='arrow self-center p-2'
                        style={{ transformOrigin: "50% 55%" }}
                    >
                        <svg
                            width='25'
                            height='20'
                            viewBox='-10 -12 20 20'
                            transform='scale(0.6)'
                        >
                            <path d='M -10 -3 C -12 -5 -10 -7 -8 -5 L 0 2 L 0 2 L 8 -5 C 10 -7 12 -5 10 -3 L 1 5 C 0 6 0 6 -1 5' />
                        </svg>
                    </div>
                </div>
            </motion.button>

            <div
                id='dropdown'
                className={`first-letter:flex flex-col justify-center mt-2 overflow-hidden rounded-md border border-neutral-500 bg-white ${isOpen ? "h-fit" : "h-0"}`}
                style={{
                    pointerEvents: isOpen ? "auto" : "none",
                    clipPath: "inset(10% 50% 90% 50% round 10px)",
                }}
            >
                {children.map ? children.map((child, index) => {
                    if (child.type === DropdownHeader) {
                        return (
                            <div key={index} className='dropdownItem flex py-3 px-3 w-full justify-center flex-row'>
                                {child}
                            </div>
                        )
                    }

                    return (
                        < motion.button
                            key={index}
                            className='dropdownItem flex py-3 px-3 w-full'
                            onClick={() => {
                                child.props.onSelect?.();
                                setIsOpen(false);
                                setSelectedItem(index);
                            }}
                            whileHover={{ scale: 1.02, x: 5, fontWeight: 450 }}
                        >
                            {child}
                        </motion.button>
                    )
                })
                    : <motion.button
                        className='dropdownItem flex py-3 px-3 w-full'
                        onClick={() => {
                            children.at(0)?.props.onSelect?.();
                            setIsOpen(false);
                            setSelectedItem(-1);
                        }}
                        whileHover={{ scale: 1.02, x: 5, fontWeight: 450 }}
                    >
                        {children}
                    </motion.button>}
            </div>
        </div >
    );
};

/**
 * A component that represents an item in the dropdown.
 * @param {Object} props - The props object that contains the properties passed to the component.
 * @param {function} [onSelect] - The function to be called when the user selects the item.
 * @param {Array} children - The array of child components that represent the options in the dropdown.
 * @returns {JSX.Element} - The JSX element that represents the dropdown item component.
 */
export const DropdownItem = ({ children, onSelect }: { onSelect?: () => void, children: multipleReactChildren | reactChild | string }) => {
    return <div className='dropdownItem flex text-balance text-start'>{children}</div>;
};

export const DropdownHeader = ({ children }: { children: multipleReactChildren | reactChild | string }) => {
    return <div className='dropdownHeader flex font-bold text-center w-fit'>{children}</div>;
};
