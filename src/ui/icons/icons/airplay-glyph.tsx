import React from 'react';
import type { IconProps } from '../types';

export function AirplayGlyphIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="3" width="20" height="2" fill={color}/>
      <rect x="2" y="5" width="2" height="12" fill={color}/>
      <rect x="20" y="5" width="2" height="12" fill={color}/>
      <rect x="2" y="17" width="3" height="2" fill={color}/>
      <rect x="4" y="15" width="3" height="2" fill={color}/>
      <rect x="4" y="13" width="5" height="2" fill={color}/>
      <rect x="4" y="11" width="7" height="2" fill={color}/>
      <rect x="13" y="11" width="7" height="2" fill={color}/>
      <rect x="15" y="13" width="5" height="2" fill={color}/>
      <rect x="17" y="15" width="3" height="2" fill={color}/>
      <rect x="4" y="5" width="16" height="6" fill={color}/>
      <rect x="19" y="17" width="3" height="2" fill={color}/>
      <rect x="11" y="15" width="2" height="2" fill={color}/>
      <rect x="9" y="17" width="4" height="2" fill={color}/>
      <rect x="13" y="17" width="2" height="2" fill={color}/>
      <rect x="15" y="19" width="2" height="2" fill={color}/>
      <rect x="7" y="19" width="8" height="2" fill={color}/>
    </svg>
  );
}
