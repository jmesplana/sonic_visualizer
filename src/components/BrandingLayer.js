import React, { useState, useRef, useEffect } from 'react';
import { Move, Type, Image as ImageIcon, Sliders, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

/**
 * BrandingLayer component for displaying custom text and logo
 * Specifically designed for use by DJs, events, and venues to show their branding
 */
const BrandingLayer = ({ isFullScreen, showControls, showBranding, themeColor, brandingSettings }) => {
  // State for text content and styles
  const [brandText, setBrandText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(32);
  const [textOpacity, setTextOpacity] = useState(0.8);
  const [textAlignment, setTextAlignment] = useState('center');
  const [textOutline, setTextOutline] = useState(true);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 85 }); // % of canvas width/height
  const [editingText, setEditingText] = useState(false);
  
  // State for logo content and styles
  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState(15); // % of canvas width
  const [logoOpacity, setLogoOpacity] = useState(0.8);
  const [logoPosition, setLogoPosition] = useState({ x: 10, y: 10 }); // % of canvas width/height
  const [editingLogo, setEditingLogo] = useState(false);
  
  // Update local state when branding settings change
  useEffect(() => {
    if (brandingSettings) {
      // Apply text settings
      if (brandingSettings.textPosition) setTextPosition(brandingSettings.textPosition);
      if (brandingSettings.textSize) setTextSize(brandingSettings.textSize);
      if (brandingSettings.textColor) setTextColor(brandingSettings.textColor);
      if (brandingSettings.textOpacity !== undefined) setTextOpacity(brandingSettings.textOpacity);
      if (brandingSettings.textAlignment) setTextAlignment(brandingSettings.textAlignment);
      if (brandingSettings.textOutline !== undefined) setTextOutline(brandingSettings.textOutline);
      
      // Apply logo settings
      if (brandingSettings.logoPosition) setLogoPosition(brandingSettings.logoPosition);
      if (brandingSettings.logoSize) setLogoSize(brandingSettings.logoSize);
      if (brandingSettings.logoOpacity !== undefined) setLogoOpacity(brandingSettings.logoOpacity);
      
      // Apply text content if provided
      if (brandingSettings.showText !== false && brandingSettings.text) {
        setBrandText(brandingSettings.text || 'Your Event Name');
      }
    }
  }, [brandingSettings]);
  
  // Refs
  const logoInputRef = useRef(null);
  const logoImgRef = useRef(null);
  
  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogo(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Trigger file input click when logo button is clicked
  const handleLogoButtonClick = () => {
    logoInputRef.current.click();
  };
  
  return (
    <>
      {/* Branding elements overlay (logo and text) */}
      {showBranding && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Logo */}
          {logo && (
            <div
              className="absolute"
              style={{
                left: `${logoPosition.x}%`,
                top: `${logoPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                maxWidth: `${logoSize}%`,
                opacity: logoOpacity,
                filter: textOutline ? 'drop-shadow(0 0 4px rgba(0,0,0,0.7))' : 'none',
              }}
            >
              <img 
                src={logo} 
                ref={logoImgRef}
                alt="Brand logo" 
                className="max-w-full h-auto"
              />
            </div>
          )}
          
          {/* Custom Text */}
          {brandText && (
            <div
              className="absolute"
              style={{
                left: `${textPosition.x}%`,
                top: `${textPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                color: textColor,
                fontSize: `${textSize}px`,
                fontWeight: 'bold',
                opacity: textOpacity,
                textAlign: textAlignment,
                textShadow: textOutline ? '0 0 4px rgba(0,0,0,0.7), 0 0 4px rgba(0,0,0,0.7)' : 'none',
                maxWidth: '80%',
                wordBreak: 'break-word',
              }}
            >
              {brandText}
            </div>
          )}
        </div>
      )}
      
      {/* Controls panel for branding (only visible when in edit mode and not fullscreen) */}
      {!isFullScreen && editingText && (
        <div className="mt-4 bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
            <Type size={18} className="mr-2" />
            Text Branding Options
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Brand Text</label>
              <input
                type="text"
                value={brandText}
                onChange={(e) => setBrandText(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Text Color</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-9 w-10 rounded cursor-pointer mr-2 border border-gray-600"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 bg-gray-700 text-white rounded p-2 border border-gray-600"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Text Size (px)</label>
              <input
                type="range"
                min="12"
                max="120"
                value={textSize}
                onChange={(e) => setTextSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mb-1"
              />
              <div className="text-right text-xs text-gray-400">{textSize}px</div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Opacity</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={textOpacity}
                onChange={(e) => setTextOpacity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mb-1"
              />
              <div className="text-right text-xs text-gray-400">{Math.round(textOpacity * 100)}%</div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Alignment</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTextAlignment('left')}
                  className={`p-2 rounded ${textAlignment === 'left' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  title="Align Left"
                >
                  <AlignLeft size={16} />
                </button>
                <button
                  onClick={() => setTextAlignment('center')}
                  className={`p-2 rounded ${textAlignment === 'center' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  title="Align Center"
                >
                  <AlignCenter size={16} />
                </button>
                <button
                  onClick={() => setTextAlignment('right')}
                  className={`p-2 rounded ${textAlignment === 'right' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  title="Align Right"
                >
                  <AlignRight size={16} />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Position</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">X (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={textPosition.x}
                    onChange={(e) => setTextPosition({...textPosition, x: parseInt(e.target.value) || 0})}
                    className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Y (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={textPosition.y}
                    onChange={(e) => setTextPosition({...textPosition, y: parseInt(e.target.value) || 0})}
                    className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="textOutline"
                checked={textOutline}
                onChange={(e) => setTextOutline(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="textOutline" className="text-sm text-gray-400">Add text outline/shadow</label>
            </div>
          </div>
        </div>
      )}
      
      {/* Logo controls panel */}
      {!isFullScreen && editingLogo && (
        <div className="mt-4 bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
            <ImageIcon size={18} className="mr-2" />
            Logo Branding Options
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <button
                onClick={handleLogoButtonClick}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center w-full"
              >
                <ImageIcon size={18} className="mr-2" />
                {logo ? 'Change Logo' : 'Upload Logo'}
              </button>
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                className="hidden"
              />
              {logo && (
                <div className="mt-2 p-2 border border-gray-700 rounded bg-gray-900 flex justify-center">
                  <img src={logo} alt="Preview" className="max-h-24" />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Logo Size (%)</label>
              <input
                type="range"
                min="5"
                max="40"
                value={logoSize}
                onChange={(e) => setLogoSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mb-1"
              />
              <div className="text-right text-xs text-gray-400">{logoSize}%</div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Opacity</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={logoOpacity}
                onChange={(e) => setLogoOpacity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mb-1"
              />
              <div className="text-right text-xs text-gray-400">{Math.round(logoOpacity * 100)}%</div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Position</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">X (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={logoPosition.x}
                    onChange={(e) => setLogoPosition({...logoPosition, x: parseInt(e.target.value) || 0})}
                    className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Y (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={logoPosition.y}
                    onChange={(e) => setLogoPosition({...logoPosition, y: parseInt(e.target.value) || 0})}
                    className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Branding toggle and edit buttons */}
      {!isFullScreen && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setEditingText(!editingText)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${editingText ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
          >
            <Type size={18} className="mr-2" />
            {editingText ? 'Close Text Editor' : 'Edit Text Overlay'}
          </button>
          
          <button
            onClick={() => setEditingLogo(!editingLogo)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${editingLogo ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
          >
            <ImageIcon size={18} className="mr-2" />
            {editingLogo ? 'Close Logo Editor' : 'Edit Logo Overlay'}
          </button>
        </div>
      )}
      
      {/* Simplified branding controls in fullscreen mode */}
      {isFullScreen && showControls && showBranding && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm p-2 rounded-lg flex space-x-2 z-30 transition-opacity duration-300 pointer-events-auto">
          {brandText && (
            <button
              onClick={() => setBrandText('')}
              className="p-1 text-white rounded-lg hover:bg-white/20 transition flex items-center"
              title="Hide Text"
            >
              <Type size={16} className="mr-1" />
              <span className="text-xs">Hide Text</span>
            </button>
          )}
          
          {logo && (
            <button
              onClick={() => setLogo(null)}
              className="p-1 text-white rounded-lg hover:bg-white/20 transition flex items-center"
              title="Hide Logo"
            >
              <ImageIcon size={16} className="mr-1" />
              <span className="text-xs">Hide Logo</span>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default BrandingLayer;