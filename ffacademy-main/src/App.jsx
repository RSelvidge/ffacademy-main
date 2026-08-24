import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

// Pages shown without the sidebar layout
const NO_LAYOUT_PAGES = new Set(['Onboarding', 'SkillLevel', 'AccountLink', 'Auth']);

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout && !NO_LAYOUT_PAGES.has(currentPageName)
    ? <Layout currentPageName={currentPageName}>{children}</Layout>
    : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, authError, isAuthenticated, navigateToLogin } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError?.type === 'backend_not_configured') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-yellow-100">
        <div className="max-w-lg bg-white border-2 border-black shadow-[6px_6px_0px_#000] p-6">
          <h1 className="text-2xl font-black uppercase mb-3">Backend not configured</h1>
          <p className="font-bold mb-2">{authError.message}</p>
          <p className="text-sm">
            Deploy the AWS backend (see the <code>aws/</code> folder README), then set the
            environment variables and rebuild. See the repository README for full instructions.
          </p>
        </div>
      </div>
    );
  }

  // The login page is reachable without an account
  if (!isAuthenticated && location.hash.replace('#/', '') !== 'Auth') {
    navigateToLogin();
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
