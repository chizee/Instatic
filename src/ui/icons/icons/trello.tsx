import React from 'react';
import type { IconProps } from '../types';

export function TrelloIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="2" width="16" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="16" fill={color}/>
      <rect x="20" y="4" width="2" height="16" fill={color}/>
      <rect x="4" y="20" width="16" height="2" fill={color}/>
      <rect x="5" y="6" width="6" height="2" fill={color}/>
      <rect x="5" y="16" width="6" height="2" fill={color}/>
      <rect x="13" y="6" width="6" height="2" fill={color}/>
      <rect x="13" y="12" width="6" height="2" fill={color}/>
      <rect x="5" y="6" width="2" height="12" fill={color}/>
      <rect x="9" y="6" width="2" height="12" fill={color}/>
      <rect x="13" y="6" width="2" height="6" fill={color}/>
      <rect x="17" y="6" width="2" height="6" fill={color}/>
    </svg>
  );
}
