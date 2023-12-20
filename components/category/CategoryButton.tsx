import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
    mode?: 'default' | 'outlined' 
    // Add your custom properties here.
}

/**
 * Default style for buttons using Tailwind CSS.
 */

const defaultStyle = "bg-[#3788FD] hover:bg-gray-200 hover:text-[#3788FD] text-white font-bold py-2 px-10 rounded min-w-[156px] max-w-[156px]";
const outlinedStyle = "bg-transparent border-2 border-[#3788FD] hover:bg-gray-200 text-[#3788FD] font-bold py-2 px-10 rounded min-w-[156px] max-w-[156px]";

const disabledButton = " opacity-50 cursor-not-allowed";

function getButtonClassNames(mode?: 'default' | 'outlined', disabled?: boolean): string {
    let className: string;
    if (mode === "default") {
        className = defaultStyle + (disabled ? disabledButton : "")
    }
    else if (mode == "outlined") {
        className = outlinedStyle + (disabled ? disabledButton : "")
    }
    else {
        className = defaultStyle + (disabled ? disabledButton : "")
    }
    return className;
}

export const CategoryButton: React.FC<ButtonProps> = (
    props
) => {
    const buttonClassNames = getButtonClassNames(props.mode, props.disabled)
        const finalButtonClassNames = props.className ? `${buttonClassNames} ${props.className}` : buttonClassNames
        return (
            <button disabled={props.disabled} {...props} className={finalButtonClassNames}>
                {props.text}
            </button>
        )

}