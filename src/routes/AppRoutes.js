import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';


import ListarVeiculos from '../componentes/ListarVeiculos';
import CadastrarVeiculo from '../componentes/CadastrarVeiculo';

import EditarVeiculo from '../componentes/EditarVeiculo'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          height: 90,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
        name="ListarVeiculosTab"
        component={ListarVeiculos}
        options={{
          tabBarLabel: 'Veículos',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🚗</Text>,
        }}
      />
      <Tab.Screen
        name="CadastrarVeiculoTab"
        component={CadastrarVeiculo}
        options={{
          tabBarLabel: 'Novo Veículo',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>➕</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="MainTabs" component={TabRoutes} />
      <Stack.Screen name="EditarVeiculo" component={EditarVeiculo} />
      
    </Stack.Navigator>
  );
}