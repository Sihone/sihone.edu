import { getUsers } from "app/redux/slices/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useUsers = () => {
  const dispatch = useDispatch();
  const { error, users, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return {
    users,
    isError: error,
    isLoading: loading,
  };
};

export default useUsers;
