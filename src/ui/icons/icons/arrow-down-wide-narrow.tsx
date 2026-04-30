import React from 'react';
import type { IconProps } from '../types';

export function ArrowDownWideNarrowIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="6" y="3" width="2" height="18" fill={color}/>
      <rect x="4" y="17" width="6" height="2" fill={color}/>
      <rect x="2" y="15" width="10" height="2" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 10 13)" fill={color}/>
      <rect width="9" height="2" transform="matrix(1 0 0 -1 10 9)" fill={color}/>
      <rect width="12" height="2" transform="matrix(1 0 0 -1 10 5)" fill={color}/>
    </svg>
  );
}
