# PsiFlow - Plataforma de Gestão para Psicólogos e Clínicas

## Visão Geral
O **PsiFlow** é um sistema completo e moderno para gestão de clínicas de psicologia e profissionais autônomos. Ele oferece uma interface acolhedora (baseada em tons verdes da psicologia), facilitando desde o agendamento de consultas até o controle financeiro e histórico de pacientes.

## Principais Funcionalidades

- **Dashboard (BI View)**: Visualização rica e interativa de KPIs (Pacientes ativos, Consultas realizadas, Taxa de conversão, Faturamento) com gráficos em estilo Power BI.
- **Agenda Inteligente**: 
  - Controle diário de consultas.
  - Alertas visuais de integração com **Google Agenda** e **Bot de WhatsApp**.
  - Envio prático de lembretes via WhatsApp diretamente da agenda.
- **Gestão de Pacientes**: Cadastro completo de pacientes com informações de contato.
- **Prontuários Eletrônicos (Records)**: 
  - Editor de Evolução de Prontuário rico (usando extensão Tiptap) permitindo formatações de texto complexas em um ambiente limpo.
- **Financeiro Simplificado**: 
  - Gerenciamento de despesas e receitas.
  - Filtro avançado com Date Range Picker.
  - Separação clara do fluxo de caixa diário/mensal.
- **Configurações e Integrações**:
  - Painel de Customização de perfil e senhas.
  - Abas de Integrações onde é possível vincular (mock via toggle) sistemas do Google Agenda e API Oficial do WhatsApp.

## Stack Tecnológica

O sistema foi estruturado com tecnologias frontend de ponta e um servidor leve preparado para APIs REST.

- **Frontend**: React 19, TypeScript, Vite.
- **Estilização e Componentes**: Tailwind CSS 4, shadcn/ui, Radix UI, Lucide Icons, Next Themes (Light/Dark mode).
- **Gestão de Estado**: Zustand (estado global de temas dinâmicos, configurações de integrações e dados de usuário mockados da sessão).
- **Formulários e Validações**: React Hook Form, Zod.
- **Ferramentas de Layout Avançado**: Recharts (Dashboard), react-day-picker e date-fns (Calendários), Tiptap (Rich Text).
- **Backend/Mock**: Servidor Node.js c/ Express rodando simultaneamente para mocar endpoints REST e persistência stateful enquanto o app não conecta a um banco real persistente.

## Como Executar Localmente

### Pré-requisitos
- Node.js versão v18+

### Passo a passo
1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação no seu navegador: O sistema iniciará tanto o mock do backend via tsx/Express quanto o Frontend no Vite, geralmente via http://localhost:3000.  

## Estrutura de Rotas e Endpoints (Mock API)
- `GET /api/patients` - Lista de pacientes ativos.
- `GET /api/appointments` - Lista de agendamentos.
- `GET /api/finance/transactions` - Histórico financeiro.
- `POST /api/finance/transactions` - Insere nova receita/despesa.
- `POST /api/records` - Lança novo histórico de prontuário/evolução.
