import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
} from 'mdb-react-ui-kit';

const ManagerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:2025/api/manager/login', { username, password });
      console.log('Manager login successful:', response.data);

      // Store manager data in local storage or state
      localStorage.setItem('manager', JSON.stringify(response.data.manager));

      // Navigate to Manager Home page
      navigate('/manager/home');
    } catch (err) {
      // Ensure err.response exists to avoid undefined errors
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Error logging in manager:', err);
    }
  };

  return (
    <MDBContainer fluid>
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>
          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
              <h2 className='fw-bold mb-2 text-uppercase'>Login</h2>
              <p className='text-white-50 mb-5'>Please enter your login and password!</p>

              <form onSubmit={handleLogin} style={{ width: '100%' }}>
                <MDBInput
                  wrapperClass='mb-4 mx-5 w-100'
                  labelClass='text-white'
                  label='User Name'
                  id='formControlLg'
                  type='text'
                  size='lg'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <MDBInput
                  wrapperClass='mb-4 mx-5 w-100'
                  labelClass='text-white'
                  label='Password'
                  id='formControlLg'
                  type='password'
                  size='lg'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <p className='small mb-3 pb-lg-2'>
                  <a className='text-white-50' href='#!'>
                    Forgot password?
                  </a>
                </p>
                <MDBBtn outline className='mx-2 px-5' color='white' size='lg' type='submit'>
                  Login
                </MDBBtn>
              </form>

              <div className='d-flex flex-row mt-3 mb-5'>
                <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                  <MDBIcon fab icon='facebook-f' size='lg' />
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                  <MDBIcon fab icon='twitter' size='lg' />
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                  <MDBIcon fab icon='google' size='lg' />
                </MDBBtn>
              </div>

              <div>
                <p className='mb-0'>
                  Don&apos;t have an account?{' '}
                  <a href='#!' className='text-white-50 fw-bold'>
                    Sign Up
                  </a>
                </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ManagerLogin;
