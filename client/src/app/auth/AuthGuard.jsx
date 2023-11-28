import { useAuth } from "app/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

// const userHasPermission = (pathname, user, routes) => {
//   if (!user) {
//     return false;
//   }
//   const matched = routes.find((r) => r.path === pathname);

//   const authenticated =
//     matched && matched.auth && matched.auth.length ? matched.auth.includes(user.role) : true;
//   return authenticated;
// };

const AuthGuard = ({ children }) => {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  // const flatRoutes = flat(routes);

  //   const hasPermission = userHasPermission(pathname, user, routes);
  //   let authenticated = isAuthenticated && hasPermission;

  // // IF YOU NEED ROLE BASED AUTHENTICATION,
  // // UNCOMMENT ABOVE LINES
  // // AND COMMENT OUT BELOW authenticated VARIABLE

  if (isAuthenticated) return <>{children}</>;

  return <Navigate replace to="/session/signin" state={{ from: pathname }} />;
};

export default AuthGuard;
