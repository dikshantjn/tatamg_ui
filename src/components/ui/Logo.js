import React from 'react';
import { Box } from '@mui/material';
import logoPng from '../../assets/logo/Logo.png';

const SIZE_TO_PX = {
  small: 28,
  medium: 40,
  large: 56,
  xlarge: 72
};

const Logo = ({ size = 'small', variant: _variant = 'transparent', sx = {}, ...props }) => {
  const height = SIZE_TO_PX[size] || SIZE_TO_PX.small;
  const src = logoPng;

  return (
    <Box
      component="img"
      src={src}
      alt="Vedika Health"
      sx={{
        display: 'block',
        height,
        width: 'auto',
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))',
        margin: 0,
        padding: 0,
        lineHeight: 0,
        ...sx
      }}
      {...props}
    />
  );
};

export default Logo;


