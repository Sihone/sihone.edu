import AuthContext from "app/contexts/JWTAuthContext";
// import AuthContext from "app/contexts/FirebaseAuthContext";
// import AuthContext from "app/contexts/Auth0Context";
import { useContext } from "react";

const useAuth = () => useContext(AuthContext);
const getSections = (t) => ({
    "add_employee": {
        id: "add_employee",
        label: t("settings.permissions.add_employee"),
    },
    "delete_employee": {
        id: "delete_employee",
        label: t("settings.permissions.delete_employee"),
    },
    "attendance": {
        id: "attendance",
        label: t("settings.permissions.attendance"),
    },
    "payroll": {
        id: "payroll",
        label: t("settings.permissions.payroll"),
    },
    "accounting": {
        id: "accounting",
        label: t("settings.permissions.accounting"),
    },
    "students": {
        id: "students",
        label: t("settings.permissions.students"),
    },
    "academics": {
        id: "academics",
        label: t("settings.permissions.academics"),
    },
    "settings": {
        id: "settings",
        label: t("settings.permissions.settings"),
    },
    "reports": {
        id: "reports",
        label: t("settings.permissions.reports"),
    }
});

export {
    useAuth,
    getSections,
};
