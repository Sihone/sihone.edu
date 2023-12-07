import Loadable from "app/components/Loadable";
import React, { lazy } from "react";

const InvoiceList = Loadable(lazy(() => import("./InvoiceListV2")));
const InvoiceDetails = Loadable(lazy(() => import("./InvoiceDetails")));
const InvoiceList2 = Loadable(lazy(() => import("./InvoiceList")));

const invoiceRoutes = [
  { path: "/tuition/list", element: <InvoiceList /> },
  { path: "/tuition/:id", element: <InvoiceDetails /> },
  { path: "/tuition/edit/:id", element: <InvoiceList2 /> },
];

export default invoiceRoutes;
