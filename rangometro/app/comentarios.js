import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

const STORAGE_KEY = '@rangometro_cardapio_v1';

export default function TelaComentarios() {
  const { id, nome } = useLocalSearchParams();
  const [comentarios, setComentarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarComentarios = async () => {
      try {
        const dadosAtuais = await AsyncStorage.getItem(STORAGE_KEY);
        if (!dadosAtuais) {
          setComentarios([]);
          return;
        }

        const cardapio = JSON.parse(dadosAtuais);
        const itemAtual = cardapio.find((item) => item.id === id);
        setComentarios(itemAtual?.comentarios ?? []);
      } catch (error) {
        console.error('Erro ao carregar comentários:', error);
        setComentarios([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarComentarios();
  }, [id]);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.textoCarregando}>Carregando comentários...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitulo}>Histórico de comentários</Text>
        <Text style={styles.nomeItem}>{nome}</Text>
      </View>

      {comentarios.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Ainda não há comentários para este prato.</Text>
        </View>
      ) : (
        <FlatList
          data={comentarios}
          keyExtractor={(comentario, index) => `${comentario}-${index}`}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <View style={styles.commentCard}>
              <Text style={styles.commentNumber}># {index + 1}</Text>
              <Text style={styles.commentText}>“{item}”</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 18 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  textoCarregando: { marginTop: 12, color: '#4b5563', fontSize: 16 },
  header: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#fcd7b5',
    marginBottom: 16,
  },
  subtitulo: { color: '#f97316', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  nomeItem: { fontSize: 24, fontWeight: '800', color: '#111827', marginTop: 6 },
  list: { paddingBottom: 20 },
  commentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#f97316',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
  },
  commentNumber: { fontSize: 11, color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7 },
  commentText: { marginTop: 8, fontSize: 15, color: '#374151', lineHeight: 22 },
  emptyBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyText: { color: '#6b7280', fontSize: 15, textAlign: 'center' },
});
