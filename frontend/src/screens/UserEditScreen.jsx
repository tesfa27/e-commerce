import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { fetchUser, updateUser } from '../redux/userEditSlice';

export default function UserEditScreen() {
  const { id: userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, loadingUpdate } = useSelector((state) => state.userEdit);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const userData = { name, email, isAdmin };
      await dispatch(updateUser({ userId, userData })).unwrap();
      toast.success('User updated successfully');
      navigate('/admin/users');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit User {userId}</title>
      </Helmet>
      <h1>Edit User {userId}</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Check
            className="mb-3"
            type="checkbox"
            label="Is Admin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <Button type="submit" disabled={loadingUpdate}>
            {loadingUpdate ? 'Updating...' : 'Update'}
          </Button>
          {loadingUpdate && <LoadingBox />}
        </Form>
      )}
    </Container>
  );
}