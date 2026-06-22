# 🍕 LaBella Pizza — Pizzaria do Freddy Fazbear

Bem-vindo ao repositório da **LaBella Pizza**, um website moderno, premium e interativo para uma pizzaria de tradição familiar italiana (fundada em 1987), integrado com inteligência artificial e banco de dados Supabase.

---

## 🌟 Funcionalidades Principais

1. **Cardápio Dinâmico (Supabase)**:
   - Os pratos (pizzas e bebidas) são carregados em tempo real diretamente da tabela `produtos` no Supabase.
   - Atribuição automática de imagens em alta definição (Unsplash) e tags temáticas de acordo com os produtos cadastrados.
   
2. **Novos Sabores ("Em breve")**:
   - Layout elegante em 3 colunas com bordas tracejadas e design discreto exatamente como especificado no mockup.

3. **Sistema de Autenticação Direto no Banco**:
   - Tela de Login e Cadastro conectadas diretamente à tabela pública `usuarios` (utilizando apenas `email` e `senha`).
   - Persistência de sessão no navegador (`localStorage`) para que a conta continue conectada mesmo após dar F5 (refresh).
   - Credencial de testes local integrada (`dimitri_24479` / `123456`).

4. **Chatbot Inteligente (Gemini AI)**:
   - Assistente virtual integrado (Chef Pizzaiolo Italiano) com personalidade marcante (grosso e mal-humorado) que responde a dúvidas sobre os pedidos e cardápio.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: React.js, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend / API**: Node.js, Express, `@google/genai` (Gemini 2.5 Flash).
- **Banco de Dados / Infra**: Supabase (PostgREST, Auth e PostgreSQL).

---

## ⚙️ Configuração do Banco de Dados (Supabase)

Para que o cadastro e o login funcionem sem restrições, certifique-se de executar a seguinte query no **SQL Editor** do seu painel do Supabase:

```sql
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
```

### Estrutura das Tabelas

#### Tabela `produtos`
Utilizada para listar o cardápio no frontend.
- `id` (int/uuid)
- `tipo` (text, ex: `'pizza'` ou `'bebida'`)
- `nome` (text)
- `ingredientes` (text)
- `valor` (numeric)

#### Tabela `usuarios`
Utilizada para armazenar as credenciais de login.
- `email` (text, chave única/identificador)
- `senha` (text)

---

## 🛠️ Como Executar o Projeto Localmente

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com a chave da API do Gemini:
```env
CHAVE_GEMINI=sua_chave_gemini_aqui
```

### 3. Rodar o Servidor de Desenvolvimento (Vite)
Para testar a interface do usuário:
```bash
npm run dev
```

### 4. Iniciar o Servidor do Chatbot (Backend Express)
Para iniciar a API que controla as respostas do Chef Pizzaiolo:
```bash
npm run start
```
O servidor backend rodará no endereço: `http://localhost:3000`.

---

## 📦 Compilação para Produção
Para compilar os arquivos estáticos e otimizados:
```bash
npm run build
```
Os arquivos gerados serão salvos na pasta `/dist`.
