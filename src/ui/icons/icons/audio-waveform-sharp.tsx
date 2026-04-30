import React from 'react';
import type { IconProps } from '../types';

export function AudioWaveformSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="7" width="2" height="5" fill={color}/>
      <rect x="7" y="7" width="2" height="13" fill={color}/>
      <rect x="11" y="4" width="2" height="16" fill={color}/>
      <rect x="15" y="4" width="2" height="13" fill={color}/>
      <rect x="3" y="5" width="6" height="2" fill={color}/>
      <rect x="7" y="20" width="6" height="2" fill={color}/>
      <rect x="11" y="2" width="6" height="2" fill={color}/>
      <rect x="15" y="17" width="6" height="2" fill={color}/>
      <rect x="19" y="12" width="2" height="5" fill={color}/>
      <rect x="19" y="10" width="4" height="2" fill={color}/>
      <rect x="1" y="12" width="4" height="2" fill={color}/>
    </svg>
  );
}
