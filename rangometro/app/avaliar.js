import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@rangometro_cardapio_v1';

export default function TelaAvaliar() {
  const { id, nome } = useLocalSearchParams();
  const router = useRouter();

  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [comentario, setComentario] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleSelecionarNota = async (valor) => {
    setNotaSelecionada(valor);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Ignora dispositivos sem suporte a haptics
    }
  };

  const salvarAvaliacao = async () => {
    if (notaSelecionada === 0) {
      Alert.alert('Ops!', 'Toque em uma nota de 1 a 5 estrelas antes de confirmar.');
      return;
    }

    setSalvando(true);

    try {
      const dadosAtuais = await AsyncStorage.getItem(STORAGE_KEY);
      if (!dadosAtuais) {
        Alert.alert('Erro', 'Não foi possível localizar o cardápio salvo.');
        return;
      }

      const cardapio = JSON.parse(dadosAtuais);
      const cardapioAtualizado = cardapio.map((item) => {
        if (item.id === id) {
          const comentarioLimpo = comentario.trim();

          return {
            ...item,
            totalVotos: item.totalVotos + 1,
            somaNotas: item.somaNotas + notaSelecionada,
            comentarios: comentarioLimpo
              ? [comentarioLimpo, ...item.comentarios].slice(0, 4)
              : item.comentarios,
          };
        }

        return item;
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cardapioAtualizado));

      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        // Ignora dispositivos sem suporte a haptics
      }

      Alert.alert('Sucesso!', 'Sua avaliação foi registrada!', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar seu voto.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.cardForm}>
          <Text style={styles.subtitulo}>Você está avaliando:</Text>
          <Text style={styles.nomeItem}>{nome}</Text>

          <Text style={styles.rotulo}>Quantas estrelas esse prato merece?</Text>

          <View style={styles.estrelasContainer}>
            {[1, 2, 3, 4, 5].map((estrela) => (
              <TouchableOpacity
                key={estrela}
                style={[
                  styles.estrelaBtn,
                  notaSelecionada >= estrela && styles.estrelaBtnAtiva,
                ]}
                onPress={() => handleSelecionarNota(estrela)}
              >
                <Text style={styles.estrelaTexto}>{notaSelecionada >= estrela ? '★' : '☆'}</Text>
                <Text style={styles.estrelaNumero}>{estrela}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.rotulo}>Comentário rápido (opcional):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: O tempero estava ótimo, mas podia vir mais quente!"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            value={comentario}
            onChangeText={setComentario}
          />

          <TouchableOpacity
            style={styles.botaoComentarios}
            onPress={() =>
              router.push({
                pathname: '/comentarios',
                params: { id, nome },
              })
            }
          >
            <Text style={styles.textoComentarios}>Ver comentários</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoConfirmar, salvando && styles.botaoDesabilitado]}
            onPress={salvarAvaliacao}
            disabled={salvando}
          >
            <Text style={styles.textoConfirmar}>
              {salvando ? 'Gravando voto...' : 'Confirmar Avaliação'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  scroll: { padding: 20 },
  cardForm: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  subtitulo: { fontSize: 13, color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' },
  nomeItem: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginVertical: 8 },
  rotulo: { fontSize: 15, fontWeight: '600', color: '#374151', marginTop: 20, marginBottom: 10 },
  estrelasContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  estrelaBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    width: '18%',
    minHeight: 62,
  },
  estrelaBtnAtiva: { borderColor: '#f59e0b', backgroundColor: '#fef3c7' },
  estrelaTexto: { fontSize: 28, color: '#f59e0b' },
  estrelaNumero: { fontSize: 12, fontWeight: 'bold', color: '#6b7280', marginTop: 2 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    minHeight: 100,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  botaoComentarios: {
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fdba74',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  textoComentarios: { color: '#9a4f0d', fontSize: 15, fontWeight: '700' },
  botaoConfirmar: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  botaoDesabilitado: { backgroundColor: '#9ca3af' },
  textoConfirmar: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
