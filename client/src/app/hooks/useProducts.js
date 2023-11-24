import { getProducts } from "app/redux/slices/productSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useProducts = () => {
  const dispatch = useDispatch();
  const { error, products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return {
    products,
    isError: error,
    isLoading: loading,
  };
};

export default useProducts;
