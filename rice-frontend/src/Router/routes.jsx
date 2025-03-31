// router.js
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/RootLayout';
import HomePage from '../components/HomePage';
import AddItem from '../components/AddItem';
import CategoryPage from '../components/CategoryPage';
import UserProfile from '../components/UserProfile';
import OrderPage from '../components/Order';
import Cart from '../components/CartPage';
import ItemDetailPage from '../components/ItemDetailPage';
import AboutRicePage from '../components/AboutRicePage'; // New import

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
                path: 'cart',
                element: <Cart />,
            },
            {
                path: 'item/:itemId',
                element: <ItemDetailPage />,
            },
            {
                path: 'about-rice', // New route for About Rice page
                element: <AboutRicePage />,
            },
        ],
    },
]);

export default router;