import React from 'react';
import type { IconProps } from '../types';

export function NintendoSwitchIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="2" width="8" height="2" fill={color}/>
      <rect x="4" y="20" width="8" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="16" fill={color}/>
      <rect x="6" y="8" width="3" height="3" fill={color}/>
      <path d="M20 4H22V20H20V22H15V16H18V13H15V2H20V4Z" fill={color}/>
      <rect x="12" y="2" width="3" height="20" fill={color}/>
    </svg>
  );
}
