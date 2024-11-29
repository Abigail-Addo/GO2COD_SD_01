import React from 'react';

interface ButtonProps {
    text: string;
    className?: string;
    onClick?: () => void;
}

const PrimaryButton: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-blue-800 text-white px-5 py-2 rounded hover:bg-blue-900 focus:bg-blue-900"
            type="submit"
        >
            {text}
        </button>
    );
};

export default PrimaryButton;

