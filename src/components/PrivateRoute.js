import React, { useContext } from 'react'
import AuthContext from '../authContext'
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
  const {token} = useContext(AuthContext)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !!token ? (
          children 
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;