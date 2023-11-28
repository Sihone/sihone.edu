import Loadable from "app/components/Loadable";
import { lazy } from "react";

const Faq1 = Loadable(lazy(() => import("./faq/Faq1")));
const Faq2 = Loadable(lazy(() => import("./faq/Faq2")));
const OrderList = Loadable(lazy(() => import("./orders/OrderList")));
const UserList1 = Loadable(lazy(() => import("./user-list/UserList1")));
const UserList2 = Loadable(lazy(() => import("./user-list/UserList2")));
const UserList3 = Loadable(lazy(() => import("./user-list/UserList3")));
const UserList4 = Loadable(lazy(() => import("./user-list/UserList4")));
const ProductList = Loadable(lazy(() => import("./products/ProductList")));
const ProductForm = Loadable(lazy(() => import("./products/ProductForm")));
const CustomerList = Loadable(lazy(() => import("./customers/CustomerList")));
const ProductViewer = Loadable(lazy(() => import("./products/ProductViewer")));
const CustomerForm = Loadable(lazy(() => import("./customers/customer-form/CustomerForm")));
const CustomerViewer = Loadable(lazy(() => import("./customers/customer-viewer/CustomerViewer")));

const EmployeeList = Loadable(lazy(() => import("./employees/EmployeeList")));
const EmployeeForm = Loadable(lazy(() => import("./employees/customer-form/CustomerForm")));

const AttendanceList = Loadable(lazy(() => import("./attendance/AttendanceList")));
const Payroll = Loadable(lazy(() => import("./payroll/Payroll")));
const PaySlip = Loadable(lazy(() => import("./payroll/PaySlip")));
const General = Loadable(lazy(() => import("./settings/General")));

const pagesRoutes = [
  { path: "/user-list-1", element: <UserList1 /> },
  { path: "/user-list-2", element: <UserList2 /> },
  { path: "/user-list-3", element: <UserList3 /> },
  { path: "/user-list-4", element: <UserList4 /> },
  { path: "/faq-1", element: <Faq1 /> },
  { path: "/faq-2", element: <Faq2 /> },
  { path: "/customer-list", element: <CustomerList /> },
  { path: "/new-customer", element: <CustomerForm /> },
  { path: "/view-customer", element: <CustomerViewer /> },
  { path: "/product-list", element: <ProductList /> },
  { path: "/new-product", element: <ProductForm /> },
  { path: "/view-product", element: <ProductViewer /> },
  { path: "/order-list", element: <OrderList /> },

  { path: "/employees", element: <EmployeeList /> },
  { path: "/employees/:id", element: <EmployeeForm /> },
  { path: "/new-employee", element: <EmployeeForm /> },
  
  { path: "/attendance", element: <AttendanceList />},
  { path: "/payroll/payments", element: <Payroll />},
  { path: "/payroll/payslip", element: <PaySlip />},
  
  { path: "/settings/general", element: <General />},
];

export default pagesRoutes;
