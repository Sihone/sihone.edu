// import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { Auth0Client } from "@auth0/auth0-spa-js";
import { MatxLoading } from "app/components";
import { auth0Config } from "config";
import { createContext, useEffect, useReducer } from "react";

let auth0Client = null;

const initialAuthState = {
  user: null,
  isInitialised: false,
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialised: true, user };
    }

    case "LOGIN": {
      const { user } = action.payload;
      return { ...state, isAuthenticated: true, user };
    }

    case "LOGOUT": {
      return { ...state, isAuthenticated: false, user: null };
    }

    default: {
      return state;
    }
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  method: "AUTH0",
  logout: () => {},
  loginWithPopup: () => Promise.resolve(),
  loginWithRedirect: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const loginWithPopup = async (options) => {
    await auth0Client.loginWithPopup(options);

    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0Client.getUser();

      dispatch({
        type: "LOGIN",
        payload: {
          user: { id: user.sub, name: user.name, email: user.email, avatar: user.picture },
        },
      });
    }
  };

  const logout = (options) => {
    auth0Client.logout(options);
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    (async () => {
      try {
        auth0Client = new Auth0Client({
          redirect_uri: window.location.origin,
          ...auth0Config,
        });

        await auth0Client.checkSession();

        const isAuthenticated = await auth0Client.isAuthenticated();

        if (isAuthenticated) {
          const user = await auth0Client.getUser();
          const { sub, name, email, picture } = user;

          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated,
              user: { name, email, id: sub, avatar: picture },
            },
          });
        }

        dispatch({
          type: "INIT",
          payload: { isAuthenticated, user: null },
        });
      } catch (err) {
        dispatch({
          type: "INIT",
          payload: { isAuthenticated: false, user: null },
        });
      }
    })();
  }, []);

  if (!state.isInitialised) {
    return <MatxLoading />;
  }

  return (
    <AuthContext.Provider value={{ ...state, method: "AUTH0", loginWithPopup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
