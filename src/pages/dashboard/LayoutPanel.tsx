// src/components/LayoutPanel.tsx
import { Outlet, useNavigate } from 'react-router-dom';
import { AppProvider, DashboardLayout } from '@toolpad/core';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'; import { Stack } from '@mui/material';
import CollectionsBookmarkTwoToneIcon from '@mui/icons-material/CollectionsBookmarkTwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import SupportAgentTwoToneIcon from '@mui/icons-material/SupportAgentTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone'; import { fetcher } from '../../services/fetcher'; // Ajusta la ruta según tu estructura
import { useAuthVerification } from '../../hooks/useAuthVerification';
import { useState, useEffect } from 'react';

const NAVIGATION = [
    {
        kind: 'header',
        title: 'Panel',
        roles: ['user', 'admin'],
    },
    {
        segment: 'dashboard/home',
        title: 'Home',
        icon: <HomeTwoToneIcon />,
        roles: ['user', 'admin'],
    },
    {
        segment: 'dashboard/biblioteca',
        title: 'Biblioteca',
        icon: <MenuBookTwoToneIcon />,
        roles: ['user', 'admin'],
    },
    {
        segment: 'dashboard/likedBooks',
        title: 'Mis libros',
        icon: <CollectionsBookmarkTwoToneIcon />,
        roles: ['user', 'admin'],
    },
    {
        kind: 'divider',
        roles: ['admin'],
    },
    {
        kind: 'header',
        title: 'Administración',
        roles: ['admin'],
    },
    {
        segment: 'dashboard/admin',
        title: 'Panel Admin',
        icon: <GridViewTwoToneIcon />,
        roles: ['admin'],
    },
    {
        segment: 'dashboard/admin/users',
        title: 'Gestión Usuarios',
        icon: <AdminPanelSettingsTwoToneIcon />,
        roles: ['admin'],
    },
    {
        segment: 'dashboard/admin/reports',
        title: 'Gestión Reportes',
        icon: <CreateNewFolderTwoToneIcon />,
        roles: ['admin'],
    },
    {
        kind: 'divider',
        roles: ['user', 'admin'],
    },
    {
        kind: 'header',
        title: 'Gestión',
        roles: ['user', 'admin'],
    },
    {
        segment: 'dashboard/support',
        title: 'Soporte',
        icon: <SupportAgentTwoToneIcon />,
        roles: ['user',],
    },
    {
        segment: 'logout',
        title: 'Cerrar sesión',
        icon: <LogoutTwoToneIcon />,
        roles: ['user', 'admin'],
    }
]

const LayoutPanel = () => {
    const navigate = useNavigate();
    const authData = useAuthVerification();
    const [navKey, setNavKey] = useState(0);

    // Efecto para re-renderizar cuando cambie el rol del usuario
    useEffect(() => {
        setNavKey(prev => prev + 1);
    }, [authData?.user?.user?.role, authData?.user?.user?.id]);

    // Función para filtrar navegación según el rol del usuario
    const getFilteredNavigation = () => {
        const userRole = authData?.user?.user?.role || 'user';


        const filterNavigationItem = (item: any) => {
            // Verificar si el usuario tiene acceso a este item
            if (!item.roles || !item.roles.includes(userRole.toLowerCase())) {
                return null;
            }

            // Si tiene children, filtrarlos también
            if (item.children) {
                const filteredChildren = item.children
                    .map(filterNavigationItem)
                    .filter(Boolean);

                // Si no hay children válidos, no mostrar el item padre
                if (filteredChildren.length === 0) {
                    return null;
                }

                return { ...item, children: filteredChildren };
            }

            return item;
        };

        return NAVIGATION
            .map(filterNavigationItem)
            .filter(Boolean);
    };

    const handleLogout = async (): Promise<{ success: boolean; message: string }> => {
        try {
            return await fetcher('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Error en logout:', error);
            throw error;
        }
    };
    const handleNavigation = async (path: string) => {

        if (path === '/logout') {
            await handleLogout();
            navigate('/'); // Redirige a la página de inicio después de cerrar sesión
            return;
        }
        navigate(path);
    };

    function CustomAppTitle() {

        return (
            <Stack direction="row" alignItems="center" >
                <img src={'/public/sapiens_2.png'} alt="SAPIENS" style={{ width: '3rem' }} />
                <img src={'/public/sapiens.png'} alt="SAPIENS" style={{ width: '4rem' }} />
            </Stack>
        );
    }

    return (
        <AppProvider
            key={navKey}
            navigation={getFilteredNavigation()}
            router={{
                navigate: handleNavigation
            }}
        >
            <DashboardLayout
                slots={{
                    appTitle: CustomAppTitle,
                }}
            >

                <Outlet />
            </DashboardLayout>
        </AppProvider>
    );
};

export default LayoutPanel;