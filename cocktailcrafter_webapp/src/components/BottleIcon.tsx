import React from 'react';

export const BottleIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M9 5H15V8C15 8 18 9 18 12V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V12C6 9 9 8 9 8V5Z"
            fill={color}
        />
        <path
            d="M9 3H15V5H9V3Z"
            fill={color}
        />
        {/* Label outline effect */}
        <path
            d="M8 12C8 11.5 9.5 11 12 11C14.5 11 16 11.5 16 12V17C16 17.5 14.5 18 12 18C9.5 18 8 17.5 8 17V12Z"
            fill="black"
            fillOpacity="0.2"
        />
    </svg>
);
