import React, { useState } from 'react';
import { Zap, Music, PartyPopper, Building2, Info } from 'lucide-react';
import { visualizationPresets, brandingPresets } from '../config/presets';

/**
 * Preset selector component for quickly applying different visualization settings
 * Designed specifically with DJs and event organizers in mind
 */
const PresetSelector = ({ onSelectPreset, onSelectBrandingPreset }) => {
  const [activeTab, setActiveTab] = useState('dj');
  const [showInfo, setShowInfo] = useState(null);
  const [showBrandingPresets, setShowBrandingPresets] = useState(false);
  
  // Handle visualization preset selection
  const handlePresetSelect = (preset) => {
    onSelectPreset(preset);
  };
  
  // Handle branding preset selection
  const handleBrandingPresetSelect = (preset) => {
    onSelectBrandingPreset(preset);
  };
  
  // Render preset cards
  const renderPresets = () => {
    const presets = showBrandingPresets ? brandingPresets : visualizationPresets[activeTab];
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {Object.entries(presets).map(([key, preset]) => (
          <div 
            key={key} 
            className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-all cursor-pointer relative"
          >
            <div 
              className="p-3"
              onClick={() => showBrandingPresets ? handleBrandingPresetSelect(preset) : handlePresetSelect(preset)}
            >
              <h3 className="text-white font-medium text-sm mb-1">{preset.name}</h3>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400 truncate mr-2">
                  {showBrandingPresets 
                    ? (preset.showText ? "Text & " : "") + (preset.showLogo !== false ? "Logo" : "")
                    : preset.visualizationType + " / " + preset.colorTheme
                  }
                </div>
                <button
                  className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(showInfo === key ? null : key);
                  }}
                >
                  <Info size={14} />
                </button>
              </div>
              
              {/* Info popup */}
              {showInfo === key && (
                <div className="absolute inset-0 bg-gray-900/95 p-3 z-10 flex flex-col">
                  <h4 className="text-white font-medium text-sm mb-1">{preset.name}</h4>
                  <p className="text-gray-300 text-xs flex-grow">{preset.description}</p>
                  <button 
                    className="text-blue-400 text-xs mt-2 self-end"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInfo(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
            
            {/* Preview bar */}
            {!showBrandingPresets && (
              <div 
                className="h-1.5 w-full" 
                style={{
                  background: preset.colorTheme === 'neon' ? 'linear-gradient(90deg, #00c6ff, #0072ff)' :
                    preset.colorTheme === 'fire' ? 'linear-gradient(90deg, #ff416c, #ff4b2b)' :
                    preset.colorTheme === 'cyberpunk' ? 'linear-gradient(90deg, #f953c6, #b967ff)' :
                    preset.colorTheme === 'pastel' ? 'linear-gradient(90deg, #a18cd1, #fbc2eb)' :
                    'linear-gradient(90deg, #ffffff, #5a5a5a)'
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Zap className="mr-2 text-yellow-400" size={20} />
          {showBrandingPresets ? 'Branding Presets' : 'Quick Presets'}
        </h2>
        
        <button
          onClick={() => setShowBrandingPresets(!showBrandingPresets)}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
        >
          {showBrandingPresets ? 'Visuals Presets' : 'Branding Presets'}
        </button>
      </div>
      
      {/* Category tabs - only show for visualization presets */}
      {!showBrandingPresets && (
        <div className="flex space-x-1 border-b border-gray-800 pb-2">
          <button
            onClick={() => setActiveTab('dj')}
            className={`px-3 py-1.5 rounded-t text-sm font-medium flex items-center ${activeTab === 'dj' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
          >
            <Music size={16} className="mr-1.5" />
            DJ Styles
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-t text-sm font-medium flex items-center ${activeTab === 'events' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
          >
            <PartyPopper size={16} className="mr-1.5" />
            Events
          </button>
          <button
            onClick={() => setActiveTab('venues')}
            className={`px-3 py-1.5 rounded-t text-sm font-medium flex items-center ${activeTab === 'venues' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
          >
            <Building2 size={16} className="mr-1.5" />
            Venues
          </button>
        </div>
      )}
      
      {/* Presets grid */}
      {renderPresets()}
      
      {/* Help text */}
      <div className="mt-4 text-xs text-gray-500 italic">
        {showBrandingPresets 
          ? "Branding presets help you quickly set up your logo and text positioning for different scenarios."
          : "Quick presets are tailored for specific environments and music styles."}
      </div>
    </div>
  );
};

export default PresetSelector;