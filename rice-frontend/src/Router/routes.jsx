import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/RootLayout';
import HomePage from '../components/HomePage';
import AddItem from '../components/AddItem';
import CategoryPage from '../components/CategoryPage';
import UserProfile from '../components/UserProfile';
import OrderPage from '../components/Order';
import Cart from '../components/CartPage'; // Import Cart component

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'add-item',
                element: <AddItem />,
            },
            {
                path: 'categories',
                element: <CategoryPage />,
            },
            {
                path: 'user',
                element: <UserProfile />,
            },
            {
                path: 'orders',
                element: <OrderPage />,
            },
            {
                path: 'cart', // Add Cart route
                element: <Cart />,
            },
        ],
    },
]);

export default router;