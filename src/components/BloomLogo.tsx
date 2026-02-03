import { Box } from '@mui/material';

interface BloomLogoProps {
  size?: number;
}

const BloomLogo = ({ size = 40 }: BloomLogoProps) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Orange petal - top left */}
        <path
          d="M25 25 L50 15 L50 50 Z"
          fill="#F6921E"
        />
        {/* Yellow petal - left */}
        <path
          d="M15 50 L25 25 L50 50 Z"
          fill="#E8DE23"
        />
        {/* Light Green petal - bottom left */}
        <path
          d="M25 75 L15 50 L50 50 Z"
          fill="#8BC53F"
        />
        {/* Green petal - top right */}
        <path
          d="M75 25 L50 15 L50 50 Z"
          fill="#37A526"
        />
        {/* Light Blue petal - bottom */}
        <path
          d="M50 85 L25 75 L50 50 Z"
          fill="#00ADEE"
        />
        {/* Blue petal - bottom right */}
        <path
          d="M75 75 L50 85 L50 50 Z"
          fill="#1B75BB"
        />
        {/* Right petal */}
        <path
          d="M85 50 L75 75 L50 50 Z"
          fill="#1B75BB"
        />
        {/* Top right petal */}
        <path
          d="M75 25 L85 50 L50 50 Z"
          fill="#37A526"
        />
      </svg>
    </Box>
  );
};

export default BloomLogo;
