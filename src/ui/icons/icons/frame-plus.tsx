import React from 'react';
import type { IconProps } from '../types';

export function FramePlusIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="5" y="2" width="2" height="20" fill={color}/>
      <rect x="17" y="2" width="2" height="11" fill={color}/>
      <rect x="2" y="5" width="20" height="2" fill={color}/>
      <rect x="2" y="17" width="11" height="2" fill={color}/>
      <rect x="15" y="17" width="6" height="2" fill={color}/>
      <rect x="17" y="15" width="2" height="6" fill={color}/>
    </svg>
  );
}
