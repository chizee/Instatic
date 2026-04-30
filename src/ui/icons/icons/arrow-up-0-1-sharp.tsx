import React from 'react';
import type { IconProps } from '../types';

export function ArrowUp01SharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="18" transform="matrix(1 0 0 -1 7 21)" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 5 7)" fill={color}/>
      <rect width="10" height="2" transform="matrix(1 0 0 -1 3 9)" fill={color}/>
      <rect x="15" y="13" width="4" height="2" fill={color}/>
      <rect x="17" y="13" width="2" height="8" fill={color}/>
      <rect x="15" y="19" width="6" height="2" fill={color}/>
      <rect x="15" y="3" width="6" height="2" fill={color}/>
      <rect x="15" y="5" width="2" height="4" fill={color}/>
      <rect x="19" y="5" width="2" height="4" fill={color}/>
      <rect x="15" y="9" width="6" height="2" fill={color}/>
    </svg>
  );
}
