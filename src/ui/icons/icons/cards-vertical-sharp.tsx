import React from 'react';
import type { IconProps } from '../types';

export function CardsVerticalSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="20" y="4" width="12" height="2" transform="rotate(90 20 4)" fill={color}/>
      <rect x="10" y="4" width="12" height="2" transform="rotate(90 10 4)" fill={color}/>
      <rect x="6" y="8" width="12" height="2" transform="rotate(90 6 8)" fill={color}/>
      <rect x="20" y="2" width="2" height="12" transform="rotate(90 20 2)" fill={color}/>
      <rect x="20" y="16" width="2" height="12" transform="rotate(90 20 16)" fill={color}/>
      <rect x="16" y="20" width="2" height="12" transform="rotate(90 16 20)" fill={color}/>
      <rect x="16" y="18" width="2" height="2" transform="rotate(90 16 18)" fill={color}/>
      <rect x="8" y="6" width="2" height="4" transform="rotate(90 8 6)" fill={color}/>
    </svg>
  );
}
