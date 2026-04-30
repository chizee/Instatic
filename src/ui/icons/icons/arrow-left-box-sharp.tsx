import React from 'react';
import type { IconProps } from '../types';

export function ArrowLeftBoxSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="8.06689" y="11.0088" width="2" height="2" transform="rotate(90 8.06689 11.0088)" fill={color}/>
      <rect x="18.0669" y="11.0088" width="2" height="6" transform="rotate(90 18.0669 11.0088)" fill={color}/>
      <rect x="10.0669" y="9.00885" width="6" height="2" transform="rotate(90 10.0669 9.00885)" fill={color}/>
      <rect x="12.0669" y="7.00884" width="10" height="2" transform="rotate(90 12.0669 7.00884)" fill={color}/>
    </svg>
  );
}
