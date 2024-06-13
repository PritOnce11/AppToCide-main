import React from 'react';
import StartPage from '../pages/StartPage';
import LogRegPage from '../pages/LogRegPage';
import LoginPage from '../pages/LoginPage';
import ResetPassword from '../pages/ResetPassword';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterPage from '../pages/RegisterPage';
import MenuPage from '../pages/MenuPage';
import FacturasPage from '../pages/FacturasPage';
import PefilPage from '../pages/PerfilPage';
import ServiciosPage from '../pages/ServiciosPage';
import MaterialPage from '../pages/MaterialPage';
import CarritoPage from '../pages/CarritoPage';
import MenuAdmin from '../pages_admin/MenuAdmin';
import AlumnosAdmin from '../pages_admin/AlumnosAdmin';
import Validar from '../pages_admin/Validar';
import CarritoServPage from '../pages/CarritoServPage';
import AddStudent from '../pages/AddStudent';
const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
    <Stack.Navigator initialRouteName='StartPage'>
        <Stack.Screen 
            name="StartPage" 
            component={StartPage}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="LogRegPage" 
            component={LogRegPage} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="LoginPage" 
            component={LoginPage} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="ResetPassword" 
            component={ResetPassword} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="RegisterPage" 
            component={RegisterPage} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="MenuPage" 
            component={MenuPage} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="FacturasPage" 
            component={FacturasPage} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="PerfilPage" 
            component={PefilPage} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="ServiciosPage" 
            component={ServiciosPage} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="MaterialPage" 
            component={MaterialPage} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="CarritoPage" 
            component={CarritoPage} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="CarritoPageServ" 
            component={CarritoServPage} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="MenuAdmin" 
            component={MenuAdmin} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="AlumnosAdmin" 
            component={AlumnosAdmin} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="Validar" 
            component={Validar} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="AddStudent" 
            component={AddStudent} 
            options={{ headerShown: false }} 
        />
        
        {/* Agrega más pantallas según sea necesario */}
    </Stack.Navigator>
</NavigationContainer>
    );
}
