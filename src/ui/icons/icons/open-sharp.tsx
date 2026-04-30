import React from 'react';
import type { IconProps } from '../types';

export function OpenSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="5" width="8" height="2" fill={color}/>
      <rect x="13" y="3.00006" width="8" height="2" fill={color}/>
      <rect x="3" y="19" width="16" height="2" fill={color}/>
      <rect x="3" y="7" width="2" height="12" fill={color}/>
      <rect x="17" y="13.0001" width="2" height="6" fill={color}/>
      <rect x="19" y="3.00006" width="2" height="8" fill={color}/>
      <rect x="11" y="11.0001" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 17 7.00009)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 19 5.00006)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 15 9.00009)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 11 13.0001)" fill={color}/>
    </svg>
  );
}
