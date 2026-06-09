# 🎥 ReelRate — Documento de Requisitos de Produto (PRD)

> Rede social de avaliação de filmes integrada à API TMDB

| | |
|---|---|
| **Versão** | 1.0 |
| **Data** | Junho de 2026 |
| **Status** | Produto em produção (MVP entregue) |
| **Repositório** | github.com/anxmarks/ReelRate |
| **Aplicação** | reel-rate.vercel.app |

---

## Sumário

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Objetivos e Metas](#2-objetivos-e-metas)
3. [Público-Alvo e Personas](#3-público-alvo-e-personas)
4. [Escopo](#4-escopo)
5. [Requisitos Funcionais](#5-requisitos-funcionais)
6. [Requisitos Não Funcionais](#6-requisitos-não-funcionais)
7. [Arquitetura e Stack Técnica](#7-arquitetura-e-stack-técnica)
8. [Modelo de Dados (Conceitual)](#8-modelo-de-dados-conceitual)
9. [Jornadas Principais do Usuário](#9-jornadas-principais-do-usuário)
10. [Roadmap Sugerido](#10-roadmap-sugerido)
11. [Riscos e Premissas](#11-riscos-e-premissas)
12. [Equipe](#12-equipe)

---

## 1. Visão Geral do Produto

O **ReelRate** é uma aplicação web voltada a amantes do cinema que combina catálogo de filmes com uma camada social de avaliação e descoberta. Os usuários podem explorar lançamentos, avaliar títulos com notas e comentários, montar listas personalizadas e acompanhar a atividade de outros usuários que seguem.

O catálogo de filmes é alimentado pela API pública da **TMDB** (The Movie Database), garantindo uma base ampla e atualizada de títulos, sinopses, cartazes e metadados, sem que o produto precise manter esse conteúdo manualmente.

Diferentemente de catálogos puramente informativos, o ReelRate posiciona-se como uma **rede social de nicho**: o valor central está na opinião compartilhada entre pessoas e amigos, transformando a experiência de escolher e comentar filmes em algo coletivo.

### 1.1. Problema

Cinéfilos têm dificuldade em organizar o que já assistiram, registrar suas impressões e descobrir novos títulos a partir de fontes confiáveis — pessoas que conhecem e cujo gosto respeitam. Plataformas genéricas de streaming priorizam recomendação algorítmica e não a curadoria social.

### 1.2. Proposta de valor

- Centralizar em um só lugar as avaliações do próprio usuário, dos amigos e da comunidade.
- Oferecer descoberta de filmes baseada em relações sociais (seguir usuários), e não apenas em algoritmos.
- Permitir organização pessoal por meio de listas (favoritos, assistir depois, temáticas).
- Aproveitar a base completa e atualizada da TMDB para o catálogo, reduzindo esforço de curadoria.

---

## 2. Objetivos e Metas

### 2.1. Objetivos de produto

1. Permitir que qualquer usuário avalie filmes com nota e comentário de forma simples.
2. Construir uma camada social que incentive seguir outros usuários e consumir suas avaliações.
3. Oferecer organização pessoal do consumo de filmes por meio de listas.
4. Garantir acesso a um catálogo amplo e atualizado por meio de integração com a TMDB.

### 2.2. Métricas de sucesso (sugeridas)

| Métrica | Descrição | Meta inicial |
|---|---|---|
| Usuários ativos | Usuários que retornam e interagem semanalmente | Crescimento mês a mês |
| Avaliações por usuário | Média de filmes avaliados por usuário ativo | ≥ 5 no primeiro mês |
| Taxa de conexão social | % de usuários que seguem ao menos 1 pessoa | ≥ 40% |
| Listas criadas | Listas personalizadas por usuário | ≥ 1 por usuário ativo |
| Retenção | Usuários que retornam em 30 dias | Monitoramento contínuo |

---

## 3. Público-Alvo e Personas

O público-alvo são pessoas com interesse ativo em cinema, que gostam de registrar opiniões e descobrir títulos por indicação social. Faixa de uso típica: jovens adultos familiarizados com aplicações web e redes sociais.

### 3.1. Personas

| Persona | Necessidade | Como o ReelRate atende |
|---|---|---|
| **O Crítico** | Registrar e compartilhar opiniões detalhadas sobre filmes | Avaliações com nota e comentário, perfil público com histórico |
| **O Curador** | Organizar o que já viu e o que quer ver | Listas personalizadas e página de perfil |
| **O Descobridor** | Encontrar bons filmes por indicação confiável | Feed de avaliações de amigos e página de amigos |
| **O Casual** | Saber rapidamente se um filme vale a pena | Página do filme com nota média e comentários da comunidade |

---

## 4. Escopo

### 4.1. Dentro do escopo (MVP atual)

- Autenticação e gestão de conta de usuário.
- Home com filmes recém-lançados, atualizada constantemente via TMDB.
- Página dedicada por filme (cartaz, sinopse, nota média, comentários).
- Sistema de avaliações (nota + comentário) por usuário.
- Rede social: seguir usuários e ver suas avaliações.
- Listas de filmes personalizadas (favoritos / assistir depois / temáticas).
- Perfil do usuário com seu histórico de avaliações e avatar.

### 4.2. Fora do escopo (nesta versão)

- Streaming ou reprodução de filmes.
- Recomendação algorítmica personalizada baseada em machine learning.
- Aplicativos móveis nativos (iOS/Android).
- Mensagens privadas entre usuários e notificações em tempo real.
- Monetização (assinaturas, anúncios).

---

## 5. Requisitos Funcionais

Os requisitos abaixo refletem as funcionalidades do produto, com prioridade sugerida segundo a convenção **MoSCoW** (Must / Should / Could).

| ID | Funcionalidade | Descrição | Prioridade |
|---|---|---|---|
| RF-01 | Cadastro e login | Usuário cria conta e autentica para acessar recursos sociais e personalizados. | Must |
| RF-02 | Home de lançamentos | Exibir filmes recém-lançados com atualização constante a partir da TMDB. | Must |
| RF-03 | Página do filme | Página dedicada com cartaz, sinopse, nota média e comentários dos usuários. | Must |
| RF-04 | Avaliar filme | Atribuir nota e escrever comentário sobre um filme. | Must |
| RF-05 | Perfil do usuário | Visualizar todas as avaliações feitas pelo próprio usuário e definir avatar. | Must |
| RF-06 | Seguir usuários | Encontrar e seguir outros usuários (página de amigos). | Should |
| RF-07 | Feed de avaliações | Consolidar avaliações da comunidade e dos amigos em um único lugar. | Should |
| RF-08 | Listas de filmes | Criar listas personalizadas (favoritos, assistir depois, temáticas). | Should |
| RF-09 | Busca de filmes | Localizar títulos no catálogo TMDB. | Could |
| RF-10 | Seleção de avatar | Escolher avatar entre os disponíveis para personalizar o perfil. | Could |

---

## 6. Requisitos Não Funcionais

| Categoria | Requisito | Detalhe |
|---|---|---|
| Desempenho | Carregamento rápido | Uso de cache de dados (TanStack Query) e renderização do Next.js para respostas ágeis. |
| Disponibilidade | Hospedagem gerenciada | Deploy na Vercel com escalabilidade automática. |
| Usabilidade | Interface responsiva | Layout adaptável a diferentes tamanhos de tela via Tailwind CSS. |
| Segurança | Autenticação | Gestão de sessões e provedores de login via NextAuth. |
| Confiabilidade | Persistência | Banco PostgreSQL gerenciado (Supabase) acessado via Prisma ORM. |
| Integração | Resiliência da TMDB | Tratamento de falhas e limites de requisição da API externa. |
| Manutenibilidade | Tipagem estática | Base 100% em TypeScript para reduzir erros e facilitar evolução. |

---

## 7. Arquitetura e Stack Técnica

O ReelRate é uma aplicação full-stack baseada em **Next.js**, com renderização no servidor e no cliente, persistência em banco relacional e integração com serviço externo de catálogo.

| Camada | Tecnologia | Papel |
|---|---|---|
| Framework / Frontend | Next.js + TypeScript | Renderização, rotas e UI da aplicação |
| Estilização | Tailwind CSS | Sistema de estilos utilitário e responsivo |
| Estado / dados | TanStack Query | Cache, sincronização e gestão de requisições |
| Requisições HTTP | Axios | Cliente HTTP para a API TMDB e endpoints internos |
| Autenticação | NextAuth | Login, sessões e provedores de identidade |
| ORM | Prisma | Modelagem e acesso ao banco de dados |
| Banco de dados | PostgreSQL (Supabase) | Persistência de usuários, avaliações e listas |
| Catálogo externo | API TMDB | Filmes, cartazes, sinopses e metadados |
| Hospedagem | Vercel | Deploy e entrega da aplicação |

### 7.1. Integração com a TMDB

- O catálogo (lançamentos, fichas, cartazes e sinopses) é consumido da TMDB em tempo de execução.
- Dados próprios da aplicação (usuários, avaliações, comentários, listas, relações de seguir) ficam no banco interno.
- Cada filme é referenciado pelo seu identificador na TMDB, evitando duplicar o catálogo no banco.

---

## 8. Modelo de Dados (Conceitual)

Modelo conceitual inferido a partir das funcionalidades do produto. Serve como referência de domínio e deve ser confirmado com o schema Prisma real.

| Entidade | Descrição | Principais relações |
|---|---|---|
| Usuário | Conta com perfil, avatar e credenciais | Possui avaliações, listas; segue/é seguido por usuários |
| Avaliação | Nota e comentário sobre um filme | Pertence a um usuário; referencia um filme (TMDB) |
| Lista | Coleção personalizada de filmes | Pertence a um usuário; contém itens de filme |
| Item de lista | Filme dentro de uma lista | Referencia filme (TMDB) e uma lista |
| Relação social | Vínculo de "seguir" entre usuários | Liga um usuário seguidor a um seguido |
| Filme (TMDB) | Dado externo, não persistido integralmente | Referenciado por avaliações e itens de lista via ID |

---

## 9. Jornadas Principais do Usuário

### 9.1. Avaliar um filme

1. Usuário acessa a Home e identifica um filme de interesse.
2. Abre a página do filme e lê sinopse, nota média e comentários.
3. Atribui uma nota e escreve um comentário.
4. A avaliação passa a aparecer em seu perfil e no feed de seus seguidores.

### 9.2. Descobrir filmes por amigos

1. Usuário acessa a página de amigos e segue outros usuários.
2. Passa a visualizar as avaliações desses usuários no feed de avaliações.
3. A partir das indicações, abre páginas de filme e decide o que assistir.

### 9.3. Organizar com listas

1. Usuário cria uma lista (ex.: "Assistir depois").
2. Adiciona filmes do catálogo à lista.
3. Consulta e gerencia suas listas a partir do perfil.

---

## 10. Roadmap Sugerido

| Fase | Status | Entregas |
|---|---|---|
| **Fase 1 — MVP** | Concluída | Autenticação, Home, página do filme, avaliações, perfil, amigos e listas |
| **Fase 2 — Social+** | Proposta | Notificações, busca avançada, comentários em threads, curtidas em avaliações |
| **Fase 3 — Descoberta** | Proposta | Recomendações personalizadas, filtros por gênero e estatísticas de perfil |
| **Fase 4 — Alcance** | Proposta | PWA/mobile, compartilhamento externo e internacionalização |

---

## 11. Riscos e Premissas

### 11.1. Riscos

- **Dependência da API TMDB:** indisponibilidade ou mudanças de termos/limites afetam o catálogo.
- **Qualidade do conteúdo social:** poucas avaliações iniciais reduzem o valor da rede (efeito "rede vazia").
- **Moderação:** comentários abusivos exigem política e ferramentas de moderação.
- **Privacidade:** dados de usuário e relações sociais demandam tratamento adequado (LGPD).

### 11.2. Premissas

- A TMDB permanece disponível e gratuita dentro dos limites de uso do projeto.
- Os usuários têm acesso a navegador moderno e conexão à internet.
- A hospedagem na Vercel e o banco no Supabase atendem à demanda inicial.

---

## 12. Equipe

| Nome | GitHub | Função (sugerida) |
|---|---|---|
| Gabryel Willers | @Gabryel-w | Desenvolvimento full-stack |
| Julia Jung | @juliazjung | Desenvolvimento full-stack |
| Ana Luiza Marks | @anxmarks | Desenvolvimento full-stack |

---

> **Observação:** Este PRD foi elaborado a partir das informações públicas do repositório e da aplicação. Itens como prioridades MoSCoW, métricas, modelo de dados e roadmap são propostas para discussão e devem ser validados pela equipe.
