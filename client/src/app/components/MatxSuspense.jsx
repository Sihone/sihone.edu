import MatxLoading from "app/components/MatxLoading";
import { Suspense } from "react";

const MatxSuspense = ({ children }) => {
  return <Suspense fallback={<MatxLoading />}>{children}</Suspense>;
};

export default MatxSuspense;
