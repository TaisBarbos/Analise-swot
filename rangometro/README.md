# Rangômetro

## Apresentação do projeto

O Rangômetro é um aplicativo mobile criado para que os estudantes avaliem os produtos vendidos na cantina escolar. A proposta é transformar a opinião dos alunos em informações organizadas, ajudando a identificar os produtos mais bem avaliados e orientar futuras escolhas do cardápio.

## Problema e solução

Os alunos nem sempre têm uma forma rápida e organizada de registrar sua opinião sobre os lanches. O aplicativo resolve esse problema com uma interface simples: o estudante escolhe um produto, atribui uma nota de 1 a 5 estrelas e pode escrever um comentário.

## Funcionalidades

- Exibição do cardápio com nome, categoria, preço, descrição e imagem.
- Avaliação dos produtos com notas de 1 a 5 estrelas.
- Campo opcional para comentários.
- Cálculo da média das avaliações.
- Filtros por categoria: lanches, assados e bebidas.
- Identificação visual do produto mais popular da semana.
- Histórico de comentários por produto.
- Armazenamento local das avaliações, sem depender de um servidor.
- Feedback tátil ao selecionar uma nota no celular.
- QR Code para abrir o projeto no Expo Go.

## Tecnologias utilizadas

- Expo SDK 57
- React Native
- JavaScript
- Expo Router para navegação entre telas
- AsyncStorage para persistência local
- Expo Haptics para feedback tátil

## Organização das telas

- `app/index.js`: tela principal com cardápio, filtros, médias e produto popular.
- `app/avaliar.js`: tela para registrar nota e comentário.
- `app/comentarios.js`: histórico de comentários do produto selecionado.
- `app/_layout.js`: configuração da navegação do aplicativo.
- `data/menuData.js`: dados iniciais dos produtos.

## Como executar

Dentro desta pasta, instale as dependências e inicie o Expo:

```bash
npm install
npx expo start
```

Para testar no celular, instale o aplicativo **Expo Go**, conecte o celular e o computador à mesma rede Wi-Fi e escaneie o QR Code exibido pelo Expo.

Também é possível validar a versão web com:

```bash
npx expo export --platform web
```

## Roteiro de demonstração

1. Abrir o aplicativo e apresentar o cardápio inicial.
2. Usar os filtros para mostrar produtos de categorias diferentes.
3. Destacar o selo **Mais Popular da Semana**.
4. Abrir um produto e selecionar uma nota de 1 a 5 estrelas.
5. Escrever um comentário e confirmar a avaliação.
6. Voltar ao cardápio e mostrar a média atualizada.
7. Abrir o histórico de comentários do produto.
8. Fechar e abrir novamente o app para demonstrar que os dados continuam salvos.

## QR Code

O QR Code para teste está disponível em [`qrcode-rangometro.png`](qrcode-rangometro.png). Ele depende do endereço de rede informado pelo Expo no momento em que foi gerado; caso o servidor use outro endereço ou porta, gere um novo QR Code.

## Resultado esperado

Ao final da demonstração, o professor poderá verificar um aplicativo mobile funcional, responsivo e com persistência local, capaz de reunir avaliações dos alunos e apresentar os resultados de forma clara.