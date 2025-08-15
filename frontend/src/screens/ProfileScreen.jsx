import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { updateProfile, resetUpdateStatus } from '../redux/userSlice';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo, updateStatus, updateError } = useSelector((state) => state.user);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
      return;
    }
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo, navigate]);

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      toast.success('User updated successfully');
      setPassword('');
      setConfirmPassword('');
      dispatch(resetUpdateStatus());
    } else if (updateStatus === 'failed' && updateError) {
      toast.error(updateError);
      dispatch(resetUpdateStatus());
    }
  }, [updateStatus, updateError, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    dispatch(updateProfile({ name, email, password }));
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button 
            type="submit" 
            disabled={updateStatus === 'loading'}
          >
            {updateStatus === 'loading' ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </div>
  );
}