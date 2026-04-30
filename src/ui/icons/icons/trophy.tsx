import React from 'react';
import type { IconProps } from '../types';

export function TrophyIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="6" y="2.99997" width="12" height="2" fill={color}/>
      <rect x="6" y="2.99997" width="2" height="12" fill={color}/>
      <rect x="16" y="2.99997" width="2" height="12" fill={color}/>
      <rect x="16" y="4.99997" width="6" height="2" fill={color}/>
      <rect x="2" y="4.99997" width="6" height="2" fill={color}/>
      <rect x="2" y="7" width="2" height="4" fill={color}/>
      <rect x="4" y="11" width="2" height="2" fill={color}/>
      <rect x="18" y="11" width="2" height="2" fill={color}/>
      <rect x="20" y="7" width="2" height="4" fill={color}/>
      <rect x="8" y="15" width="8" height="2" fill={color}/>
      <rect x="11" y="17.0001" width="2" height="4" fill={color}/>
      <rect x="9" y="19" width="6" height="2" fill={color}/>
    </svg>
  );
}
