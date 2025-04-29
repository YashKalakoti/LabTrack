
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to inventory page by default
  return <Navigate to="/inventory" />;
};

export default Index;
