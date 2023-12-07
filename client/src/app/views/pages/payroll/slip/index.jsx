import { useAuth, getSections } from 'app/hooks/useAuth';
import PaySlip from './PaySlipV2';
import { hasAccess } from 'app/utils/utils';
import NotAuthorized from 'app/views/sessions/NotAuthorized';
import { useTranslation } from 'react-i18next';

const Settings = () => {
    const { user } = useAuth();
    const {t} = useTranslation();
    const sections = getSections(t);
    const access = hasAccess(user.permissions, sections.payroll.id);
    return access ? <PaySlip /> : <NotAuthorized />;
};

export default Settings;