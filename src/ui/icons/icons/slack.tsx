import React from 'react';
import type { IconProps } from '../types';

export function SlackIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <g clipPath="url(#clip0_496_1573)">
        <rect x="12" y="3" width="2" height="6" fill={color}/>
        <rect x="21" y="12" width="2" height="6" transform="rotate(90 21 12)" fill={color}/>
        <rect x="12" y="21" width="2" height="6" transform="rotate(-180 12 21)" fill={color}/>
        <rect x="3" y="12" width="2" height="6" transform="rotate(-90 3 12)" fill={color}/>
        <rect x="15" y="3" width="2" height="6" fill={color}/>
        <rect x="21" y="15" width="2" height="6" transform="rotate(90 21 15)" fill={color}/>
        <rect x="9" y="21" width="2" height="6" transform="rotate(-180 9 21)" fill={color}/>
        <rect x="3" y="9" width="2" height="6" transform="rotate(-90 3 9)" fill={color}/>
        <rect x="20" y="5" width="2" height="2" fill={color}/>
        <rect x="19" y="20" width="2" height="2" transform="rotate(90 19 20)" fill={color}/>
        <rect x="4" y="19" width="2" height="2" transform="rotate(-180 4 19)" fill={color}/>
        <rect x="5" y="4" width="2" height="2" transform="rotate(-90 5 4)" fill={color}/>
        <rect x="22" y="7" width="2" height="2" fill={color}/>
        <rect x="17" y="22" width="2" height="2" transform="rotate(90 17 22)" fill={color}/>
        <rect x="2" y="17" width="2" height="2" transform="rotate(-180 2 17)" fill={color}/>
        <rect x="7" y="2" width="2" height="2" transform="rotate(-90 7 2)" fill={color}/>
        <rect x="18" y="7" width="2" height="4" fill={color}/>
        <rect x="17" y="18" width="2" height="4" transform="rotate(90 17 18)" fill={color}/>
        <rect x="6" y="17" width="2" height="4" transform="rotate(-180 6 17)" fill={color}/>
        <rect x="7" y="6" width="2" height="4" transform="rotate(-90 7 6)" fill={color}/>
        <rect x="20" y="9" width="2" height="2" fill={color}/>
        <rect x="15" y="20" width="2" height="2" transform="rotate(90 15 20)" fill={color}/>
        <rect x="4" y="15" width="2" height="2" transform="rotate(-180 4 15)" fill={color}/>
        <rect x="9" y="4" width="2" height="2" transform="rotate(-90 9 4)" fill={color}/>
        <rect x="13" y="1" width="3" height="2" fill={color}/>
        <rect x="23" y="13" width="3" height="2" transform="rotate(90 23 13)" fill={color}/>
        <rect x="11" y="23" width="3" height="2" transform="rotate(-180 11 23)" fill={color}/>
        <rect x="1" y="11" width="3" height="2" transform="rotate(-90 1 11)" fill={color}/>
        <rect x="13" y="9" width="3" height="2" fill={color}/>
        <rect x="15" y="13" width="3" height="2" transform="rotate(90 15 13)" fill={color}/>
        <rect x="11" y="15" width="3" height="2" transform="rotate(-180 11 15)" fill={color}/>
        <rect x="9" y="11" width="3" height="2" transform="rotate(-90 9 11)" fill={color}/>
      </g>
      <defs>
        <clipPath id="clip0_496_1573">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
