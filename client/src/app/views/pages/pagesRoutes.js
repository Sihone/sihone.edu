import Loadable from "app/components/Loadable";
import { lazy } from "react";

const EmployeeList = Loadable(lazy(() => import("./employees")));
const EmployeeForm = Loadable(lazy(() => import("./employees/customer-form")));

const AttendanceList = Loadable(lazy(() => import("./attendance")));
const Payroll = Loadable(lazy(() => import("./payroll")));
const PaySlip = Loadable(lazy(() => import("./payroll/slip")));
const General = Loadable(lazy(() => import("./settings/General")));
const Roles = Loadable(lazy(() => import("./settings/Roles")));

const YearsCycles = Loadable(lazy(() => import("./academics/YearsCycles")));
const Programs = Loadable(lazy(() => import("./academics/Programs")));
const Courses = Loadable(lazy(() => import("./academics/Courses")));
const Modules = Loadable(lazy(() => import("./academics/Modules")));
const Exams = Loadable(lazy(() => import("./academics/Exams")));
const Transcripts = Loadable(lazy(() => import("./academics/Transcripts")));

const Accounts = Loadable(lazy(() => import("./finance/Accounts")));
const Transactions = Loadable(lazy(() => import("./finance/Transactions")));

const StudentList = Loadable(lazy(() => import("./students")));
const StudentForm = Loadable(lazy(() => import("./students/customer-form")));
const Tuition = Loadable(lazy(() => import("./tuition/InvoiceList")));

const pagesRoutes = [

  { path: "/employees", element: <EmployeeList /> },
  { path: "/employees/:id", element: <EmployeeForm /> },
  { path: "/new-employee", element: <EmployeeForm /> },
  
  { path: "/attendance", element: <AttendanceList />},
  { path: "/payroll/payments", element: <Payroll />},
  { path: "/payroll/payslip", element: <PaySlip />},

  { path: "/years-cycles", element: <YearsCycles />},
  { path: "/programs", element: <Programs />},
  { path: "/courses", element: <Courses />},
  { path: "/modules", element: <Modules />},
  { path: "/exams", element: <Exams />},
  { path: "/transcripts", element: <Transcripts />},
  
  { path: "/settings/general", element: <General />},
  { path: "/settings/roles", element: <Roles />},

  { path: "/accounts", element: <Accounts />},
  { path: "/transactions", element: <Transactions />},

  { path: "/students", element: <StudentList />},
  { path: "/students/:id", element: <StudentForm />},
  { path: "/new-student", element: <StudentForm />},
  { path: "/tuition", element: <Tuition />}
];

export default pagesRoutes;
