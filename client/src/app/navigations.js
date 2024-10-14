import { authRoles } from "app/auth/authRoles";
import { useTranslation } from 'react-i18next';
import { useAuth, getSections } from "./hooks/useAuth";
import { hasAccess } from "./utils/utils";

export const useNavigations = () => {
  const {t} = useTranslation();
  const { user } = useAuth();
  const sections = getSections(t);
  const nav = {
    navigations: [
      {
        name: t('main.menu.dashboard'),
        path: "/dashboard/default",
        icon: "dashboard",
        auth: authRoles.sa, // ONLY SUPER ADMIN(SA) CAN ACCESS
      },
      (hasAccess(user.permissions, sections.delete_employee.id) || hasAccess(user.permissions, sections.add_employee.id) || hasAccess(user.permissions, sections.attendance.id)) && {
        name: t('main.menu.employees'),
        icon: "people",
        children: [
          hasAccess(user.permissions, sections.delete_employee.id) && { name: t('main.menu.employees list'), path: "/employees", iconText: "EL" },
          hasAccess(user.permissions, sections.add_employee.id) && { name: t('main.menu.new employee'), path: "/new-employee", iconText: "NE" },
          hasAccess(user.permissions, sections.attendance.id) && { name: t('main.menu.attendance'), path: "/attendance", iconText: "AT" },
        ],
      },
      hasAccess(user.permissions, sections.payroll.id) && {
        name: t('main.menu.payroll'),
        icon: "money",
        path: "/payroll",
        children: [
          { name: t('main.menu.payments'), path: "/payroll/payments", iconText: "PP" },
          { name: t('main.menu.pay slips'), path: "/payroll/payslip", iconText: "PS" },
        ],
      },
      hasAccess(user.permissions, sections.academics.id) && {
        name: t('main.menu.academics'),
        icon: "business",
        children: [
          { name: t('main.menu.academic years'), path: "/years-cycles", iconText: "AY" },
          { name: t('main.menu.programs'), path: "/programs", iconText: "PR"},
          { name: t('main.menu.courses'), path: "/courses", iconText: "CR" },
          { name: t('main.menu.exams'), path: "/exams", iconText: "EX" },
          { name: t('main.menu.grading'), path: "/transcripts", iconText: "GD" },
        ],
      },
      hasAccess(user.permissions, sections.students.id) && {
        name: t('main.menu.students'),
        icon: "school",
        children: [
          { name: t('main.menu.student list'), path: "/students", iconText: "SL" },
          { name: t('main.menu.new student'), path: "/new-student", iconText: "NS" },
          { name: t('main.menu.tuition'), path: "/tuition", iconText: "TF" },
        ],
      },
      hasAccess(user.permissions, sections.accounting.id) && {
        name: t('main.menu.finance'),
        icon: "account_balance",
        children: [
          { name: t('main.menu.accounts'), path: "/accounts", iconText: "AC" },
          { name: t('main.menu.transactions'), path: "/transactions", iconText: "TR" },
        ],
      },
      hasAccess(user.permissions, sections.hardware.id) && {
        name: t('main.menu.hardware'),
        icon: "hardware",
        children: [
          { name: t('main.menu.laptops'), path: "/laptops", iconText: "LT" }
        ],
      },
      (hasAccess(user.permissions, sections.settings.id) || hasAccess(user.permissions, sections.reports.id)) && {
        name: t('main.menu.control panel'),
        icon: "settings",
        children: [
          { name: t('main.menu.settings'), path: "/settings/general", iconText: "ST" },
          { name: t('main.menu.settings roles'), path: "/settings/roles", iconText: "EM" },
          hasAccess(user.permissions, sections.reports.id) && { name: t('main.menu.reports'), path: "/reports", iconText: "RP" },
        ],
      },
      // {
      //   name: "Analytics",
      //   path: "/dashboard/analytics",
      //   icon: "analytics",
      //   auth: authRoles.admin, // ONLY SUPER ADMIN(SA) AND ADMIN CAN ACCESS
      // },
    
      // {
      //   name: "Analytics 2",
      //   path: "/dashboard/analytics-2",
      //   icon: "analytics",
      // },
    
      // {
      //   name: "Alternative",
      //   path: "/dashboard/alternative",
      //   icon: "analytics",
      // },
      // {
      //   name: "Inventory Management",
      //   path: "/dashboard/inventory-management",
      //   icon: "store",
      // },
      // {
      //   name: "Sales",
      //   path: "/dashboard/sales",
      //   icon: "store",
      // },
      // {
      //   name: "Learning Management",
      //   path: "/dashboard/learning-management",
      //   icon: "store",
      // },
    
      // { label: "Pages", type: "label" },
    
      // {
      //   name: "Customers",
      //   icon: "people",
      //   children: [
      //     { name: "Customer List", path: "/customer-list", iconText: "CL" },
      //     { name: "View Customer", path: "/view-customer", iconText: "VC" },
      //     { name: "New Customer", path: "/new-customer", iconText: "NC" },
      //   ],
      // },
      // {
      //   name: "Products",
      //   icon: "shopping_cart",
      //   children: [
      //     { name: "Product List", path: "/product-list", iconText: "PL" },
      //     { name: "View Product", path: "/view-product", iconText: "VP" },
      //     { name: "New Product", path: "/new-product", iconText: "NP" },
      //   ],
      // },
      // {
      //   name: "Orders",
      //   icon: "folder",
      //   children: [
      //     { name: "Order List", path: "/order-list", iconText: "OL" },
      //     { name: "View Order", path: "/invoice/fdskfjdsuoiucrwevbgd", iconText: "VO" },
      //   ],
      // },
      // {
      //   name: "Help Center",
      //   icon: "help",
      //   children: [
      //     { name: "FAQ 1", path: "/faq-1", iconText: "F1" },
      //     { name: "FAQ 2", path: "/faq-2", iconText: "F2" },
      //   ],
      // },
      // {
      //   name: "Pricing",
      //   icon: "money",
    
      //   children: [
      //     { name: "Pricing 1", iconText: "P1", path: "/others/pricing-1" },
      //     { name: "Pricing 2", iconText: "P2", path: "/others/pricing-2" },
      //     { name: "Pricing 3", iconText: "P3", path: "/others/pricing-3" },
      //     { name: "Pricing 4", iconText: "P4", path: "/others/pricing-4" },
      //   ],
      // },
      // {
      //   name: "User List",
      //   icon: "people",
      //   children: [
      //     { name: "User List 1", path: "/user-list-1", iconText: "U1" },
      //     { name: "User List 2", path: "/user-list-2", iconText: "U2" },
      //     { name: "User List 3", path: "/user-list-3", iconText: "U3" },
      //     { name: "User List 4", path: "/user-list-4", iconText: "U3" },
      //   ],
      // },
      // {
      //   name: "Forms",
      //   icon: "description",
    
      //   children: [
      //     { name: "Order Form", path: "/forms/order-form", iconText: "OF" },
      //     { name: "Invoice Form", path: "/forms/invoice-form", iconText: "IF" },
      //     { name: "Property Listing Form", path: "/forms/property-listing-form", iconText: "PF" },
      //     { name: "Basic", path: "/forms/basic", iconText: "B" },
      //     { name: "Upload", path: "/forms/upload", iconText: "U" },
      //     { name: "Wizard", path: "/forms/wizard", iconText: "W" },
      //   ],
      // },
      // {
      //   name: "Matx List",
      //   icon: "list",
    
      //   children: [{ name: "List", path: "/matx-list", iconText: "L" }],
      // },
      // {
      //   name: "Session/Auth",
      //   icon: "security",
      //   children: [
      //     { name: "Sign in", iconText: "SI", path: "/session/signin" },
      //     { name: "Sign up", iconText: "SU", path: "/session/signup" },
      //     { name: "Forgot Password", iconText: "FP", path: "/session/forgot-password" },
      //     { name: "Error", iconText: "404", path: "/session/404" },
      //   ],
      // },
      // { name: "Left Sidebar Card", path: "/page-layouts/Left-sidebar-card", icon: "vertical_split" },
      // { name: "User Profile", path: "/page-layouts/user-profile", icon: "person" },
      // { name: "Account", path: "/page-layouts/account", icon: "manage_accounts" },
    
      // { label: "Apps", type: "label" },
      // {
      //   name: "Ecommerce",
      //   icon: "shopping_basket",
    
      //   children: [
      //     { name: "Shop", path: "/ecommerce/shop", iconText: "S" },
      //     { name: "Cart", path: "/ecommerce/cart", iconText: "C" },
      //     { name: "Checkout", path: "/ecommerce/checkout", iconText: "CO" },
      //   ],
      // },
      // {
      //   name: "Scrum Board",
      //   icon: "group_work",
      //   path: "/scrum-board/c5d7498bbcb84d81fc7454448871ac6a6e",
      // },
      // { name: "Invoice Builder", icon: "receipt", path: "/invoice/list" },
      // { name: "Calendar", icon: "date_range", path: "/calendar" },
      // { name: "Chat", icon: "chat", path: "/chat" },
      // { name: "Inbox", icon: "inbox", path: "/inbox" },
      // { name: "Todo", icon: "center_focus_strong", path: "/todo/list" },
      // { name: "CRUD Table", icon: "format_list_bulleted", path: "/crud-table" },
    
      // // { label: "Tables", type: "label" },
      // // {
      // //   name: "Data Table",
      // //   icon: "table_view",
    
      // //   children: [
      // //     { name: "Simple Mui Table", path: "/data-table/simple-mui-table", iconText: "T1" },
      // //     { name: "Expandable Mui Table", path: "/data-table/expandable-mui-table", iconText: "T2" },
      // //   ],
      // // },
    
      // { label: "Components", type: "label" },
      // {
      //   name: "Components",
      //   icon: "favorite",
      //   badge: { value: "30+", color: "secondary" },
      //   children: [
      //     { name: "Auto Complete", path: "/material/autocomplete", iconText: "A" },
      //     { name: "Buttons", path: "/material/buttons", iconText: "B" },
      //     { name: "Checkbox", path: "/material/checkbox", iconText: "C" },
      //     { name: "Dialog", path: "/material/dialog", iconText: "D" },
      //     { name: "Drag and Drop", iconText: "D", path: "/others/drag-and-drop" },
      //     { name: "Expansion Panel", path: "/material/expansion-panel", iconText: "E" },
      //     { name: "Form", path: "/material/form", iconText: "F" },
      //     { name: "Icons", path: "/material/icons", iconText: "I" },
      //     { name: "Menu", path: "/material/menu", iconText: "M" },
      //     { name: "Progress", path: "/material/progress", iconText: "P" },
      //     { name: "Radio", path: "/material/radio", iconText: "R" },
      //     { name: "Switch", path: "/material/switch", iconText: "S" },
      //     { name: "Slider", path: "/material/slider", iconText: "S" },
      //     { name: "Snackbar", path: "/material/snackbar", iconText: "S" },
      //     { name: "Table", path: "/material/table", iconText: "T" },
      //   ],
      // },
      // { name: "Map", icon: "add_location", path: "/map" },
    
      // { label: "Charts", type: "label" },
      // {
      //   name: "Charts",
      //   icon: "trending_up",
    
      //   children: [
      //     { name: "Echarts", path: "/charts/echarts", iconText: "E" },
      //     { name: "Recharts", path: "/charts/recharts", iconText: "R" },
      //     { name: "Apex Charts", path: "/charts/apex-charts", iconText: "A" },
      //   ],
      // },
      // {
      //   name: "Documentation",
      //   icon: "launch",
      //   type: "extLink",
      //   path: "http://demos.ui-lib.com/matx-react-doc/",
      // },
    ]
  }
  // remove null, undefined, empty string and false items from array
  nav.navigations = nav.navigations.filter(item => item);
  nav.navigations = nav.navigations.filter(item => {
    item.children = item.children?.filter(child => child);
    return item;
  });
  return nav;
} 
