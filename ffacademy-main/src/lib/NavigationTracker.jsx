import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Base44 app-logging is gone; this now only syncs document.title with the route.
export default function NavigationTracker() {
    const location = useLocation();

    useEffect(() => {
        const pageName = location.pathname.replace(/^\//, '') || 'Gridiron Guru';
        document.title = `Gridiron Guru${pageName && pageName !== 'Gridiron Guru' ? ` - ${pageName}` : ''}`;
    }, [location]);

    return null;
}
