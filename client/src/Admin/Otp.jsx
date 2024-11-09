import React, { useState } from 'react';
import axios from 'axios';
// import { useHistory } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';


const defaultTheme = createTheme();

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  // Track authentication status
  // const history = useHistory(); // React Router's history object
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send username and password to server to request OTP
      const response = await axios.post('http://localhost:8000/api/requestOTP', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        // OTP requested successfully, show OTP input field
        setOtpSent(true);
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Error occurred during login');
      console.error('Error occurred during login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send OTP to server for verification
      const response = await axios.post('http://localhost:8000/api/verifyOTP', {
        username,
        otp
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        window.localStorage.setItem('userId', response.data.user.id)
        navigate("/adminhome")
      } else {
        setError('Invalid OTP');
      }
    } catch (error) {
      setError('Error occurred during OTP verification');
      console.error('Error occurred during OTP verification:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {loading && <Loader />}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Admin Sign In
          </Typography>
          {!otpSent ? (
            // If OTP not sent, display username and password fields
            <Box
              component="form"
              onSubmit={handleLogin}
              noValidate
              sx={{
                mt: 1,
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                }}
              >
                Login
              </Button>
            </Box>
          ) : (
            // If OTP sent, display OTP input field
            <Box
              component="form"
              onSubmit={handleOTPSubmit}
              noValidate
              sx={{
                mt: 1,
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="One-Time Password (OTP)"
                name="otp"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                }}
              >
                Verify OTP
              </Button>
            </Box>
          )}
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Box>
      </Container>

    </ThemeProvider>

  );
}
