import React from 'react';
import {
  Sun,
  SunDim,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSunRain,
  CloudMoonRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  HelpCircle,
} from 'lucide-react';

const ICON_MAP = {
  Sun: Sun,
  SunDim: SunDim,
  Moon: Moon,
  Cloud: Cloud,
  CloudSun: CloudSun,
  CloudMoon: CloudMoon,
  CloudFog: CloudFog,
  CloudDrizzle: CloudDrizzle,
  CloudRain: CloudRain,
  CloudSunRain: CloudSunRain,
  CloudMoonRain: CloudMoonRain,
  CloudSnow: CloudSnow,
  CloudLightning: CloudLightning,
  Wind: Wind,
  Droplets: Droplets,
};

export function WeatherIcon({ name, size = 24, className = '', animate = false }) {
  const Component = ICON_MAP[name] || HelpCircle;
  const animClass = animate ? 'transition-transform duration-300 hover:scale-110' : '';

  return <Component size={size} className={`${animClass} ${className}`} />;
}
