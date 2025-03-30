import React, { useState, useEffect, useRef } from 'react';
import { Mic, Upload, Play, Pause, AlertCircle, Sliders, RefreshCw, Zap, BarChart4, Circle, Waves, Hexagon, 
  Maximize, Minimize, Grid3X3, Box, Layers, Star, Sparkles, Wand2, Settings, PanelRight, 
  Flame, Droplets, Scan, Dna, FlaskConical, Flower2, Mountain, Sunglasses } from 'lucide-react';

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
      const elapsed = now - lastFrameTimeRef.current;
      if (elapsed > 0) {
        fpsRef.current = 1000 / elapsed;
      }
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
      
      analyser.getByteFrequencyData(dataArray);
      
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);
      
      // Get color theme gradient
      let gradient;
      
      switch (colorTheme) {
        case 'neon':
          gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, '#00c6ff');
          gradient.addColorStop(1, '#0072ff');
          break;
        case 'fire':
          gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, '#ff416c');
          gradient.addColorStop(1, '#ff4b2b');
          break;
        case 'cyberpunk':
          gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, '#f953c6');
          gradient.addColorStop(0.5, '#ff7e5f');
          gradient.addColorStop(1, '#b967ff');
          break;
        case 'pastel':
          gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, '#a18cd1');
          gradient.addColorStop(1, '#fbc2eb');
          break;
        case 'grayscale':
          gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(1, '#5a5a5a');
          break;
        default:
          gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, '#00c6ff');
          gradient.addColorStop(1, '#0072ff');
      }
      
      // Draw background
      switch (backgroundStyle) {
        case 'gradient': {
          const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
          
          if (backgroundTheme === 'dark') {
            // Dark theme gradient
            bgGradient.addColorStop(0, 'rgba(15, 15, 20, 1)');
            bgGradient.addColorStop(1, 'rgba(30, 30, 40, 1)');
          } else if (backgroundTheme === 'light') {
            // Light theme gradient
            bgGradient.addColorStop(0, 'rgba(240, 240, 245, 1)');
            bgGradient.addColorStop(1, 'rgba(220, 220, 230, 1)');
          } else if (backgroundTheme === 'night') {
            // Night theme - deep blue
            bgGradient.addColorStop(0, 'rgba(5, 5, 20, 1)');
            bgGradient.addColorStop(1, 'rgba(10, 10, 35, 1)');
          } else if (backgroundTheme === 'sunset') {
            // Sunset theme
            bgGradient.addColorStop(0, 'rgba(35, 10, 20, 1)');
            bgGradient.addColorStop(1, 'rgba(80, 20, 40, 1)');
          } else if (backgroundTheme === 'ocean') {
            // Ocean theme
            bgGradient.addColorStop(0, 'rgba(5, 30, 50, 1)');
            bgGradient.addColorStop(1, 'rgba(10, 50, 80, 1)');
          } else if (backgroundTheme === 'forest') {
            // Forest theme
            bgGradient.addColorStop(0, 'rgba(10, 40, 20, 1)');
            bgGradient.addColorStop(1, 'rgba(20, 60, 30, 1)');
          }
          
          ctx.fillStyle = bgGradient;
          ctx.fillRect(0, 0, width, height);
          break;
        }
          
        case 'starfield': {
          // Draw starfield background
          let baseColor;
          if (backgroundTheme === 'night') {
            baseColor = '#000018'; // Deep blue
          } else if (backgroundTheme === 'sunset') {
            baseColor = '#180008'; // Very dark red
          } else if (backgroundTheme === 'ocean') {
            baseColor = '#001018'; // Very dark teal
          } else if (backgroundTheme === 'forest') {
            baseColor = '#001800'; // Very dark green
          } else if (backgroundTheme === 'light') {
            baseColor = '#e0e0e8'; // Light grayish-blue
          } else {
            baseColor = '#000018'; // Default deep blue
          }
          
          ctx.fillStyle = baseColor;
          ctx.fillRect(0, 0, width, height);
          
          // Initialize stars if needed
          if (starsRef.current.length === 0) {
            for (let i = 0; i < 100; i++) {
              starsRef.current.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 0.5,
                bright: Math.random() * 0.5 + 0.5
              });
            }
          }
          
          // Draw stars
          for (let i = 0; i < starsRef.current.length; i++) {
            const star = starsRef.current[i];
            const bright = star.bright * (0.8 + 0.2 * Math.sin(now / 500 + i));
            
            // Star color based on theme
            let starColor;
            if (backgroundTheme === 'sunset') {
              starColor = `rgba(255, 220, 180, ${bright})`; // Warm stars
            } else if (backgroundTheme === 'ocean') {
              starColor = `rgba(180, 220, 255, ${bright})`; // Cool blue stars
            } else if (backgroundTheme === 'forest') {
              starColor = `rgba(220, 255, 220, ${bright})`; // Slight green tint
            } else if (backgroundTheme === 'light') {
              starColor = `rgba(80, 80, 120, ${bright})`; // Darker stars on light bg
            } else {
              starColor = `rgba(255, 255, 255, ${bright})`; // White stars
            }
            
            ctx.fillStyle = starColor;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }
          
        case 'solid': {
          // Solid background with theme colors
          let bgColor;
          
          if (backgroundTheme === 'dark') {
            bgColor = '#121212'; // Dark gray
          } else if (backgroundTheme === 'light') {
            bgColor = '#f0f0f0'; // Light gray
          } else if (backgroundTheme === 'night') {
            bgColor = '#050510'; // Deep blue-black
          } else if (backgroundTheme === 'sunset') {
            bgColor = '#201020'; // Deep purple-red
          } else if (backgroundTheme === 'ocean') {
            bgColor = '#0a2030'; // Deep blue-green
          } else if (backgroundTheme === 'forest') {
            bgColor = '#0a2010'; // Deep green
          }
          
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, width, height);
          break;
        }
          
        case 'custom': {
          // Custom color background
          ctx.fillStyle = customBgColor;
          ctx.fillRect(0, 0, width, height);
          break;
        }
      }
      
      // Draw different visualizations
      switch (visualizationType) {
        case 'bars': {
          const barWidth = width / (bufferLength / 4);
          let x = 0;
          
          for (let i = 0; i < bufferLength / 4; i++) {
            const barHeight = dataArray[i] * (sensitivity / 255.0) * height;
            
            // Apply different bar styles
            if (barStyle === 'normal') {
              ctx.fillStyle = gradient;
              ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
            } else if (barStyle === 'blocks') {
              const blockHeight = 5;
              const blocks = Math.floor(barHeight / blockHeight);
              
              for (let j = 0; j < blocks; j++) {
                const blockY = height - (j + 1) * blockHeight;
                ctx.fillStyle = gradient;
                ctx.fillRect(x, blockY, barWidth - 1, blockHeight - 1);
              }
            } else if (barStyle === 'curve') {
              ctx.beginPath();
              ctx.moveTo(x, height);
              ctx.lineTo(x, height - barHeight);
              ctx.arc(x + barWidth / 2, height - barHeight, barWidth / 2, Math.PI, 0, true);
              ctx.lineTo(x + barWidth, height);
              ctx.fillStyle = gradient;
              ctx.fill();
            }
            
            x += barWidth;
          }
          break;
        }
          
        case 'wave': {
          // Draw dual wave visualization with mirroring and oscillation
          const centerY = height / 2;
          const waveAmplitude = height / 4 * sensitivity;
          const sliceWidth = width / (bufferLength / 2);
          
          // Get time-based oscillation for wave movement
          const oscillation = Math.sin(now / 2000) * 10;
          
          // Create two paths for top and bottom waves
          for (let waveNum = 0; waveNum < 2; waveNum++) {
            ctx.beginPath();
            
            // Use different segments of the frequency data for each wave
            const startOffset = waveNum * (bufferLength / 2);
            let x = 0;
            
            for (let i = 0; i < bufferLength / 2; i++) {
              // Add smoothing between points
              const dataIndex = startOffset + i;
              const currentValue = dataArray[dataIndex] / 255.0;
              
              // Calculate y-position with centerline as reference
              // Top wave goes up from center, bottom wave goes down from center
              const direction = waveNum === 0 ? -1 : 1;
              const y = centerY + (direction * currentValue * waveAmplitude) + oscillation;
              
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                // Use quadratic curves for smoother waves
                const prevX = x - sliceWidth;
                const prevY = centerY + (direction * (dataArray[dataIndex - 1] / 255.0) * waveAmplitude) + oscillation;
                ctx.quadraticCurveTo((prevX + x) / 2, (prevY + y) / 2, x, y);
              }
              
              x += sliceWidth;
            }
            
            // Different colors for top and bottom waves
            const hue1 = (now / 50) % 360;
            const hue2 = (hue1 + 180) % 360;
            const waveHue = waveNum === 0 ? hue1 : hue2;
            
            ctx.strokeStyle = `hsla(${waveHue}, 100%, 60%, 0.7)`;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            if (glowEffects) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = `hsla(${waveHue}, 100%, 70%, 0.5)`;
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
          }
          
          // Add center line with glowing dots
          const dotCount = 20;
          const dotSpacing = width / dotCount;
          
          for (let i = 0; i < dotCount; i++) {
            const x = i * dotSpacing;
            
            // Get amplitude from nearby frequencies
            const freqIndex = Math.floor((i / dotCount) * (bufferLength / 2));
            const amplitude = dataArray[freqIndex] / 255.0;
            
            // Pulse size based on amplitude
            const dotSize = 1 + (amplitude * 4 * sensitivity);
            
            // Oscillate position slightly
            const y = centerY + (Math.sin(now / 500 + i * 0.3) * 2);
            
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fill();
            
            if (glowEffects) {
              ctx.shadowBlur = 8;
              ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
          
          break;
        }
          
        case 'circle': {
          // Draw circular equalizer with dynamic rotation and pulsing
          const centerX = width / 2;
          const centerY = height / 2;
          const baseRadius = Math.min(width, height) / 3;
          
          // Calculate average frequency value for pulsing effect
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const avgAmplitude = sum / bufferLength * sensitivity;
          const pulseRadius = baseRadius * (0.9 + 0.2 * (avgAmplitude / 255));
          
          // Base rotation that changes over time
          const rotation = now / 3000;
          
          // Draw background circles
          const circleCount = 3;
          for (let i = 0; i < circleCount; i++) {
            const circleRadius = pulseRadius * (0.7 + (i * 0.15));
            ctx.beginPath();
            ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + (i * 0.03)})`;
            ctx.lineWidth = 1 + i;
            ctx.stroke();
          }
          
          // Draw frequency bars around circle
          const barCount = 120; // More bars for smoother appearance
          const angleStep = (Math.PI * 2) / barCount;
          
          for (let i = 0; i < barCount; i++) {
            // Sample frequencies with emphasis on lower frequencies
            const freqIndex = Math.floor(Math.pow(i / barCount, 1.5) * (bufferLength / 4));
            
            // Get amplitude and add some baseline so there's always something to see
            const amplitude = (dataArray[freqIndex] / 255.0) * sensitivity;
            const barHeight = pulseRadius * amplitude * 0.5;
            
            // Calculate angle with rotation over time
            const angle = rotation + (i * angleStep);
            
            // Inner and outer points
            const x1 = centerX + Math.cos(angle) * pulseRadius;
            const y1 = centerY + Math.sin(angle) * pulseRadius;
            const x2 = centerX + Math.cos(angle) * (pulseRadius + barHeight);
            const y2 = centerY + Math.sin(angle) * (pulseRadius + barHeight);
            
            // Draw bar
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            
            // Color based on frequency
            const hue = (i / barCount) * 360;
            ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            if (glowEffects) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.6)`;
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
          }
          
          // Draw inner filled circle that pulses with the beat
          const innerRadius = pulseRadius * 0.2 * (0.8 + 0.4 * (avgAmplitude / 255));
          const gradientInner = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, innerRadius
          );
          
          const hue = (now / 50) % 360;
          gradientInner.addColorStop(0, `hsla(${hue}, 100%, 70%, 0.8)`);
          gradientInner.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradientInner;
          ctx.fill();
          
          break;
        }
          
        case 'terrain': {
          // Draw terrain visualization (frequency as a landscape)
          ctx.beginPath();
          ctx.moveTo(0, height);
          
          const terrainWidth = width / (bufferLength / 2);
          let x = 0;
          
          for (let i = 0; i < bufferLength / 2; i++) {
            const barHeight = dataArray[i] * (sensitivity / 255.0) * height;
            ctx.lineTo(x, height - barHeight);
            x += terrainWidth;
          }
          
          ctx.lineTo(width, height);
          ctx.closePath();
          
          // Create terrain gradient
          const terrainGradient = ctx.createLinearGradient(0, 0, 0, height);
          terrainGradient.addColorStop(0, 'rgba(100, 100, 255, 0.8)');
          terrainGradient.addColorStop(0.5, 'rgba(80, 80, 200, 0.6)');
          terrainGradient.addColorStop(1, 'rgba(50, 50, 150, 0.4)');
          
          ctx.fillStyle = terrainGradient;
          ctx.fill();
          break;
        }

        case 'particles': {
          // Particle visualization that reacts to audio
          const centerX = width / 2;
          const centerY = height / 2;
          
          // Calculate average frequency value for this frame
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const avg = sum / bufferLength * sensitivity;
          
          // Create particles if needed
          if (particlesRef.current.length === 0) {
            for (let i = 0; i < 100; i++) {
              particlesRef.current.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 5 + 2,
                speed: Math.random() * 2 + 1,
                angle: Math.random() * Math.PI * 2,
                color: Math.floor(Math.random() * 360)
              });
            }
          }
          
          // Update and draw particles
          for (let i = 0; i < particlesRef.current.length; i++) {
            const p = particlesRef.current[i];
            
            // Update particle position based on audio amplitude
            const intensity = avg / 255.0;
            p.x += Math.cos(p.angle) * p.speed * intensity * 3;
            p.y += Math.sin(p.angle) * p.speed * intensity * 3;
            
            // Bounce off edges
            if (p.x < 0 || p.x > width) {
              p.angle = Math.PI - p.angle;
              p.x = Math.max(0, Math.min(width, p.x));
            }
            if (p.y < 0 || p.y > height) {
              p.angle = -p.angle;
              p.y = Math.max(0, Math.min(height, p.y));
            }
            
            // Draw particle
            const size = p.size * (0.5 + intensity * 1.5);
            const hue = (p.color + Math.floor(now / 50)) % 360;
            ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${0.5 + intensity * 0.5})`;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
            
            if (glowEffects) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.7)`;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
          break;
        }

        case 'spiral': {
          // Spiral visualization
          const centerX = width / 2;
          const centerY = height / 2;
          const maxRadius = Math.min(width, height) / 2 * 0.8;
          
          for (let i = 0; i < bufferLength; i += 2) {
            // Calculate radius based on index
            const radius = (i / bufferLength) * maxRadius;
            
            // Calculate angle based on index and time
            const baseAngle = (i / bufferLength) * Math.PI * 20;
            const timeOffset = now / 2000;
            const angle = baseAngle + timeOffset;
            
            // Calculate point on spiral
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            // Size based on audio data
            const size = (dataArray[i] / 255.0) * 10 * sensitivity;
            
            // Draw point
            const hue = (i / bufferLength) * 360;
            ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.7)`;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            if (glowEffects) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.5)`;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
          break;
        }

        case 'spectrum': {
          // Spectrum analyzer with smooth transitions
          const barWidth = width / (bufferLength / 8);
          let x = 0;
          
          // Initialize or update spectrum data
          if (spectrumDataRef.current.length !== bufferLength / 8) {
            spectrumDataRef.current = new Array(bufferLength / 8).fill(0);
          }
          
          for (let i = 0; i < bufferLength / 8; i++) {
            // Apply smoothing
            spectrumDataRef.current[i] = spectrumDataRef.current[i] * 0.7 + dataArray[i] * 0.3;
            
            const barHeight = spectrumDataRef.current[i] * (sensitivity / 255.0) * height;
            
            // Create color gradient based on frequency
            const hue = (i / (bufferLength / 8)) * 270; // From red to blue
            ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
            
            // Draw bar
            const barX = x;
            const barY = height - barHeight;
            
            ctx.beginPath();
            ctx.moveTo(barX, height);
            ctx.lineTo(barX, barY);
            ctx.lineTo(barX + barWidth - 1, barY);
            ctx.lineTo(barX + barWidth - 1, height);
            ctx.fill();
            
            if (glowEffects) {
              ctx.shadowBlur = 15;
              ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.5)`;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
            
            x += barWidth;
          }
          break;
        }

        case 'radialBars': {
          // Radial bars visualization
          const centerX = width / 2;
          const centerY = height / 2;
          const maxRadius = Math.min(width, height) / 2 * 0.8;
          const barCount = 180;
          const angleStep = (Math.PI * 2) / barCount;
          
          // Draw background circle
          ctx.beginPath();
          ctx.arc(centerX, centerY, maxRadius / 4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Sample from frequency data to cover full circle
          for (let i = 0; i < barCount; i++) {
            const dataIndex = Math.floor((i / barCount) * (bufferLength / 2));
            const amplitude = dataArray[dataIndex] * (sensitivity / 255.0);
            
            // Calculate bar height (which is actually length in radial context)
            const barHeight = amplitude * maxRadius * 0.7;
            
            // Calculate angle
            const angle = i * angleStep;
            
            // Inner point (circle edge)
            const innerRadius = maxRadius / 4;
            const x1 = centerX + Math.cos(angle) * innerRadius;
            const y1 = centerY + Math.sin(angle) * innerRadius;
            
            // Outer point (bar end)
            const outerRadius = innerRadius + barHeight;
            const x2 = centerX + Math.cos(angle) * outerRadius;
            const y2 = centerY + Math.sin(angle) * outerRadius;
            
            // Draw bar
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            
            // Color based on angle
            const hue = (i / barCount) * 360;
            ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            if (glowEffects) {
              ctx.shadowBlur = 8;
              ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.6)`;
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
          }
          break;
        }
      }
      
      // Draw FPS counter if enabled
      if (showFps) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText(`FPS: ${Math.round(fpsRef.current)}`, 10, 20);
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
        onMouseMove={() => isFullScreen && setShowControls(true)}
        onMouseLeave={() => isFullScreen && setTimeout(() => setShowControls(false), 2000)}
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
          className={`absolute top-3 right-3 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all z-10 ${isFullScreen && !showControls ? 'opacity-0' : 'opacity-100'}`}
          title={isFullScreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
        >
          {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        
        {/* YouTube-style controls bar in fullscreen */}
        {isFullScreen && (
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 flex items-center justify-between ${showControls ? 'opacity-100' : 'opacity-0'}`}
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
            <div className="absolute left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 hidden group-hover:block transition-opacity hover:block">
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
            <div className="absolute left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 hidden group-hover:block transition-opacity hover:block">
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
              <div className="absolute left-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 hidden group-hover:block transition-opacity hover:block">
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
            <div className="absolute left-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 hidden group-hover:block transition-opacity hover:block">
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
            <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 hidden group-hover:block transition-opacity hover:block">
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
