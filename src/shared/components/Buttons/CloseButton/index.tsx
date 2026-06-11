import React from 'react';
import close_icon from './close_icon.svg';

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-all duration-200 active:scale-95"
    >
      <img src={close_icon} alt="Close" className="w-4 h-4 opacity-70" />
    </button>
  );
};

export default CloseButton;
