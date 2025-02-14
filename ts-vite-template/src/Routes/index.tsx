import { createBrowserRouter } from 'react-router-dom';
import Home from './Home';
import { ErrorBoundary } from '@/components/Layout/ErrorBoundary';
import RootLayout from '@/components/Layout/RootLayout';
import Signup from './Signup';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary/>,
    children: [
      {
        path: '',
        element: <Home/>,
      },
     {
        path: 'signup',
        element: <Signup/>,
      },
    ],
  },
]);

export default routes;
