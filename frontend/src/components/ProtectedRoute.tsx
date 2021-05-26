import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { RootState } from 'store';
// import Layout from '../app/Layout';

function ProtectedRoute({ component: Component, ...rest }: any): JSX.Element {
  const { isLoggedIn } = useSelector((state: RootState) => state.users);

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

export default ProtectedRoute;
