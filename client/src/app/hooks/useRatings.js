import { getRatings } from "app/redux/slices/ratingSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useRatings = () => {
  const dispatch = useDispatch();
  const { error, ratings, loading } = useSelector((state) => state.ratings);

  useEffect(() => {
    dispatch(getRatings());
  }, [dispatch]);

  return {
    ratings,
    isError: error,
    isLoading: loading,
  };
};

export default useRatings;
