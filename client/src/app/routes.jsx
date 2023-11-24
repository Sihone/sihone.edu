import AuthGuard from "./auth/AuthGuard";
import Redirect from "./auth/Redirect";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import Account from "./views/account";
import calendarRoutes from "./views/calendar/CalendarRoutes";
import chartsRoute from "./views/charts/ChartsRoute";
import chatRoutes from "./views/chat-box/ChatRoutes";
import crudRoute from "./views/CRUD/CrudRoutes";
import dashboardRoutes from "./views/dashboard/DashboardRoutes";
import dragAndDropRoute from "./views/Drag&Drop/DragAndDropRoute";
import ecommerceRoutes from "./views/ecommerce/EcommerceRoutes";
import formsRoutes from "./views/forms/FormsRoutes";
import inboxRoute from "./views/inbox/InboxRoutes";
import invoiceRoutes from "./views/invoice/InvoioceRoutes";
import ListRoute from "./views/list/ListRoute";
import mapRoutes from "./views/map/MapRoutes";
import materialRoutes from "./views/material-kit/MaterialRoutes";
import pageLayoutRoutes from "./views/page-layouts/PageLayoutRoutees";
import pagesRoutes from "./views/pages/pagesRoutes";
import pricingRoutes from "./views/pricing/PricingRoutes";
import scrumBoardRoutes from "./views/scrum-board/ScrumBoardRoutes";
import NotFound from "./views/sessions/NotFound";
import sessionRoutes from "./views/sessions/SessionRoutes";
import todoRoutes from "./views/todo/TodoRoutes";

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...dashboardRoutes,
      ...calendarRoutes,
      ...chartsRoute,
      ...chatRoutes,
      ...crudRoute,
      ...dragAndDropRoute,
      ...ecommerceRoutes,
      ...formsRoutes,
      ...invoiceRoutes,
      ...ListRoute,
      ...mapRoutes,
      ...materialRoutes,
      ...inboxRoute,
      ...pageLayoutRoutes,
      ...pagesRoutes,
      ...pricingRoutes,
      ...scrumBoardRoutes,
      ...todoRoutes,
      { path: "/page-layouts/account", element: <Account /> },
    ],
  },
  ...sessionRoutes,
  { path: "/", element: <Redirect /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
