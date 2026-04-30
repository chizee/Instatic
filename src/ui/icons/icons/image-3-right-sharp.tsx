import React from 'react';
import type { IconProps } from '../types';

export function Image3RightSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="20" width="8" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="16" fill={color}/>
      <rect x="20" y="4" width="2" height="8" fill={color}/>
      <rect x="4" y="14" width="2" height="2" fill={color}/>
      <rect x="6" y="12" width="2" height="2" fill={color}/>
      <rect x="8" y="14" width="2" height="2" fill={color}/>
      <rect x="10" y="16" width="2" height="2" fill={color}/>
      <rect x="13" y="11" width="3" height="2" fill={color}/>
      <rect x="11" y="8" width="2" height="3" fill={color}/>
      <rect width="2" height="10" transform="matrix(-1 0 0 1 20 14)" fill={color}/>
      <rect width="2" height="6" transform="matrix(-1 0 0 1 22 16)" fill={color}/>
      <rect x="22" y="18" width="2" height="2" fill={color}/>
      <rect x="14" y="18" width="4" height="2" fill={color}/>
      <rect x="13" y="6" width="3" height="2" fill={color}/>
      <rect x="16" y="8" width="2" height="3" fill={color}/>
    </svg>
  );
}
