import { getNotification } from "app/redux/slices/notificationSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useNotification = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getNotification());
  }, [dispatch]);

  return { notifications };
};

export default useNotification;
