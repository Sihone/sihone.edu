import { useAuth, getSections } from 'app/hooks/useAuth';
import EmployeeList from './EmployeeListV2';
import { hasAccess } from 'app/utils/utils';
import NotAuthorized from 'app/views/sessions/NotAuthorized';
import { useTranslation } from 'react-i18next';

const Settings = () => {
    const { user } = useAuth();
    const {t} = useTranslation();
    const sections = getSections(t);
    const access = hasAccess(user.permissions, sections.add_employee.id);
    return access ? <EmployeeList /> : <NotAuthorized />;
};

export default Settings;