import { useAuth, getSections } from 'app/hooks/useAuth';
import Laptops from './Laptops';
import { hasAccess } from 'app/utils/utils';
import NotAuthorized from 'app/views/sessions/NotAuthorized';
import { useTranslation } from 'react-i18next';

const Hardware = () => {
    const { user } = useAuth();
    const {t} = useTranslation();
    const sections = getSections(t);
    const access = hasAccess(user.permissions, sections.hardware.id);
    return access ? <Laptops /> : <NotAuthorized />;
};

export default Hardware;
