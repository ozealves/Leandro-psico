# Prompt para Testes em Outras IAs

Copie e cole este prompt para testar a aplicação ou pedir novas funcionalidades em ferramentas como ChatGPT, Claude ou outras instâncias do Gemini.

---

**Prompt:**

"Estou desenvolvendo uma aplicação de gestão para psicólogos chamada **Consultório Leandro Psico**. O stack tecnológico consiste em **React (Vite), Tailwind CSS, Zustand e Express (Backend)**. 

Os principais arquivos do projeto são:
- `src/store/useStore.ts`: Gerencia o tema (claro/escuro/sistema) e dados do usuário.
- `src/pages/Settings.tsx`: Contém validação de senha forte e troca de tema.
- `src/pages/Records.tsx`: Possui filtros de busca e filtro por paciente via dropdown.
- `server.ts`: Backend Express servindo rotas de API como `/api/patients` e `/api/records`.

**Tarefas de Teste Sugeridas:**
1. Verifique se a troca de tema nas Configurações reflete imediatamente no layout e persiste após o refresh da página.
2. Teste a validação de senha: tente criar uma senha fraca e veja se os critérios são exibidos corretamente.
3. Na página de Prontuários, selecione um paciente no filtro e verifique se apenas os prontuários dele são exibidos.
4. Rode as rotas de API `/api/patients` para garantir que o backend está retornando os mocks corretamente.

**Contexto técnico:** O projeto usa o sistema de aliases `@` apontando para a raiz. A estilização usa o plugin de Tailwind 4 (v4) e os componentes são baseados no Shadcn/UI montados manualmente."

---
