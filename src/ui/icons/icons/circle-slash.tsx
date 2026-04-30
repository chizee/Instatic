import React from 'react';
import type { IconProps } from '../types';

export function CircleSlashIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="12" transform="matrix(-1 0 0 1 22 6)" fill={color}/>
      <rect width="12" height="2" transform="matrix(-1 0 0 1 18 20)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-1 0 0 1 4 6)" fill={color}/>
      <rect width="12" height="2" transform="matrix(-1 0 0 1 18 2)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 20 4)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 22 2)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 18 6)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 16 8)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 14 10)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 12 12)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 10 14)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 8 16)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 6 18)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 4 20)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 20 18)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 6 4)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 6 18)" fill={color}/>
    </svg>
  );
}
