import React from 'react';
import type { IconProps } from '../types';

export function HotelBedIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M2 16H12V8H22V10H14V16H22V10H24V20H22V18H2V20H0V4H2V16ZM9 15H5V13H9V15ZM5 13H3V9H5V13ZM11 13H9V9H11V13ZM9 9H5V7H9V9Z" fill={color}/>
    </svg>
  );
}
