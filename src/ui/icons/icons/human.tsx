import React from 'react';
import type { IconProps } from '../types';

export function HumanIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <rect x="10" y="2" width="4" height="4" fill={color}/>
      <rect x="3" y="7" width="18" height="2" fill={color}/>
      <rect x="9" y="9" width="2" height="7" fill={color}/>
      <rect x="13" y="9" width="2" height="7" fill={color}/>
      <rect x="9" y="16" width="2" height="6" fill={color}/>
      <rect x="13" y="16" width="2" height="6" fill={color}/>
      <rect x="11" y="14" width="2" height="2" fill={color}/>
    </svg>
  );
}
