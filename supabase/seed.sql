-- Seed 20 chat rooms
INSERT INTO rooms (name, slug, description, icon) VALUES
  ('Geral', 'general', 'Conversas gerais e bate-papo', '💬'),
  ('Aleatório', 'random', 'Qualquer coisa fora do tópico', '🎲'),
  ('Jogos', 'games', 'Video games, board games e mais', '🎮'),
  ('Música', 'music', 'Compartilhe músicas e descubra novas', '🎵'),
  ('Filmes', 'movies', 'Discussões sobre filmes e séries', '🎬'),
  ('Tecnologia', 'tech', 'Tech news, gadgets e programação', '💻'),
  ('Esportes', 'sports', 'Futebol, basquete e todos os esportes', '⚽'),
  ('Memes', 'memes', 'Os melhores memes da internet', '😂'),
  ('Notícias', 'news', 'Notícias e atualidades', '📰'),
  ('Programação', 'coding', 'Código, devs e projetos', '👨‍💻'),
  ('Anime', 'anime', 'Animes, mangás e cultura otaku', '🍥'),
  ('Arte', 'art', 'Arte digital, tradicional e críticas', '🎨'),
  ('Comida', 'food', 'Receitas, restaurantes e gastronomia', '🍕'),
  ('Viagem', 'travel', 'Destinos, dicas e experiências', '✈️'),
  ('Cripto', 'crypto', 'Bitcoin, NFTs e web3', '🪙'),
  ('Ciência', 'science', 'Descobertas científicas e curiosidades', '🔬'),
  ('Livros', 'books', 'Clube do livro e recomendações', '📚'),
  ('Moda', 'fashion', 'Tendências, estilo e looks', '👗'),
  ('Pets', 'pets', 'Seus animais de estimação', '🐶'),
  ('Estudos', 'study', 'Material de estudo e dicas de aprendizado', '📖');

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Rooms policies
CREATE POLICY "Rooms are viewable by authenticated users"
  ON rooms FOR SELECT
  TO authenticated
  USING (true);

-- Messages policies
CREATE POLICY "Messages are viewable by authenticated users"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
