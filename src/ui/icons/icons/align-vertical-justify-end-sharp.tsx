import React from 'react';
import type { IconProps } from '../types';

export function AlignVerticalJustifyEndSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="20" width="20" height="2" fill={color}/>
      <rect x="4" y="16" width="3" height="2" transform="rotate(-90 4 16)" fill={color}/>
      <rect x="4" y="18" width="2" height="16" transform="rotate(-90 4 18)" fill={color}/>
      <rect x="18" y="16" width="3" height="2" transform="rotate(-90 18 16)" fill={color}/>
      <rect x="4" y="13" width="2" height="16" transform="rotate(-90 4 13)" fill={color}/>
      <rect x="7" y="7" width="3" height="2" transform="rotate(-90 7 7)" fill={color}/>
      <rect x="7" y="9" width="2" height="10" transform="rotate(-90 7 9)" fill={color}/>
      <rect x="15" y="7" width="3" height="2" transform="rotate(-90 15 7)" fill={color}/>
      <rect x="7" y="4" width="2" height="10" transform="rotate(-90 7 4)" fill={color}/>
    </svg>
  );
}
