import React from 'react';
import type { IconProps } from '../types';

export function ArrowUpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="16" transform="matrix(1 0 0 -1 11 20)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 8)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 15 10)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 17 12)" fill={color}/>
      <rect x="11" y="8" width="2" height="2" transform="rotate(180 11 8)" fill={color}/>
      <rect x="15" y="10" width="8" height="2" transform="rotate(180 15 10)" fill={color}/>
      <rect x="17" y="12" width="12" height="2" transform="rotate(180 17 12)" fill={color}/>
    </svg>
  );
}
