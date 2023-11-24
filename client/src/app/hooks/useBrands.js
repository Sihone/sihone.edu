import { getBrands } from "app/redux/slices/brandSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useBrands = () => {
  const dispatch = useDispatch();
  const { error, brands, loading } = useSelector((state) => state.brands);

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  return {
    brands,
    isError: error,
    isLoading: loading,
  };
};

export default useBrands;
