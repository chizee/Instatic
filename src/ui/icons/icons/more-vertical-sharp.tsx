import React from 'react';
import type { IconProps } from '../types';

export function MoreVerticalSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="15" y="1" width="6" height="2" transform="rotate(90 15 1)" fill={color}/>
      <rect x="15" y="9" width="6" height="2" transform="rotate(90 15 9)" fill={color}/>
      <rect x="15" y="17" width="6" height="2" transform="rotate(90 15 17)" fill={color}/>
      <rect x="13" y="1" width="2" height="2" transform="rotate(90 13 1)" fill={color}/>
      <rect x="13" y="9" width="2" height="2" transform="rotate(90 13 9)" fill={color}/>
      <rect x="13" y="17" width="2" height="2" transform="rotate(90 13 17)" fill={color}/>
      <rect x="11" y="1" width="6" height="2" transform="rotate(90 11 1)" fill={color}/>
      <rect x="11" y="9" width="6" height="2" transform="rotate(90 11 9)" fill={color}/>
      <rect x="11" y="17" width="6" height="2" transform="rotate(90 11 17)" fill={color}/>
      <rect x="13" y="5" width="2" height="2" transform="rotate(90 13 5)" fill={color}/>
      <rect x="13" y="13" width="2" height="2" transform="rotate(90 13 13)" fill={color}/>
      <rect x="13" y="21" width="2" height="2" transform="rotate(90 13 21)" fill={color}/>
    </svg>
  );
}
