import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { checkUserRole } from './auth'; // Import your authentication and role checking function

const ProtectedRoute = ({ component: Component, allowedRole, ...rest }) => {

  
  const isAuthenticated = checkUserRole(allowedRole); // Check if the user has the allowed role

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login' }} />
        )
      }
    />
  );
};

export default ProtectedRoute;