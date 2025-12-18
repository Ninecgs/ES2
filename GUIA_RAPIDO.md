# 🚀 Guia Rápido - SAPEA

## Como Testar o Sistema

### 1. Abrir o Sistema
- Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge, Safari)

### 2. Fazer Login
- **E-mail**: Qualquer e-mail (ex: teste@email.com)
- **Senha**: Qualquer senha (ex: 123456)
- **Perfil**: Selecione "Pais/Responsáveis" ou "Equipe Escolar"
- Clique em "Entrar"

### 3. Navegar pelas Telas

#### Para ver a Interface da Criança:
- No código JavaScript, você pode adicionar um botão ou link para acessar `crianca-screen`
- Ou modificar temporariamente o login para redirecionar para essa tela

#### Para Pais/Responsáveis:
- Após login com perfil "Pais/Responsáveis", você verá:
  - Dashboard com status do dia
  - Alertas de transição
  - Calendário
  - Histórico de crises

#### Para Equipe Escolar:
- Após login com perfil "Equipe Escolar", você verá:
  - Lista de crianças vinculadas
  - Ações rápidas (Gerenciar Rotina, Registrar Crise, Ambientes)

### 4. Testar Funcionalidades

#### Botão SOS (Interface da Criança)
- Clique no botão fixo no canto inferior direito
- Uma mensagem de confirmação aparecerá

#### Tours Virtuais
- Na interface da criança, clique em "Ver Lugares"
- Explore os ambientes da escola

#### Configurações
- Clique no ícone ⚙️ no canto superior direito
- Teste mudança de cores
- Ative/desative o modo mínimo

#### Calendário
- Na tela de pais, veja o calendário mensal
- Dias com eventos estão destacados

### 5. Testar Responsividade

#### Desktop
- Redimensione a janela do navegador
- Use as ferramentas de desenvolvedor (F12)

#### Mobile
- Use o modo de dispositivo móvel no navegador
- Teste em diferentes tamanhos de tela:
  - iPhone SE (375px)
  - iPhone 12 Pro (390px)
  - iPad (768px)
  - Desktop (1024px+)

### 6. Testar Acessibilidade

#### Navegação por Teclado
- Use Tab para navegar entre elementos
- Use Enter/Space para ativar botões
- Use Escape para fechar modais

#### Modo Mínimo
- Ative nas configurações
- Observe a redução de estímulos visuais

#### Alto Contraste
- O sistema detecta automaticamente preferências do sistema
- Teste com `prefers-contrast: high` nas configurações do navegador

## 🎨 Personalização

### Cores Disponíveis
- **Azul** (padrão): Calmo e confiável
- **Verde**: Tranquilizante e natural
- **Lilás**: Suave e acolhedor
- **Areia**: Neutro e relaxante

### Modo Mínimo
- Remove animações
- Remove sombras
- Remove transições
- Ideal para sensibilidade sensorial alta

## 📱 Dicas de Uso

### Para Crianças
- A interface é projetada para ser usada em tablets na escola
- Botões grandes facilitam o toque
- Visual claro e previsível

### Para Pais
- Verifique o dashboard diariamente
- Acompanhe os alertas de transição
- Consulte o histórico para identificar padrões

### Para Equipe Escolar
- Mantenha as rotinas atualizadas
- Registre crises e estratégias eficazes
- Adicione fotos dos ambientes para tours virtuais

## 🔧 Próximos Passos (Desenvolvimento)

Para transformar este protótipo em um sistema completo:

1. **Backend**
   - API REST para autenticação
   - Banco de dados para armazenar rotinas, crises, etc.
   - Sistema de notificações em tempo real

2. **Funcionalidades Adicionais**
   - Upload de fotos reais dos ambientes
   - Sistema de notificações push
   - Relatórios e gráficos
   - Comunicação entre perfis

3. **Melhorias**
   - Suporte offline
   - Sincronização em tempo real
   - Histórico completo de atividades
   - Sistema de recompensas visuais

## ❓ Problemas Comuns

### O calendário não aparece
- Certifique-se de que o JavaScript está habilitado
- Verifique o console do navegador (F12) para erros

### As cores não mudam
- Limpe o cache do navegador
- Verifique se o JavaScript está funcionando

### Botões não respondem
- Verifique se há erros no console
- Certifique-se de que todos os arquivos estão na mesma pasta

## 📞 Suporte

Este é um protótipo funcional. Para questões sobre implementação ou melhorias, consulte a documentação do código.

---

**Lembre-se**: Este sistema foi projetado com foco em acessibilidade cognitiva e design inclusivo. Todas as decisões de design foram tomadas pensando no bem-estar e conforto dos usuários. 💙

