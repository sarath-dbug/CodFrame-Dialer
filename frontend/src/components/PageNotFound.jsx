import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Button,
  Typography,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PageNotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        backgroundColor: theme.palette.grey[200]
      }}
    >
      <Box
        sx={{
          maxWidth: 700,
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}
      >
        {/* 404 Number */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '6rem', sm: '8rem' },
            fontWeight: 'bold',
            color: 'primary.main',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.6 },
              '100%': { opacity: 1 }
            }
          }}
        >
          404
        </Typography>

        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem' },
            fontWeight: 'fontWeightBold',
            color: 'text.primary'
          }}
        >
          Page Not Found
        </Typography>

        {/* Illustration Image */}
        <Box
          component="img"
          src="https://cdn.dribbble.com/users/1175431/screenshots/6188233/404-error-dribbble-800x600.gif"
          alt="404 Illustration"
          sx={{
            mx: 'auto',
            height: { xs: 192, sm: 256 },
            width: '100%',
            objectFit: 'contain'
          }}
        />

        {/* Message */}
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', sm: '1.25rem' },
            color: 'text.secondary'
          }}
        >
          The page you're looking for has disappeared into the digital void.
        </Typography>

        {/* Back to Home Button */}
        <Button
          onClick={() => navigate('/app/dashboard')}
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          sx={{
            px: { xs: 3, sm: 4 },
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            mx: 'auto',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          Return to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default PageNotFound;