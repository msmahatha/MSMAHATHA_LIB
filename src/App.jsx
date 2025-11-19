import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import GateLayer from './components/GateLayer';
import MainLayout from './components/MainLayout';

function App() {
  const [gateOpen, setGateOpen] = useState(false);

  const handleEnter = () => {
    console.log('handleEnter called, setting gateOpen to true');
    setGateOpen(true);
  };

  console.log('App rendering, gateOpen:', gateOpen);

  return (
    <AppProvider>
      <div className="font-body h-full w-full relative">
        {!gateOpen && <GateLayer isOpen={gateOpen} onEnter={handleEnter} />}
        {gateOpen && <MainLayout isVisible={gateOpen} />}
      </div>
    </AppProvider>
  );
}

export default App;
