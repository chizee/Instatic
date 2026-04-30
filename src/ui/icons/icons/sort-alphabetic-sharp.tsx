import React from 'react';
import type { IconProps } from '../types';

export function SortAlphabeticSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="9" y="4" width="2" height="2" fill={color}/>
      <rect x="11" y="2" width="2" height="2" fill={color}/>
      <rect x="13" y="4" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 9 20)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 11 22)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 20)" fill={color}/>
      <rect x="3" y="8" width="6" height="2" fill={color}/>
      <rect x="3" y="10" width="2" height="6" fill={color}/>
      <rect x="7" y="10" width="2" height="6" fill={color}/>
      <rect x="5" y="12" width="2" height="2" fill={color}/>
      <rect x="10" y="8" width="2" height="8" fill={color}/>
      <rect x="12" y="8" width="2" height="2" fill={color}/>
      <rect x="14" y="10" width="2" height="6" fill={color}/>
      <rect x="12" y="11" width="2" height="2" fill={color}/>
      <rect x="12" y="14" width="2" height="2" fill={color}/>
      <rect x="18" y="8" width="4" height="2" fill={color}/>
      <rect x="17" y="8" width="2" height="8" fill={color}/>
      <rect x="18" y="14" width="4" height="2" fill={color}/>
    </svg>
  );
}
