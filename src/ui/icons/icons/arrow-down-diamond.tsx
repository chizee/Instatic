import React from 'react';
import type { IconProps } from '../types';

export function ArrowDownDiamondIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="11" y="16" width="2" height="2" fill={color}/>
      <rect x="11" y="6" width="2" height="6" fill={color}/>
      <rect x="9" y="14" width="6" height="2" fill={color}/>
      <rect x="7" y="12" width="10" height="2" fill={color}/>
      <rect x="11" y="1" width="2" height="2" fill={color}/>
      <rect x="13" y="3" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 11 3)" fill={color}/>
      <rect x="15" y="5" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 9 5)" fill={color}/>
      <rect x="17" y="7" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 7 7)" fill={color}/>
      <rect x="19" y="9" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 5 9)" fill={color}/>
      <rect x="21" y="11" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 3 11)" fill={color}/>
      <rect x="19" y="13" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 5 13)" fill={color}/>
      <rect x="17" y="15" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 7 15)" fill={color}/>
      <rect x="15" y="17" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 9 17)" fill={color}/>
      <rect x="13" y="19" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 11 19)" fill={color}/>
      <rect x="11" y="21" width="2" height="2" fill={color}/>
    </svg>
  );
}
