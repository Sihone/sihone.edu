import { useAuth, getSections } from 'app/hooks/useAuth';
import Exams from './ExamsV2';
import { hasAccess } from 'app/utils/utils';
import NotAuthorized from 'app/views/sessions/NotAuthorized';
import { useTranslation } from 'react-i18next';

const Settings = () => {
    const { user } = useAuth();
    const {t} = useTranslation();
    const sections = getSections(t);
    const access = hasAccess(user.permissions, sections.academics.id);
    return access ? <Exams /> : <NotAuthorized />;
};

export default Settings;