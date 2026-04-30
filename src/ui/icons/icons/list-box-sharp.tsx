import React from 'react';
import type { IconProps } from '../types';

export function ListBoxSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="2" width="20" height="2" fill={color}/>
      <rect x="6" y="7" width="2" height="2" fill={color}/>
      <rect x="10" y="7" width="8" height="2" fill={color}/>
      <rect x="6" y="11" width="2" height="2" fill={color}/>
      <rect x="10" y="11" width="8" height="2" fill={color}/>
      <rect x="6" y="15" width="2" height="2" fill={color}/>
      <rect x="10" y="15" width="8" height="2" fill={color}/>
      <rect x="2" y="20" width="20" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="16" fill={color}/>
      <rect x="20" y="4" width="2" height="16" fill={color}/>
    </svg>
  );
}
