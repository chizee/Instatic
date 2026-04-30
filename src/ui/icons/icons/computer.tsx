import React from 'react';
import type { IconProps } from '../types';

export function ComputerIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="6" y="1" width="12" height="2" fill={color}/>
      <rect x="6" y="9" width="12" height="2" fill={color}/>
      <rect x="4" y="3" width="2" height="6" fill={color}/>
      <rect x="18" y="3" width="2" height="6" fill={color}/>
      <rect x="4" y="13" width="16" height="2" fill={color}/>
      <rect x="4" y="21" width="16" height="2" fill={color}/>
      <rect x="2" y="15" width="2" height="6" fill={color}/>
      <rect x="20" y="15" width="2" height="6" fill={color}/>
      <rect x="6" y="17" width="2" height="2" fill={color}/>
      <rect x="10" y="17" width="8" height="2" fill={color}/>
      <rect x="8" y="11" width="2" height="2" fill={color}/>
      <rect x="14" y="11" width="2" height="2" fill={color}/>
    </svg>
  );
}
