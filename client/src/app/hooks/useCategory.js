import { getCategories } from "app/redux/slices/categorySlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useCategory = () => {
  const dispatch = useDispatch();
  const { error, categories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return {
    categories,
    isError: error,
    isLoading: loading,
  };
};

export default useCategory;
