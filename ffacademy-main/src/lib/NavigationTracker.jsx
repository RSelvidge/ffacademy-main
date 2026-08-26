import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Base44 app-logging is gone; this now only syncs document.title with the route.
export default function NavigationTracker() {
    const location = useLocation();

    useEffect(() => {
        const pageName = location.pathname.replace(/^\//, '') || 'FFAcademy';
        document.title = `FFAcademy${pageName && pageName !== 'FFAcademy' ? ` - ${pageName}` : ''}`;
    }, [location]);

    return null;
}
