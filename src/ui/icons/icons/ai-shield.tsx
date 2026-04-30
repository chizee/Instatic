import React from 'react';
import type { IconProps } from '../types';

export function AiShieldIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="2" width="16" height="2" fill={color}/>
      <rect x="1.99976" y="4" width="2" height="10" fill={color}/>
      <rect x="19.9998" y="4" width="2" height="10" fill={color}/>
      <rect x="3.99976" y="14.0001" width="2" height="2" fill={color}/>
      <rect x="6" y="16.0001" width="2" height="2" fill={color}/>
      <rect x="10" y="20" width="4" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 19.9995 14.0001)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 18 16.0001)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 15.9995 18)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 10 18)" fill={color}/>
      <rect x="7" y="8" width="2" height="6" fill={color}/>
      <rect x="11" y="8" width="2" height="6" fill={color}/>
      <rect x="15" y="6" width="2" height="8" fill={color}/>
      <rect x="9" y="6" width="2" height="2" fill={color}/>
      <rect x="9" y="10" width="2" height="2" fill={color}/>
    </svg>
  );
}
