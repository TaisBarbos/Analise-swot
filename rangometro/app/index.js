import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { CARDAPIO_INICIAL } from '../data/menuData';

const STORAGE_KEY = '@rangometro_cardapio_v1';
const filtros = ['Todos', 'Lanches', 'Assados', 'Bebidas'];

export default function TelaCardapio() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [categoriaAtual, setCategoriaAtual] = useState('Todos');
  const router = useRouter();

  const carregarDados = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY);
      if (dadosSalvos !== null) {
        setItens(JSON.parse(dadosSalvos));
      } else {
        setItens(CARDAPIO_INICIAL);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(CARDAPIO_INICIAL));
      }
    } catch (error) {
      console.error('Erro ao ler cardápio:', error);
      setItens(CARDAPIO_INICIAL);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const calcularMedia = (soma, total) => {
    if (!total || total === 0) return 'Novo';
    return (soma / total).toFixed(1);
  };

  const itensFiltrados =
    categoriaAtual === 'Todos'
      ? itens
      : itens.filter((item) => item.categoria === categoriaAtual);

  const maisVotado =
    itens.length > 0
      ? itens.reduce((maior, item) => (item.totalVotos > maior.totalVotos ? item : maior), itens[0])
      : null;

  const mediaGeral =
    itens.length > 0
      ? (itens.reduce((total, item) => total + item.somaNotas, 0) /
          itens.reduce((total, item) => total + item.totalVotos, 0)).toFixed(1)
      : '0.0';

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.textoCarregando}>Carregando pratos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Cantina do campus</Text>
          <Text style={styles.heroTitle}>Hoje no rangômetro</Text>

          <View style={styles.heroStats}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Itens</Text>
              <Text style={styles.statValue}>{itens.length}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Média</Text>
              <Text style={styles.statValue}>{mediaGeral}</Text>
            </View>
          </View>
        </View>

        <View style={styles.filterContainer}>
          {filtros.map((filtro) => (
            <TouchableOpacity
              key={filtro}
              style={[styles.filterChip, categoriaAtual === filtro && styles.filterChipActive]}
              onPress={() => setCategoriaAtual(filtro)}
            >
              <Text style={[styles.filterText, categoriaAtual === filtro && styles.filterTextActive]}>
                {filtro}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={itensFiltrados}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => {
            const media = calcularMedia(item.somaNotas, item.totalVotos);
            const popular = maisVotado && item.id === maisVotado.id;

            return (
              <View style={styles.card}>
                {popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Mais Popular da Semana</Text>
                  </View>
                )}

                <Image source={{ uri: item.imagem }} style={styles.imagem} resizeMode="cover" />

                <View style={styles.conteudo}>
                  <View style={styles.cabecalhoCard}>
                    <View style={styles.tituloContainer}>
                      <Text style={styles.categoria}>{item.categoria}</Text>
                      <Text style={styles.titulo}>{item.nome}</Text>
                    </View>
                    <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
                  </View>

                  <Text style={styles.descricao} numberOfLines={2}>
                    {item.descricao}
                  </Text>

                  <View style={styles.rodapeCard}>
                    <Text style={styles.badgeNota}>
                      ⭐ {media} ({item.totalVotos} avaliações)
                    </Text>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.botaoComentarios}
                        onPress={() =>
                          router.push({
                            pathname: '/comentarios',
                            params: { id: item.id, nome: item.nome },
                          })
                        }
                      >
                        <Text style={styles.textoBotaoComentarios}>Comentários</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.botaoAvaliar}
                        onPress={() =>
                          router.push({
                            pathname: '/avaliar',
                            params: { id: item.id, nome: item.nome },
                          })
                        }
                      >
                        <Text style={styles.textoBotao}>Avaliar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  scrollContent: { paddingBottom: 24 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  textoCarregando: { marginTop: 12, color: '#4b5563', fontSize: 16 },
  hero: {
    backgroundColor: '#fff7ed',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 18,
    marginBottom: 16,
  },
  kicker: { fontSize: 12, color: '#f97316', fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#1f2937', marginTop: 8 },
  heroStats: { flexDirection: 'row', gap: 12, marginTop: 18 },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  statLabel: { fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#111827', marginTop: 4 },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  filterChipActive: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  filterText: { fontSize: 13, color: '#374151', fontWeight: '700' },
  filterTextActive: { color: '#ffffff' },
  lista: { padding: 16, paddingTop: 8 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#dc2626',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  popularText: { color: '#fff', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  imagem: { width: '100%', height: 180 },
  conteudo: { padding: 14 },
  cabecalhoCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tituloContainer: { flex: 1, marginRight: 12 },
  categoria: { fontSize: 11, color: '#f97316', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginTop: 2 },
  preco: { fontSize: 16, fontWeight: '800', color: '#16a34a' },
  descricao: { color: '#6b7280', fontSize: 13, marginVertical: 10, lineHeight: 18 },
  rodapeCard: { flexDirection: 'column', alignItems: 'flex-start', marginTop: 4 },
  badgeNota: { fontSize: 13, fontWeight: '700', color: '#d97706' },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
  botaoComentarios: {
    flex: 1,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fdba74',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  botaoAvaliar: {
    flex: 1,
    backgroundColor: '#f97316',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoComentarios: { color: '#9a4f0d', fontWeight: '700', fontSize: 13 },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
