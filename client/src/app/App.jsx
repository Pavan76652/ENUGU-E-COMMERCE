import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthInitializer } from '../components/auth';
import { store } from '../store';
import { router } from '../routes';

const AppProviders = ({ children }) => (
  <Provider store={store}>
    <HelmetProvider>
      <AuthInitializer>{children}</AuthInitializer>
    </HelmetProvider>
  </Provider>
);

export const App = () => (
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);

export default App;
