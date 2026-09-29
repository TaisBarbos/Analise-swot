import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#f97316' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: '#f3f4f6' },
      }}
    >
      <Stack.Screen name="index" options={{ title: '🍔 Rangômetro SENAC' }} />
      <Stack.Screen name="avaliar" options={{ title: 'Deixar sua avaliação' }} />
      <Stack.Screen name="comentarios" options={{ title: 'Histórico de comentários' }} />
    </Stack>
  );
}
