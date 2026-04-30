import React from 'react';
import type { IconProps } from '../types';

export function ArrowUpBoxSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="20" width="20" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="16" fill={color}/>
      <rect x="20" y="4" width="2" height="16" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 -2.01144e-08 -2.01144e-08 -1 11.0669 8.00885)" fill={color}/>
      <rect width="2" height="6" transform="matrix(1 -2.01144e-08 -2.01144e-08 -1 11.0669 18.0089)" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 -2.01144e-08 -2.01144e-08 -1 9.06689 10.0089)" fill={color}/>
      <rect width="10" height="2" transform="matrix(1 -2.01144e-08 -2.01144e-08 -1 7.06689 12.0089)" fill={color}/>
    </svg>
  );
}
