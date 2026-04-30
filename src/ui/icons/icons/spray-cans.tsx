import React from 'react';
import type { IconProps } from '../types';

export function SprayCansIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="10" y="7" width="6" height="2" fill={color}/>
      <rect x="12" y="5" width="2" height="2" fill={color}/>
      <rect x="8" y="9" width="2" height="10" fill={color}/>
      <rect x="4" y="13" width="2" height="10" fill={color}/>
      <rect x="10" y="17" width="6" height="2" fill={color}/>
      <rect x="6" y="21" width="6" height="2" fill={color}/>
      <rect x="16" y="9" width="2" height="10" fill={color}/>
      <rect x="6" y="11" width="2" height="2" fill={color}/>
      <rect x="12" y="19" width="2" height="2" fill={color}/>
      <rect x="16" y="3" width="2" height="2" fill={color}/>
      <rect x="18" y="1" width="2" height="2" fill={color}/>
      <rect x="18" y="5" width="2" height="2" fill={color}/>
      <g clipPath="url(#clip0_spray_cans)">
        <rect x="17" y="11" width="2" height="8" fill={color}/>
        <rect x="15" y="13" width="2" height="6" fill={color}/>
        <rect x="19" y="13" width="2" height="2" fill={color}/>
        <rect x="15" y="19" width="6" height="2" fill={color}/>
        <rect x="13" y="15" width="2" height="4" fill={color}/>
        <rect x="21" y="15" width="2" height="4" fill={color}/>
        <rect x="19" y="17" width="2" height="2" fill={color}/>
      </g>
      <rect x="15" y="3" width="2" height="2" fill={color}/>
      <rect x="17" y="5" width="2" height="4" fill={color}/>
      <rect x="5" y="3" width="2" height="2" fill={color}/>
      <rect x="9" y="3" width="4" height="2" fill={color}/>
      <defs>
        <clipPath id="clip0_spray_cans">
          <rect width="10" height="10" fill="white" transform="translate(13 11)"/>
        </clipPath>
      </defs>
    </svg>
  );
}
