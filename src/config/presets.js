/**
 * Presets for Sonic Visualizer
 * Designed specifically for DJs, clubs, and event scenarios
 */

export const visualizationPresets = {
  // DJ-oriented presets
  dj: {
    club: {
      name: "Club DJ",
      visualizationType: 'bars',
      colorTheme: 'neon',
      backgroundStyle: 'starfield',
      backgroundTheme: 'night',
      barStyle: 'normal',
      sensitivity: 1.8,
      glowEffects: true,
      motionEffects: true,
      description: "High energy visualization perfect for club environments with vibrant neon colors and responsive bars"
    },
    edm: {
      name: "EDM Festival",
      visualizationType: 'radialBars',
      colorTheme: 'cyberpunk',
      backgroundStyle: 'gradient',
      backgroundTheme: 'night',
      sensitivity: 2.0,
      glowEffects: true,
      motionEffects: true,
      description: "Circular visualization with intense colors ideal for electronic dance music and festival environments"
    },
    lounge: {
      name: "Lounge/Ambient",
      visualizationType: 'wave',
      colorTheme: 'pastel',
      backgroundStyle: 'gradient',
      backgroundTheme: 'sunset',
      sensitivity: 1.5,
      glowEffects: true,
      motionEffects: true,
      description: "Smooth flowing waves with subtle pastel colors, perfect for lounge or chill-out areas"
    },
    hiphop: {
      name: "Hip-Hop",
      visualizationType: 'spectrum',
      colorTheme: 'fire',
      backgroundStyle: 'solid',
      backgroundTheme: 'dark',
      sensitivity: 1.8,
      glowEffects: true,
      motionEffects: true,
      description: "Responsive spectrum analyzer with warm colors to complement hip-hop and R&B music"
    }
  },
  
  // Event-oriented presets
  events: {
    corporate: {
      name: "Corporate Event",
      visualizationType: 'wave',
      colorTheme: 'grayscale',
      backgroundStyle: 'gradient',
      backgroundTheme: 'dark',
      sensitivity: 1.2,
      glowEffects: true,
      motionEffects: true,
      description: "Professional, understated visuals suitable for corporate events and formal gatherings"
    },
    wedding: {
      name: "Wedding",
      visualizationType: 'particles',
      colorTheme: 'pastel',
      backgroundStyle: 'starfield',
      backgroundTheme: 'night',
      sensitivity: 1.5,
      glowEffects: true,
      motionEffects: true,
      description: "Elegant particle effects with soft colors, ideal for wedding receptions and celebrations"
    },
    concert: {
      name: "Live Concert",
      visualizationType: 'terrain',
      colorTheme: 'cyberpunk',
      backgroundStyle: 'gradient',
      backgroundTheme: 'sunset',
      sensitivity: 1.7,
      glowEffects: true,
      motionEffects: true,
      description: "Dynamic landscape visualization that complements live music performances"
    },
    productLaunch: {
      name: "Product Launch",
      visualizationType: 'spiral',
      colorTheme: 'neon',
      backgroundStyle: 'gradient',
      backgroundTheme: 'ocean',
      sensitivity: 1.6,
      glowEffects: true,
      motionEffects: true,
      description: "Eye-catching spiral effects to draw attention during product launches or presentations"
    }
  },
  
  // Venue-oriented presets
  venues: {
    nightclub: {
      name: "Nightclub",
      visualizationType: 'particles',
      colorTheme: 'cyberpunk',
      backgroundStyle: 'starfield',
      backgroundTheme: 'night',
      sensitivity: 2.0,
      glowEffects: true,
      motionEffects: true,
      description: "High-energy particle system with intense colors that responds dramatically to beats"
    },
    bar: {
      name: "Bar/Pub",
      visualizationType: 'bars',
      colorTheme: 'fire',
      backgroundStyle: 'solid',
      backgroundTheme: 'dark',
      barStyle: 'blocks',
      sensitivity: 1.5,
      glowEffects: true,
      motionEffects: true,
      description: "Classic bar visualization with warm colors, not too distracting but visually appealing"
    },
    restaurant: {
      name: "Restaurant",
      visualizationType: 'circle',
      colorTheme: 'pastel',
      backgroundStyle: 'gradient',
      backgroundTheme: 'forest',
      sensitivity: 1.2,
      glowEffects: true,
      motionEffects: true,
      description: "Subtle circular visualization that provides ambient visual interest without being distracting"
    },
    artGallery: {
      name: "Art Gallery/Exhibition",
      visualizationType: 'spiral',
      colorTheme: 'grayscale',
      backgroundStyle: 'solid',
      backgroundTheme: 'light',
      sensitivity: 1.4,
      glowEffects: false,
      motionEffects: true,
      description: "Minimalist visualization suitable for artistic venues and exhibitions"
    }
  }
};

// Branding presets for different use cases
export const brandingPresets = {
  cornerLogo: {
    name: "Corner Logo",
    logoPosition: { x: 10, y: 10 },
    logoSize: 15,
    logoOpacity: 0.8,
    showText: false,
    description: "Subtle logo placement in the top-left corner, non-intrusive"
  },
  centerLogo: {
    name: "Center Watermark",
    logoPosition: { x: 50, y: 50 },
    logoSize: 25,
    logoOpacity: 0.3,
    showText: false,
    description: "Large centered watermark logo with low opacity"
  },
  eventTitle: {
    name: "Event Title",
    textPosition: { x: 50, y: 10 },
    textSize: 36,
    textColor: "#ffffff",
    textOpacity: 0.9,
    textAlignment: "center",
    textOutline: true,
    showLogo: true,
    logoPosition: { x: 50, y: 90 },
    logoSize: 15,
    logoOpacity: 0.8,
    description: "Event title at top with logo at bottom"
  },
  djNameplate: {
    name: "DJ Nameplate",
    textPosition: { x: 50, y: 90 },
    textSize: 32,
    textColor: "#ffffff",
    textOpacity: 0.9,
    textAlignment: "center",
    textOutline: true,
    showLogo: true,
    logoPosition: { x: 15, y: 85 },
    logoSize: 10,
    logoOpacity: 0.8,
    description: "DJ name at bottom with small logo"
  },
  venuePromo: {
    name: "Venue Promotion",
    textPosition: { x: 50, y: 85 },
    textSize: 28,
    textColor: "#ffffff",
    textOpacity: 0.8,
    textAlignment: "center",
    textOutline: true,
    showLogo: true,
    logoPosition: { x: 50, y: 15 },
    logoSize: 20,
    logoOpacity: 0.9,
    description: "Venue logo at top with promotional text at bottom"
  }
};

// Export default settings as a fallback
export const defaultSettings = {
  visualization: {
    visualizationType: 'bars',
    colorTheme: 'neon',
    backgroundStyle: 'gradient',
    backgroundTheme: 'dark',
    barStyle: 'normal',
    sensitivity: 1.5,
    glowEffects: true,
    motionEffects: true
  },
  branding: {
    showBranding: false,
    textPosition: { x: 50, y: 85 },
    textSize: 32,
    textColor: "#ffffff",
    textOpacity: 0.8,
    textAlignment: "center",
    textOutline: true,
    logoPosition: { x: 10, y: 10 },
    logoSize: 15,
    logoOpacity: 0.8
  }
};