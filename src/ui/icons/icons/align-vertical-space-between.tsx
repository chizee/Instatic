import React from 'react';
import type { IconProps } from '../types';

export function AlignVerticalSpaceBetweenIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="19" width="3" height="2" transform="rotate(-90 4 19)" fill={color}/>
      <rect x="2" y="21" width="2" height="20" transform="rotate(-90 2 21)" fill={color}/>
      <rect x="18" y="19" width="3" height="2" transform="rotate(-90 18 19)" fill={color}/>
      <rect x="6" y="16" width="2" height="12" transform="rotate(-90 6 16)" fill={color}/>
      <rect x="7" y="8" width="3" height="2" transform="rotate(-90 7 8)" fill={color}/>
      <rect x="9" y="10" width="2" height="6" transform="rotate(-90 9 10)" fill={color}/>
      <rect x="15" y="8" width="3" height="2" transform="rotate(-90 15 8)" fill={color}/>
      <rect x="2" y="5" width="2" height="20" transform="rotate(-90 2 5)" fill={color}/>
    </svg>
  );
}
