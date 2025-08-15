import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute({ children }) {
  const { userInfo } = useSelector((state) => state.user);
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />;
}