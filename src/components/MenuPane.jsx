import React from 'react';

const MenuPane = ({ selectedConsoles, onConsoleChange, onStartQueue }) => {
  const consoles = [
    { id: 'PlayStation 2', label: 'PlayStation 2' },
    { id: 'PlayStation 3', label: 'PlayStation 3' }
  ];

  const handleConsoleToggle = (consoleId) => {
    if (selectedConsoles.includes(consoleId)) {
      onConsoleChange(selectedConsoles.filter(id => id !== consoleId));
    } else {
      onConsoleChange([...selectedConsoles, consoleId]);
    }
  };

  return (
    <div className="w-80 bg-[#1a1a1a] p-6 flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-white text-xl font-voltaire mb-4">Preferred consoles</h2>
        <div className="space-y-3 bg-[#2b2b2b] p-4 rounded">
          {consoles.map((console) => (
            <label 
              key={console.id}
              className="flex items-center space-x-3 text-white cursor-pointer hover:text-gray-300 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedConsoles.includes(console.id)}
                onChange={() => handleConsoleToggle(console.id)}
                className="w-4 h-4 text-[#480e0e] bg-gray-700 border-gray-600 rounded focus:ring-[#480e0e] focus:ring-2"
              />
              <span className="font-voltaire">{console.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={onStartQueue}
          disabled={selectedConsoles.length === 0}
          className={`w-full py-4 px-6 text-xl font-voltaire font-bold uppercase transition-colors ${
            selectedConsoles.length === 0
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-[#480e0e] hover:bg-[#5a1010] text-white'
          }`}
        >
          START QUEUE
        </button>
      </div>
    </div>
  );
};

export default MenuPane; 