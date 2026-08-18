import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppRoutes from './src/routes/AppRoutes';

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
        
        {/* Cabeçalho Fixo do App */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AutoGestão</Text>
          <Text style={styles.headerSubtitle}>Sistema de Frota</Text>
        </View>

        {/* Gerenciador de Rotas */}
        <View style={styles.content}>
          <AppRoutes />
        </View>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: (StatusBar.currentHeight || 0) + 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
});