import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

const AvatarButton = React.memo(({ onClick }) => {
  // Hapus console.log jika tidak diperlukan lagi
  return (
    <IconButton
      onClick={onClick}
      sx={{
        p: 0,
        '&:hover': {
          transform: 'scale(1.1)',
          transition: 'all 0.3s ease',
        },
      }}
    >
      <Avatar
        sx={{
          width: 40,
          height: 40,
          boxShadow: '5px 2px 15px 5px rgba(0,0,0,0.8)',
          bgcolor: 'transparent',
          color: '#00C3FE',
          border: '2px solid #00C3FE',
          '&:hover': {
            bgcolor: '#00C3FE',
            color: '#070F2B',
            transform: 'scale(1.1)',
          },
        }}
      >
        <i className="ri-user-3-line" style={{ fontSize: '1.25rem' }} />
      </Avatar>
    </IconButton>
  );
});

// Tambahkan displayName untuk debugging yang lebih baik
AvatarButton.displayName = 'AvatarButton';

// Gunakan React.memo dengan custom comparison function
export default React.memo(AvatarButton, (prevProps, nextProps) => {
  return prevProps.onClick === nextProps.onClick;
});