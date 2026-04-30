import React from 'react';
import type { IconProps } from '../types';

export function FilesIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="14" transform="matrix(-1 0 0 1 9 3)" fill={color}/>
      <rect width="2" height="14" transform="matrix(-1 0 0 1 5 7)" fill={color}/>
      <rect width="8" height="2" transform="matrix(-1 0 0 1 17 1)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-1 0 0 1 21 5)" fill={color}/>
      <rect width="10" height="2" transform="matrix(-1 0 0 1 19 17)" fill={color}/>
      <rect width="10" height="2" transform="matrix(-1 0 0 1 15 21)" fill={color}/>
      <rect x="17" y="3" width="2" height="2" fill={color}/>
      <rect x="13" y="3" width="2" height="6" fill={color}/>
      <rect x="13" y="7" width="6" height="2" fill={color}/>
      <rect x="5" y="5" width="2" height="2" fill={color}/>
      <rect x="15" y="19" width="2" height="2" fill={color}/>
    </svg>
  );
}
