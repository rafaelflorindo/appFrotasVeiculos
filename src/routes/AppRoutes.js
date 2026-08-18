import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Componentes
import ListarVeiculos from '../componentes/ListarVeiculos';
import CadastrarVeiculo from '../componentes/CadastrarVeiculo';
// Futuro componente de Edição:
// import EditarVeiculo from '../componentes/EditarVeiculo'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Navegação de Abas (Bottom Tabs)
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
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
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

// 2. Stack Navigation Principal (Abas + Telas de Ação)
export default function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* As Abas Principais ficam na base da pilha */}
      <Stack.Screen name="MainTabs" component={TabRoutes} />
      
      {/* 
        Telas Nativas da Stack (Empilhadas por cima das abas):
        
        <Stack.Screen name="EditarVeiculo" component={EditarVeiculo} /> 
      */}
    </Stack.Navigator>
  );
}