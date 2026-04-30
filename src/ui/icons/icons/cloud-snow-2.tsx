import React from 'react';
import type { IconProps } from '../types';

export function CloudSnow2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M22 6H18V8H22V6Z" fill={color}/>
      <path d="M24 8H22V13H24V8Z" fill={color}/>
      <path d="M6 13H2V15H6V13Z" fill={color}/>
      <path d="M22 13H18V15H22V13Z" fill={color}/>
      <path d="M2 8H0V13H2V8Z" fill={color}/>
      <path d="M4 6H2V8H4V6Z" fill={color}/>
      <path d="M8 4H4V6H8V4Z" fill={color}/>
      <path d="M16 0H10V2H16V0Z" fill={color}/>
      <path d="M10 2H8V4H10V2Z" fill={color}/>
      <path d="M10 6H8V8H10V6Z" fill={color}/>
      <path d="M18 2H16V4H18V2Z" fill={color}/>
      <path d="M20 4H18V8H20V4Z" fill={color}/>
      <path d="M18 8H16V10H18V8Z" fill={color}/>
      <rect x="2" y="17" width="3" height="2" fill={color}/>
      <rect x="10" y="14" width="4" height="2" fill={color}/>
      <rect x="19" y="17" width="3" height="2" fill={color}/>
      <rect y="19" width="2" height="3" fill={color}/>
      <rect x="8" y="16" width="2" height="3" fill={color}/>
      <rect x="17" y="19" width="2" height="3" fill={color}/>
      <rect x="2" y="22" width="3" height="2" fill={color}/>
      <rect x="10" y="19" width="4" height="2" fill={color}/>
      <rect x="19" y="22" width="3" height="2" fill={color}/>
      <rect x="5" y="19" width="2" height="3" fill={color}/>
      <rect x="14" y="16" width="2" height="3" fill={color}/>
      <rect x="22" y="19" width="2" height="3" fill={color}/>
    </svg>
  );
}
