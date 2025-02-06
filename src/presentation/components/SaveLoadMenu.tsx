import React, { useState, useEffect } from 'react';
import { SaveManager } from '../../application/persistence/SaveManager';

interface SaveLoadMenuProps {
  saveManager: SaveManager;
  onSave: (slot: number) => void;
  onLoad: (slot: number) => void;
}

export const SaveLoadMenu: React.FC<SaveLoadMenuProps> = ({ saveManager, onSave, onLoad }) => {
  const [slots, setSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number>(1);

  useEffect(() => {
    const loadSlots = async () => {
      const availableSlots = await saveManager.listSaveSlots();
      setSlots(availableSlots);
    };
    loadSlots();
  }, [saveManager]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Save/Load Game</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Save Slot</label>
        <input
          type="number"
          min={1}
          max={10}
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div className="space-x-4">
        <button
          onClick={() => onSave(selectedSlot)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Game
        </button>
        <button
          onClick={() => onLoad(selectedSlot)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={!slots.includes(selectedSlot)}
        >
          Load Game
        </button>
      </div>

      {slots.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Available Save Slots</h3>
          <div className="grid grid-cols-5 gap-2">
            {slots.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`p-2 text-center rounded ${
                  selectedSlot === slot ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                Slot {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};