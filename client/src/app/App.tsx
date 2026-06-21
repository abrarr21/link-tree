import { RouterProvider } from 'react-router';
import router from './App.route';
import { AuthProvider } from '../features/auth/context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} /> );
    </AuthProvider>
  );
};

export default App;
