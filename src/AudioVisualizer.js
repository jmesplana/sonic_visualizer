import React, { useState, useEffect, useRef } from 'react';
import { Mic, Upload, Play, Pause, AlertCircle, Sliders, RefreshCw, Zap, BarChart4, Circle, Waves, Hexagon, 
  Maximize, Minimize, Grid3X3, Box, Layers, Star, Sparkles, Wand2, Settings, PanelRight, 
  Flame, Droplets, Scan, Dna, FlaskConical, Flower2, Mountain, Sunglasses, Type, Image } from 'lucide-react';

// Import custom components
import BrandingLayer from './components/BrandingLayer';
import PresetSelector from './components/PresetSelector';
import { defaultSettings } from './config/presets';

// Import visualization system
import { renderVisualization } from './visualizations';
import { calculateFps, drawFpsCounter } from './visualizations/common';

const AudioVisualizer = () => {
  const [audioSource, setAudioSource] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  // Visualization types: bars, wave, circle, terrain, particles, spiral, spectrum, radialBars
  const [visualizationType, setVisualizationType] = useState('bars'); 
  // Additional color themes: cyberpunk, pastel, grayscale, matrix
  const [colorTheme, setColorTheme] = useState('neon'); 
  const [sensitivity, setSensitivity] = useState(1.5);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  // Additional bar styles: blocks, curve, pixel
  const [barStyle, setBarStyle] = useState('normal');
  // Backgrounds: gradient, starfield, solid, custom
  const [backgroundStyle, setBackgroundStyle] = useState('gradient');
  const [backgroundTheme, setBackgroundTheme] = useState('dark');
  const [customBgColor, setCustomBgColor] = useState('#121212');
  // New effects options
  const [showFps, setShowFps] = useState(false);
  const [motionEffects, setMotionEffects] = useState(true);
  const [glowEffects, setGlowEffects] = useState(true);
  
  // Branding options
  const [showBranding, setShowBranding] = useState(false);
  const [showPresetsPanel, setShowPresetsPanel] = useState(false);
  const [brandingSettings, setBrandingSettings] = useState(defaultSettings.branding);
  
  // Performance monitoring
  const fpsRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioSourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioElementRef = useRef(null);
  const particlesRef = useRef([]);
  const starsRef = useRef([]);
  const spiralPointsRef = useRef([]);
  const spectrumDataRef = useRef([]);
  const radialDataRef = useRef([]);
  
  // Initialize audio context and handle fullscreen API
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
    } catch (error) {
      setErrorMessage('Error initializing audio context. Your browser might not support the Web Audio API.');
      console.error(error);
    }
    
    // Handle fullscreen change events
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      setIsFullScreen(isFullscreenNow);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
  
  // Visualization loop
  useEffect(() => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!canvasRef.current) return;
      
      // Calculate FPS
      const now = performance.now();
      fpsRef.current = calculateFps(now, lastFrameTimeRef.current);
      lastFrameTimeRef.current = now;
      
      animationFrameRef.current = requestAnimationFrame(draw);
      
      // Adjust canvas size to match container
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = isFullScreen ? window.innerHeight : 500;
      }
      
      // Get canvas dimensions after resizing
      const width = canvas.width;
      const height = canvas.height;
      
      // Get audio data
      analyser.getByteFrequencyData(dataArray);
      
      // Use the modular visualization system
      renderVisualization(ctx, dataArray, width, height, now, {
        visualizationType,
        sensitivity,
        colorTheme,
        barStyle,
        glowEffects,
        motionEffects,
        backgroundStyle,
        backgroundTheme,
        customBgColor,
        showFps,
        
        // References to data for visualizations that need to store state
        starsRef,
        particlesRef,
        spiralPointsRef,
        spectrumDataRef,
        radialDataRef
      });
      
      // Draw FPS counter if enabled
      if (showFps) {
        drawFpsCounter(ctx, fpsRef.current);
      }
    };
    
    draw();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isFullScreen, sensitivity, visualizationType, colorTheme, showFps, barStyle, backgroundStyle, backgroundTheme, customBgColor, motionEffects, glowEffects]);

  // Handle fullscreen toggle - uses browser's fullscreen API
  const handleFullScreenToggle = () => {
    if (!containerRef.current) return;
    
    if (!isFullScreen) {
      // Enter fullscreen
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };
  
  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls);
  };
  
  // Handle visualization preset selection
  const handlePresetSelect = (preset) => {
    if (!preset) return;
    
    // Apply visualization settings from preset
    if (preset.visualizationType) setVisualizationType(preset.visualizationType);
    if (preset.colorTheme) setColorTheme(preset.colorTheme);
    if (preset.backgroundStyle) setBackgroundStyle(preset.backgroundStyle);
    if (preset.backgroundTheme) setBackgroundTheme(preset.backgroundTheme);
    if (preset.barStyle) setBarStyle(preset.barStyle);
    if (preset.sensitivity) setSensitivity(preset.sensitivity);
    if (preset.glowEffects !== undefined) setGlowEffects(preset.glowEffects);
    if (preset.motionEffects !== undefined) setMotionEffects(preset.motionEffects);
  };
  
  // Handle branding preset selection
  const handleBrandingPresetSelect = (preset) => {
    if (!preset) return;
    
    // Enable branding if not already enabled
    setShowBranding(true);
    
    // Apply branding settings from preset
    // These will be passed to the BrandingLayer component
    // Store branding settings in state to pass to BrandingLayer
    setBrandingSettings(preset);
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 'Escape' key to exit fullscreen
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
      
      // 'f' key to toggle fullscreen
      if (e.key === 'f' || e.key === 'F') {
        handleFullScreenToggle();
      }
      
      // Space key to toggle play/pause
      if (e.key === ' ' && audioSource === 'file') {
        // Prevent default space bar behavior (scrolling)
        e.preventDefault();
        // Toggle play/pause
        togglePlayPause();
      }
      
      // 'h' key to toggle controls visibility in fullscreen
      if ((e.key === 'h' || e.key === 'H') && isFullScreen) {
        toggleControls();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, audioSource, isPlaying]);
  
  // Handle microphone input
  const handleMicrophoneInput = async () => {
    try {
      if (isRecording) {
        // Stop recording
        setIsRecording(false);
        setAudioSource(null);
        if (audioSourceRef.current) {
          audioSourceRef.current.disconnect();
          audioSourceRef.current = null;
        }
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      // Disconnect any existing source
      if (audioSourceRef.current) {
        audioSourceRef.current.disconnect();
      }
      
      // Create and connect new audio source
      audioSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      audioSourceRef.current.connect(analyserRef.current);
      
      setAudioSource('microphone');
      setIsRecording(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error accessing microphone. Please ensure microphone access is allowed.');
      console.error(error);
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const fileReader = new FileReader();
    
    fileReader.onload = function(e) {
      const arrayBuffer = e.target.result;
      
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      // Disconnect any existing source
      if (audioSourceRef.current) {
        audioSourceRef.current.disconnect();
        audioSourceRef.current = null;
      }
      
      // Set the audio element source
      const audioElement = audioElementRef.current;
      audioElement.src = URL.createObjectURL(file);
      
      audioElement.oncanplay = () => {
        // Create and connect new audio source
        audioSourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
        audioSourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        setAudioSource('file');
        setAudioFile(file);
        setErrorMessage('');
        
        // Auto-play the audio
        setIsPlaying(true);
        audioElement.play();
      };
    };
    
    fileReader.onerror = function() {
      setErrorMessage('Error reading the audio file.');
    };
    
    fileReader.readAsArrayBuffer(file);
  };

  // Toggle play/pause for file audio
  const togglePlayPause = () => {
    if (audioSource !== 'file' || !audioElementRef.current) return;
    
    const audioElement = audioElementRef.current;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative flex flex-col items-center ${
        isFullScreen 
          ? 'fixed inset-0 bg-gray-900 z-50' 
          : 'p-6 max-w-6xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl'
      } transition-all duration-300`}
    >
      {/* Title - hide in fullscreen mode */}
      {!isFullScreen && (
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Sonic Visualizer
        </h1>
      )}
      
      {/* Canvas for visualization */}
      <div 
        className={`relative ${isFullScreen ? 'w-full h-full' : 'w-full mb-6 bg-gray-900 rounded-2xl overflow-hidden shadow-inner border border-gray-700'}`}
        onMouseMove={() => {
          if (isFullScreen) {
            setShowControls(true);
            // Hide controls after mouse stops moving for 3 seconds
            clearTimeout(window.controlsTimer);
            window.controlsTimer = setTimeout(() => setShowControls(false), 3000);
          }
        }}
        onMouseLeave={() => isFullScreen && setShowControls(false)}
      >
        <canvas 
          ref={canvasRef}
          width={1000}
          height={500}
          className={`w-full ${isFullScreen ? 'h-full' : ''}`}
        />
        
        {/* Fullscreen button overlay */}
        <button
          onClick={handleFullScreenToggle}
          className={`absolute top-3 right-3 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-opacity duration-300 z-10 ${isFullScreen && !showControls ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          title={isFullScreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
        >
          {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        
        {/* Branding overlay for logo and text */}
        <BrandingLayer 
          isFullScreen={isFullScreen}
          showControls={showControls}
          showBranding={showBranding}
          themeColor={colorTheme}
          brandingSettings={brandingSettings}
        />
        
        {/* YouTube-style controls bar in fullscreen */}
        {isFullScreen && (
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 flex items-center justify-between ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ height: '80px' }}
          >
            <div className="flex items-center space-x-3">
              {/* Play/Pause Button - only show if file is loaded */}
              {audioSource === 'file' && (
                <button 
                  onClick={togglePlayPause}
                  className="p-2 text-white rounded-full hover:bg-white/20 transition"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
              )}
              
              {/* Quick visualization switcher */}
              <div className="flex items-center space-x-2 ml-2">
                <button 
                  onClick={() => setVisualizationType('bars')}
                  className={`p-1 rounded-lg ${visualizationType === 'bars' ? 'bg-white text-black' : 'text-white hover:bg-white/20'} transition`}
                  title="Bars"
                >
                  <BarChart4 size={20} />
                </button>
                <button 
                  onClick={() => setVisualizationType('wave')}
                  className={`p-1 rounded-lg ${visualizationType === 'wave' ? 'bg-white text-black' : 'text-white hover:bg-white/20'} transition`}
                  title="Wave"
                >
                  <Waves size={20} />
                </button>
                <button 
                  onClick={() => setVisualizationType('circle')}
                  className={`p-1 rounded-lg ${visualizationType === 'circle' ? 'bg-white text-black' : 'text-white hover:bg-white/20'} transition`}
                  title="Circle"
                >
                  <Circle size={20} />
                </button>
                <button 
                  onClick={() => setVisualizationType('particles')}
                  className={`p-1 rounded-lg ${visualizationType === 'particles' ? 'bg-white text-black' : 'text-white hover:bg-white/20'} transition`}
                  title="Particles"
                >
                  <Sparkles size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Quick settings toggle */}
              <button 
                onClick={() => setGlowEffects(!glowEffects)}
                className={`p-1 rounded-lg ${glowEffects ? 'bg-white text-black' : 'text-white hover:bg-white/20'} transition`}
                title="Toggle Glow Effects"
              >
                <Wand2 size={20} />
              </button>
              
              {/* Toggle branding button */}
              <button 
                onClick={() => setShowBranding(!showBranding)}
                className={`p-1 rounded-lg ${showBranding ? 'bg-white text-black' : 'text-white hover:bg-white/20'} transition`}
                title="Toggle Branding"
              >
                <Image size={20} />
              </button>
              
              {/* Exit fullscreen button */}
              <button
                onClick={handleFullScreenToggle}
                className="p-1 text-white rounded-lg hover:bg-white/20 transition"
                title="Exit fullscreen"
              >
                <Minimize size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Main controls panel */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        {/* Microphone input button */}
        <button 
          onClick={handleMicrophoneInput}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            audioSource === 'microphone' && isRecording 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Mic className="mr-2" size={20} />
          {audioSource === 'microphone' && isRecording ? 'Stop Mic' : 'Use Microphone'}
        </button>
        
        {/* File upload button */}
        <label className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors">
          <Upload className="mr-2" size={20} />
          Upload Audio
          <input 
            type="file" 
            accept="audio/*" 
            className="hidden" 
            onChange={handleFileUpload}
          />
        </label>
        
        {/* Play/pause button - only show if file is loaded */}
        {audioSource === 'file' && (
          <button 
            onClick={togglePlayPause}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            {isPlaying ? <Pause size={20} className="mr-2" /> : <Play size={20} className="mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
        
        {/* Visualization type selector */}
        <div className="relative">
          <div className="group inline-block">
            <button className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <BarChart4 className="mr-2" size={20} />
              Visualization
            </button>
            <div className="absolute left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-2">
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setVisualizationType('bars')}
                    className={`p-2 rounded-lg text-sm text-left ${visualizationType === 'bars' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <BarChart4 className="inline-block mr-2" size={16} />
                    Bars
                  </button>
                  <button 
                    onClick={() => setVisualizationType('wave')}
                    className={`p-2 rounded-lg text-sm text-left ${visualizationType === 'wave' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <Waves className="inline-block mr-2" size={16} />
                    Wave
                  </button>
                  <button 
                    onClick={() => setVisualizationType('circle')}
                    className={`p-2 rounded-lg text-sm text-left ${visualizationType === 'circle' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <Circle className="inline-block mr-2" size={16} />
                    Circle
                  </button>
                  <button 
                    onClick={() => setVisualizationType('terrain')}
                    className={`p-2 rounded-lg text-sm text-left ${visualizationType === 'terrain' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <Mountain className="inline-block mr-2" size={16} />
                    Terrain
                  </button>
                  <button 
                    onClick={() => setVisualizationType('particles')}
                    className={`p-2 rounded-lg text-sm text-left ${visualizationType === 'particles' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <Sparkles className="inline-block mr-2" size={16} />
                    Particles
                  </button>
                  <button 
                    onClick={() => setVisualizationType('spiral')}
                    className={`p-2 rounded-lg text-sm text-left ${visualizationType === 'spiral' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <RefreshCw className="inline-block mr-2" size={16} />
                    Spiral
                  </button>
                  <button 
                    onClick={() => setVisualizationType('spectrum')}
                    className={`p-2 rounded-lg text-sm text-left ${visualizationType === 'spectrum' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <Sliders className="inline-block mr-2" size={16} />
                    Spectrum
                  </button>
                  <button 
                    onClick={() => setVisualizationType('radialBars')}
                    className={`p-2 rounded-lg text-sm text-left ${visualizationType === 'radialBars' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <Hexagon className="inline-block mr-2" size={16} />
                    Radial Bars
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Color Theme Selector */}
        <div className="relative">
          <div className="group inline-block">
            <button className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Droplets className="mr-2" size={20} />
              Color Theme
            </button>
            <div className="absolute left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-2">
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setColorTheme('neon')}
                    className={`p-2 rounded-lg text-sm text-left ${colorTheme === 'neon' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <div className="w-4 h-4 inline-block mr-2 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                    Neon
                  </button>
                  <button 
                    onClick={() => setColorTheme('fire')}
                    className={`p-2 rounded-lg text-sm text-left ${colorTheme === 'fire' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <div className="w-4 h-4 inline-block mr-2 bg-gradient-to-b from-red-400 to-red-600 rounded-full"></div>
                    Fire
                  </button>
                  <button 
                    onClick={() => setColorTheme('cyberpunk')}
                    className={`p-2 rounded-lg text-sm text-left ${colorTheme === 'cyberpunk' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <div className="w-4 h-4 inline-block mr-2 bg-gradient-to-b from-pink-400 to-purple-600 rounded-full"></div>
                    Cyberpunk
                  </button>
                  <button 
                    onClick={() => setColorTheme('pastel')}
                    className={`p-2 rounded-lg text-sm text-left ${colorTheme === 'pastel' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <div className="w-4 h-4 inline-block mr-2 bg-gradient-to-b from-purple-300 to-pink-300 rounded-full"></div>
                    Pastel
                  </button>
                  <button 
                    onClick={() => setColorTheme('grayscale')}
                    className={`p-2 rounded-lg text-sm text-left ${colorTheme === 'grayscale' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <div className="w-4 h-4 inline-block mr-2 bg-gradient-to-b from-gray-300 to-gray-600 rounded-full"></div>
                    Grayscale
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bar Style Selector - only show if visualization type is 'bars' */}
        {visualizationType === 'bars' && (
          <div className="relative">
            <div className="group inline-block">
              <button className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                <Layers className="mr-2" size={20} />
                Bar Style
              </button>
              <div className="absolute left-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  <button 
                    onClick={() => setBarStyle('normal')}
                    className={`p-2 w-full rounded-lg text-sm text-left ${barStyle === 'normal' ? 'bg-blue-600' : 'hover:bg-gray-700'} mb-1`}
                  >
                    <BarChart4 className="inline-block mr-2" size={16} />
                    Normal
                  </button>
                  <button 
                    onClick={() => setBarStyle('blocks')}
                    className={`p-2 w-full rounded-lg text-sm text-left ${barStyle === 'blocks' ? 'bg-blue-600' : 'hover:bg-gray-700'} mb-1`}
                  >
                    <Grid3X3 className="inline-block mr-2" size={16} />
                    Blocks
                  </button>
                  <button 
                    onClick={() => setBarStyle('curve')}
                    className={`p-2 w-full rounded-lg text-sm text-left ${barStyle === 'curve' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <Waves className="inline-block mr-2" size={16} />
                    Curve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Background Style Selector */}
        <div className="relative">
          <div className="group inline-block">
            <button className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Box className="mr-2" size={20} />
              Background
            </button>
            <div className="absolute left-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-3">
                <div className="mb-3">
                  <p className="text-xs uppercase text-gray-400 mb-1 font-semibold">Background Style</p>
                  <div className="grid grid-cols-2 gap-1">
                    <button 
                      onClick={() => setBackgroundStyle('gradient')}
                      className={`p-2 rounded-lg text-sm text-left ${backgroundStyle === 'gradient' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                      <div className="w-4 h-4 inline-block mr-2 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full"></div>
                      Gradient
                    </button>
                    <button 
                      onClick={() => setBackgroundStyle('starfield')}
                      className={`p-2 rounded-lg text-sm text-left ${backgroundStyle === 'starfield' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                      <Star className="inline-block mr-2" size={16} />
                      Starfield
                    </button>
                    <button 
                      onClick={() => setBackgroundStyle('solid')}
                      className={`p-2 rounded-lg text-sm text-left ${backgroundStyle === 'solid' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                      <div className="w-4 h-4 inline-block mr-2 bg-gray-800 rounded-sm border border-gray-600"></div>
                      Solid
                    </button>
                    <button 
                      onClick={() => setBackgroundStyle('custom')}
                      className={`p-2 rounded-lg text-sm text-left ${backgroundStyle === 'custom' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                      <div className="w-4 h-4 inline-block mr-2 rounded-sm" style={{backgroundColor: customBgColor}}></div>
                      Custom
                    </button>
                  </div>
                </div>
                
                {/* Background Theme Selector */}
                <div className="mb-3">
                  <p className="text-xs uppercase text-gray-400 mb-1 font-semibold">Theme</p>
                  <div className="grid grid-cols-3 gap-1">
                    <button 
                      onClick={() => setBackgroundTheme('dark')}
                      className={`p-2 rounded-lg text-sm text-left ${backgroundTheme === 'dark' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                      <div className="w-4 h-4 inline-block mr-1 bg-gray-900 rounded-full"></div>
                      Dark
                    </button>
                    <button 
                      onClick={() => setBackgroundTheme('light')}
                      className={`p-2 rounded-lg text-sm text-left ${backgroundTheme === 'light' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                      <div className="w-4 h-4 inline-block mr-1 bg-gray-200 rounded-full"></div>
                      Light
                    </button>
                    <button 
                      onClick={() => setBackgroundTheme('night')}
                      className={`p-2 rounded-lg text-sm text-left ${backgroundTheme === 'night' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                      <div className="w-4 h-4 inline-block mr-1 bg-blue-900 rounded-full"></div>
                      Night
                    </button>
                    <button 
                      onClick={() => setBackgroundTheme('sunset')}
                      className={`p-2 rounded-lg text-sm text-left ${backgroundTheme === 'sunset' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                      <div className="w-4 h-4 inline-block mr-1 bg-purple-900 rounded-full"></div>
                      Sunset
                    </button>
                    <button 
                      onClick={() => setBackgroundTheme('ocean')}
                      className={`p-2 rounded-lg text-sm text-left ${backgroundTheme === 'ocean' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                      <div className="w-4 h-4 inline-block mr-1 bg-cyan-900 rounded-full"></div>
                      Ocean
                    </button>
                    <button 
                      onClick={() => setBackgroundTheme('forest')}
                      className={`p-2 rounded-lg text-sm text-left ${backgroundTheme === 'forest' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                      <div className="w-4 h-4 inline-block mr-1 bg-green-900 rounded-full"></div>
                      Forest
                    </button>
                  </div>
                </div>
                
                {/* Custom Color Input - only show when 'custom' is selected */}
                {backgroundStyle === 'custom' && (
                  <div>
                    <p className="text-xs uppercase text-gray-400 mb-1 font-semibold">Custom Color</p>
                    <div className="flex items-center">
                      <input 
                        type="color" 
                        value={customBgColor}
                        onChange={(e) => setCustomBgColor(e.target.value)}
                        className="w-8 h-8 mr-2 rounded cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={customBgColor}
                        onChange={(e) => setCustomBgColor(e.target.value)}
                        className="bg-gray-700 text-white text-sm p-1 rounded w-20 border border-gray-600"
                        placeholder="#RRGGBB"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Effects Toggle Button */}
        <div className="relative">
          <div className="group inline-block">
            <button className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Wand2 className="mr-2" size={20} />
              Effects
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-2">
                <div className="flex items-center p-2 hover:bg-gray-700 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="glowEffects" 
                    checked={glowEffects} 
                    onChange={() => setGlowEffects(!glowEffects)}
                    className="mr-2"
                  />
                  <label htmlFor="glowEffects" className="text-sm text-white cursor-pointer">Glow Effects</label>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-700 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="motionEffects" 
                    checked={motionEffects} 
                    onChange={() => setMotionEffects(!motionEffects)}
                    className="mr-2"
                  />
                  <label htmlFor="motionEffects" className="text-sm text-white cursor-pointer">Motion Effects</label>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-700 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="showFps" 
                    checked={showFps} 
                    onChange={() => setShowFps(!showFps)}
                    className="mr-2"
                  />
                  <label htmlFor="showFps" className="text-sm text-white cursor-pointer">Show FPS</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sensitivity slider */}
      <div className="w-full max-w-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-white text-sm">Sensitivity</label>
          <span className="text-gray-300 text-sm">{sensitivity.toFixed(1)}</span>
        </div>
        <input 
          type="range" 
          min="0.5" 
          max="3" 
          step="0.1" 
          value={sensitivity} 
          onChange={(e) => setSensitivity(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      {/* Show/Hide Presets Panel */}
      <div className="w-full flex justify-center mb-4">
        <button
          onClick={() => setShowPresetsPanel(!showPresetsPanel)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
            showPresetsPanel ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          <Zap className="mr-2" size={18} />
          {showPresetsPanel ? 'Hide Preset Library' : 'DJ & Event Presets'}
        </button>
      </div>
      
      {/* Presets Panel - shown only when enabled */}
      {showPresetsPanel && (
        <PresetSelector 
          onSelectPreset={handlePresetSelect}
          onSelectBrandingPreset={handleBrandingPresetSelect}
        />
      )}
      
      {/* Error message */}
      {errorMessage && (
        <div className="flex items-center p-4 mb-4 bg-red-900 bg-opacity-80 text-red-100 rounded-lg backdrop-blur-sm border border-red-700 max-w-lg">
          <AlertCircle className="mr-2 flex-shrink-0" size={18} />
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}
      
      {/* Hidden audio element for uploaded files */}
      <audio ref={audioElementRef} className="hidden" />
    </div>
  );
};

export default AudioVisualizer;
