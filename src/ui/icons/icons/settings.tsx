import React from 'react';
import type { IconProps } from '../types';

export function SettingsIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Top tooth */}
      <rect x="10" y="0" width="4" height="4" fill={color}/>
      {/* Bottom tooth */}
      <rect x="10" y="20" width="4" height="4" fill={color}/>
      {/* Left tooth */}
      <rect x="0" y="10" width="4" height="4" fill={color}/>
      {/* Right tooth */}
      <rect x="20" y="10" width="4" height="4" fill={color}/>
      {/* Outer ring - top-left diagonal */}
      <rect x="4" y="4" width="2" height="2" fill={color}/>
      {/* Outer ring - top-right diagonal */}
      <rect x="18" y="4" width="2" height="2" fill={color}/>
      {/* Outer ring - bottom-left diagonal */}
      <rect x="4" y="18" width="2" height="2" fill={color}/>
      {/* Outer ring - bottom-right diagonal */}
      <rect x="18" y="18" width="2" height="2" fill={color}/>
      {/* Outer ring - top bar */}
      <rect x="6" y="2" width="12" height="2" fill={color}/>
      {/* Outer ring - bottom bar */}
      <rect x="6" y="20" width="12" height="2" fill={color}/>
      {/* Outer ring - left bar */}
      <rect x="2" y="6" width="2" height="12" fill={color}/>
      {/* Outer ring - right bar */}
      <rect x="20" y="6" width="2" height="12" fill={color}/>
      {/* Inner ring - top */}
      <rect x="8" y="6" width="8" height="2" fill={color}/>
      {/* Inner ring - bottom */}
      <rect x="8" y="16" width="8" height="2" fill={color}/>
      {/* Inner ring - left */}
      <rect x="6" y="8" width="2" height="8" fill={color}/>
      {/* Inner ring - right */}
      <rect x="16" y="8" width="2" height="8" fill={color}/>
      {/* Center dot */}
      <rect x="10" y="10" width="4" height="4" fill={color}/>
    </svg>
  );
}
