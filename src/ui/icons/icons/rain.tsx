import React from 'react';
import type { IconProps } from '../types';

export function RainIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <g clip-path="url(#clip0_496_1449)">
      <path d="M22 6H18V8H22V6Z" fill={color}/>
      <path d="M24 8H22V14H24V8Z" fill={color}/>
      <path d="M22 14H2V16H22V14Z" fill={color}/>
      <path d="M2 8H0V14H2V8Z" fill={color}/>
      <path d="M4 6H2V8H4V6Z" fill={color}/>
      <path d="M8 4H4V6H8V4Z" fill={color}/>
      <path d="M16 0H10V2H16V0Z" fill={color}/>
      <path d="M10 2H8V4H10V2Z" fill={color}/>
      <path d="M10 6H8V8H10V6Z" fill={color}/>
      <path d="M18 2H16V4H18V2Z" fill={color}/>
      <path d="M20 4H18V8H20V4Z" fill={color}/>
      <path d="M18 8H16V10H18V8Z" fill={color}/>
      <rect x="11" y="18" width="2" height="2" fill={color}/>
      <rect x="15" y="18" width="2" height="2" fill={color}/>
      <rect x="7" y="18" width="2" height="2" fill={color}/>
      <rect x="9" y="22" width="2" height="2" fill={color}/>
      <rect x="13" y="22" width="2" height="2" fill={color}/>
      <rect x="17" y="22" width="2" height="2" fill={color}/>
      <rect x="5" y="22" width="2" height="2" fill={color}/>
      </g>
      <defs>
      <clipPath id="clip0_496_1449">
      <rect width="24" height="24" fill="white"/>
      </clipPath>
      </defs>
    </svg>
  );
}
