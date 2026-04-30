import React from 'react';
import type { IconProps } from '../types';

export function SortVerticalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="16" y="4" width="2" height="16" fill={color}/>
      <rect x="14" y="14" width="2" height="4" fill={color}/>
      <rect x="12" y="14" width="2" height="2" fill={color}/>
      <rect x="18" y="14" width="2" height="4" fill={color}/>
      <rect x="20" y="14" width="2" height="2" fill={color}/>
      <rect width="2" height="16" transform="matrix(1 0 0 -1 6 20)" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 4 10)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 2 10)" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 8 10)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 10 10)" fill={color}/>
    </svg>
  );
}
