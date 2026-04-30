import React from 'react';
import type { IconProps } from '../types';

export function BracketsOffSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="6" height="2" transform="matrix(-1 0 0 1 21 3)" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 3 21)" fill={color}/>
      <rect x="19" y="21" width="4" height="2" transform="rotate(180 19 21)" fill={color}/>
      <rect x="3" y="5" width="2" height="14" fill={color}/>
      <rect width="2" height="10" transform="matrix(-1 0 0 1 21 5)" fill={color}/>
      <rect x="3" y="3" width="2" height="2" fill={color}/>
      <rect x="5" y="5" width="2" height="2" fill={color}/>
      <rect x="7" y="7" width="2" height="2" fill={color}/>
      <rect x="9" y="9" width="2" height="2" fill={color}/>
      <rect x="11" y="11" width="2" height="2" fill={color}/>
      <rect x="13" y="13" width="2" height="2" fill={color}/>
      <rect x="15" y="15" width="2" height="2" fill={color}/>
      <rect x="17" y="17" width="2" height="2" fill={color}/>
      <rect x="19" y="19" width="2" height="2" fill={color}/>
    </svg>
  );
}
