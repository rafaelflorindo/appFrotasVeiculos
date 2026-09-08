import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import Home from '../componentes/Home/Home'; 

import ListarVeiculos from '../componentes/Veiculos/ListarVeiculos';
import CadastrarVeiculo from '../componentes/Veiculos/CadastrarVeiculo';
import EditarVeiculo from '../componentes/Veiculos/EditarVeiculo';

import ListarUsuarios from '../componentes/Usuarios/ListarUsuarios';
import CadastrarUsuario from '../componentes/Usuarios/CadastrarUsuario';
import EditarUsuario from '../componentes/Usuarios/EditarUsuario';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabRoutes() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ListarVeiculosTab"
        component={ListarVeiculos}
        options={{
          tabBarLabel: 'Veículos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ListarUsuariosTab"
        component={ListarUsuarios}
        options={{
          tabBarLabel: 'Usuários',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabRoutes} />

      <Stack.Screen name="CadastrarUsuario" component={CadastrarUsuario} />
      <Stack.Screen name="CadastrarVeiculo" component={CadastrarVeiculo} />
   
      <Stack.Screen name="EditarUsuario" component={EditarUsuario} />
      <Stack.Screen name="EditarVeiculo" component={EditarVeiculo} />
    </Stack.Navigator>
  );
}