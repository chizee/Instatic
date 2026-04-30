import React from 'react';
import type { IconProps } from '../types';

export function WifiIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="11" y="19" width="2" height="2" fill={color}/>
      <rect x="7" y="16" width="2" height="2" fill={color}/>
      <rect x="15" y="16" width="2" height="2" fill={color}/>
      <rect x="9" y="14" width="6" height="2" fill={color}/>
      <rect x="4" y="13" width="2" height="2" fill={color}/>
      <rect x="6" y="11" width="2" height="2" fill={color}/>
      <rect x="8" y="9" width="8" height="2" fill={color}/>
      <rect x="1" y="10" width="2" height="2" fill={color}/>
      <rect x="21" y="10" width="2" height="2" fill={color}/>
      <rect x="3" y="8" width="2" height="2" fill={color}/>
      <rect x="5" y="6" width="2" height="2" fill={color}/>
      <rect x="7" y="4" width="10" height="2" fill={color}/>
      <rect x="19" y="8" width="2" height="2" fill={color}/>
      <rect x="17" y="6" width="2" height="2" fill={color}/>
      <rect x="18" y="13" width="2" height="2" fill={color}/>
      <rect x="16" y="11" width="2" height="2" fill={color}/>
    </svg>
  );
}
