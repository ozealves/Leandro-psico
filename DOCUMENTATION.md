# Documentação do Projeto: Consultório Leandro Psico

Este projeto é uma plataforma de gestão para consultórios de psicologia, focada em produtividade e organização.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 com Vite
- **Estilização**: Tailwind CSS com componentes baseados no Shadcn/UI
- **Estado Global**: Zustand (com persistência no LocalStorage)
- **Roteamento**: React Router DOM v6
- **Validação de Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React
- **Notificações**: Sonner
- **Testes**: Vitest + React Testing Library

## 🛠️ Funcionalidades Implementadas

### 1. Sistema de Temas (Claro, Escuro e Sistema)
- Localizado na página de Configurações.
- Permite ao usuário escolher entre tema Claro, Escuro ou seguir a preferência do Sistema Operacional.
- A preferência é salva globalmente via Zustand e persiste entre sessões.

### 2. Gestão de Prontuários (Records)
- Listagem de prontuários com busca por texto.
- **Filtro Avançado**: Dropdown para filtrar prontuários por um paciente específico, buscando dados dinamicamente da lista de pacientes.
- Visualização detalhada de cada registro.

### 3. Segurança e Perfil
- Alteração de senha na aba de segurança das Configurações.
- **Validação de Senha Forte**: Requer no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.
- Indicador visual de força da senha.
- Confirmação de senha com validação em tempo real.

### 4. Agenda e Pacientes
- Interface para agendamento de consultas.
- Cadastro e listagem de pacientes (integração backend pronta).

### 5. Configurações e Integrações
- Edição de perfil do profissional.
- Switches para controle de notificações.
- UI pronta para integrações com Google Agenda e WhatsApp Bot.

## 🧪 Estrutura de Testes
- Configuração de ambiente de teste completa com Vitest.
- Teste unitário de exemplo para o componente `Button`.
- Scripts de validação incluídos no `package.json`: `npm run test` e `npm run lint`.

## 📁 Estrutura de Pastas Principal
- `/src/pages`: Páginas da aplicação.
- `/src/store`: Gerenciamento de estado (Zustand).
- `/src/lib`: Utilidades (ex: `cn` para Tailwind).
- `/components/ui`: Componentes de interface compartilhados.
- `/server.ts`: Servidor backend (Express) integrando a API.
