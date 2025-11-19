import React from 'react';

const GateLayer = ({ isOpen, onEnter }) => {
  const handleEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Enter button clicked!');
    if (onEnter) {
      onEnter();
    }
  };

  if (isOpen) {
    return null;
  }

  return (
    <div
      id="gate-container"
      className="fixed inset-0 z-[200] flex flex-col md:flex-row"
    >
      <div className="gate-panel gate-left w-full md:w-1/2 h-1/2 md:h-full bg-neo-yellow border-b-3 md:border-b-0 md:border-r-3 border-neo-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#121212_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <h1 className="font-display text-5xl md:text-7xl text-neo-black z-10 relative text-center leading-tight uppercase px-4">
          MSMAHATHA<br />LIBRARY
        </h1>
      </div>
      <div className="gate-panel gate-right w-full md:w-1/2 h-1/2 md:h-full bg-neo-black flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#fffdf5_0,#fffdf5_1px,transparent_0,transparent_50%)] [background-size:10px_10px]"></div>
        <div className="text-center z-10">
          <p className="text-neo-white mb-6 text-xl font-bold">
            /// UNIVERSAL ARCHIVE RESTORED
          </p>
          <button
            onClick={handleEnter}
            className="bg-neo-pink text-neo-black border-3 border-neo-white px-8 py-4 font-display text-2xl shadow-[6px_6px_0px_0px_#fffdf5] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all pointer-events-auto cursor-pointer"
          >
            ENTER ARCHIVE()
          </button>
        </div>
      </div>
    </div>
  );
};

export default GateLayer;
