# 🎥 ReelRate — Documento de Requisitos de Produto (PRD)

> Plataforma web de avaliação de filmes integrada à API TMDB

| | |
|---|---|
| **Versão** | 2.0 |
| **Data** | Junho de 2026 |
| **Status** | Escopo definido — aprovado para implementação |
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
7. [Decisões Arquiteturais e Stack Técnica](#7-decisões-arquiteturais-e-stack-técnica)
8. [Modelo de Dados (Conceitual)](#8-modelo-de-dados-conceitual)
9. [Jornadas Principais do Usuário](#9-jornadas-principais-do-usuário)
10. [Roadmap](#10-roadmap)
11. [Riscos e Premissas](#11-riscos-e-premissas)
12. [Equipe](#12-equipe)

---

## 1. Visão Geral do Produto

O **ReelRate** é uma aplicação web voltada a amantes do cinema que combina um catálogo amplo de filmes com avaliações da comunidade. Os usuários exploram lançamentos, abrem a página de cada título e registram suas opiniões com nota e comentário, formando uma referência coletiva sobre cada filme.

O catálogo é alimentado pela API pública da **TMDB** (The Movie Database), garantindo uma base ampla e atualizada de títulos, sinopses, cartazes e metadados, sem que o produto precise manter esse conteúdo manualmente.

O ReelRate é deliberadamente **enxuto e focado**: o valor central está em avaliar filmes de forma simples e em consultar a opinião agregada da comunidade. A equipe optou por um escopo reduzido e uma arquitetura simples — toda a aplicação roda dentro de uma única plataforma (Vercel) — priorizando entrega rápida, baixo custo operacional e facilidade de evolução, sem abrir mão da capacidade de escalar.

### 1.1. Problema

Cinéfilos têm dificuldade em registrar o que já assistiram, guardar suas impressões e decidir o que vale a pena ver a seguir. Plataformas genéricas de streaming priorizam recomendação algorítmica e não dão ao usuário um espaço próprio e direto para avaliar títulos e consultar a opinião de outras pessoas reais sobre um filme específico.

### 1.2. Proposta de valor

- Oferecer um lugar simples e rápido para o usuário avaliar filmes com nota e comentário.
- Consolidar, em cada filme, a nota média e os comentários da comunidade, ajudando na decisão de assistir.
- Aproveitar a base completa e atualizada da TMDB para o catálogo, eliminando esforço de curadoria.
- Entregar uma experiência leve, hospedada em uma única plataforma, com custo previsível e pronta para crescer.

---

## 2. Objetivos e Metas

### 2.1. Objetivos de produto

1. Permitir que qualquer usuário crie uma conta e avalie filmes com nota e comentário de forma simples.
2. Apresentar, em cada filme, a nota média e os comentários da comunidade de maneira clara.
3. Garantir acesso a um catálogo amplo e atualizado por meio da integração com a TMDB.
4. Manter a aplicação simples de operar e de baixo custo, rodando inteiramente na Vercel.

### 2.2. Métricas de sucesso

| Métrica | Descrição | Meta inicial |
|---|---|---|
| Usuários ativos | Usuários que retornam e interagem semanalmente | Crescimento mês a mês |
| Avaliações por usuário | Média de filmes avaliados por usuário ativo | ≥ 5 no primeiro mês |
| Conversão de cadastro | % de visitantes que criam conta | Monitoramento contínuo |
| Cobertura de avaliações | % de filmes visitados que possuem ao menos 1 avaliação | Crescimento mês a mês |
| Retenção | Usuários que retornam em 30 dias | Monitoramento contínuo |

---

## 3. Público-Alvo e Personas

O público-alvo são pessoas com interesse ativo em cinema, que gostam de registrar opiniões e consultar avaliações antes de escolher um filme. Faixa de uso típica: jovens adultos familiarizados com aplicações web.

### 3.1. Personas

| Persona | Necessidade | Como o ReelRate atende |
|---|---|---|
| **O Crítico** | Registrar e compartilhar suas opiniões sobre filmes | Avaliações com nota e comentário; perfil com histórico |
| **O Casual** | Saber rapidamente se um filme vale a pena | Página do filme com nota média e comentários da comunidade |
| **O Organizado** | Acompanhar o que já avaliou | Perfil pessoal com todas as suas avaliações |

---

## 4. Escopo

A equipe vai implementar **apenas o núcleo do produto** — avaliação de filmes e conta de usuário —, mantendo a aplicação simples e enxuta:

- Cadastro e login de usuário com e-mail e senha.
- Home com filmes recém-lançados, atualizada constantemente via TMDB.
- Página dedicada por filme (cartaz, sinopse, nota média e comentários da comunidade).
- Sistema de avaliações (nota + comentário) por usuário.
- Perfil do usuário com o histórico das próprias avaliações.
- Busca de filmes no catálogo TMDB.

---

## 5. Requisitos Funcionais

Os requisitos abaixo definem o que o produto fará, com prioridade segundo a convenção **MoSCoW** (Must / Should / Could).

| ID | Funcionalidade | Descrição | Prioridade |
|---|---|---|---|
| RF-01 | Cadastro e login | Usuário cria conta com e-mail e senha e autentica para avaliar filmes e ver seu perfil. | Must |
| RF-02 | Home de lançamentos | Exibir filmes recém-lançados com atualização constante a partir da TMDB. | Must |
| RF-03 | Página do filme | Página dedicada com cartaz, sinopse, nota média e comentários dos usuários. | Must |
| RF-04 | Avaliar filme | Atribuir nota e escrever comentário sobre um filme. | Must |
| RF-05 | Perfil do usuário | Visualizar todas as avaliações feitas pelo próprio usuário. | Must |
| RF-06 | Busca de filmes | Localizar títulos no catálogo TMDB. | Should |
| RF-07 | Editar/excluir avaliação | Alterar ou remover uma avaliação previamente feita. | Should |
| RF-08 | Seleção de avatar | Escolher um avatar entre os disponíveis para personalizar o perfil. | Could |

### 5.1. Regras de negócio

Restrições e comportamentos que o sistema deve garantir, independentemente da interface:

- **RN-01 — Uma avaliação por filme:** um usuário pode avaliar cada filme **apenas uma vez**; para mudar de opinião, edita ou exclui a avaliação existente.
- **RN-02 — Faixa da nota:** a nota de uma avaliação deve ser um número inteiro **entre 1 e 5**.
- **RN-03 — Avaliação exige autenticação:** apenas usuários **autenticados** podem criar, editar ou excluir avaliações.
- **RN-04 — Propriedade da avaliação:** um usuário só pode editar ou excluir as **próprias** avaliações.
- **RN-05 — Cálculo da nota média:** a nota média exibida na página do filme é calculada a partir de **todas as avaliações** daquele filme.

---

## 6. Requisitos Não Funcionais

| Categoria | Requisito | Detalhe |
|---|---|---|
| Desempenho | Carregamento rápido | Cache de dados (TanStack Query) e renderização do Next.js para respostas ágeis. |
| Escalabilidade | Arquitetura serverless | Funções da Vercel escalam automaticamente sob demanda; sessões stateless (JWT) permitem escala horizontal sem estado compartilhado. |
| Disponibilidade | Hospedagem gerenciada | Deploy e banco na própria Vercel, com escalabilidade automática. |
| Usabilidade | Interface responsiva | Layout adaptável a diferentes tamanhos de tela via Tailwind CSS. |
| Segurança | Autenticação | Gestão de sessões e credenciais via NextAuth; senhas armazenadas com hash. |
| Confiabilidade | Persistência | Banco PostgreSQL serverless (Vercel Postgres) acessado via Prisma ORM. |
| Integração | Resiliência da TMDB | Tratamento de falhas e limites de requisição da API externa. |
| Manutenibilidade | Tipagem estática | Base 100% em TypeScript para reduzir erros e facilitar evolução. |
| Custo | Plataforma única | Operar tudo dentro da Vercel reduz custo e sobrecarga de gerenciar serviços externos. |

---

## 7. Decisões Arquiteturais e Stack Técnica

A equipe definiu uma arquitetura **simples e unificada**: o ReelRate é uma aplicação full-stack em **Next.js**, com front-end e back-end no mesmo projeto, hospedada e com banco de dados na própria **Vercel**. Não há serviços externos de banco.

### 7.1. Decisões de simplificação

- **Plataforma única (Vercel).** Toda a aplicação — front-end, rotas de API (Route Handlers / Server Actions) e banco de dados — vive dentro do projeto Vercel. Isso elimina a necessidade de orquestrar provedores separados.
- **Banco: Vercel Postgres (no lugar do Supabase).** A persistência usa **Vercel Postgres** (Postgres serverless, provisionado dentro do próprio projeto Vercel), substituindo o Supabase. Por ser Postgres, mantém-se o Prisma e o modelo relacional, escala automaticamente sob demanda e não depende de uma conta/serviço externo.
- **Autenticação simples por credenciais.** Login apenas com e-mail e senha via NextAuth, sem provedores externos (Google etc.), reduzindo configuração e dependências.
- **Escopo enxuto.** Sem camada social nem listas, o domínio fica reduzido a usuários e avaliações, simplificando código, dados e manutenção.

> **Por que ainda escala?** As funções serverless da Vercel autoescalam por requisição, o Vercel Postgres oferece pooling de conexões adequado a esse modelo, as sessões são stateless (JWT) e o catálogo é servido pela TMDB — ou seja, o crescimento de usuários não exige reescrita da arquitetura.

### 7.2. Stack técnica

| Camada | Tecnologia | Papel |
|---|---|---|
| Framework (front + back) | Next.js + TypeScript | Renderização, rotas, UI e API no mesmo projeto |
| Estilização | Tailwind CSS | Sistema de estilos utilitário e responsivo |
| Estado / dados | TanStack Query | Cache, sincronização e gestão de requisições |
| Requisições HTTP | Axios / fetch | Cliente HTTP para a API TMDB e endpoints internos |
| Autenticação | NextAuth | Login por e-mail e senha, sessões (JWT) |
| ORM | Prisma | Modelagem e acesso ao banco de dados |
| Banco de dados | Vercel Postgres | Persistência de usuários e avaliações |
| Catálogo externo | API TMDB | Filmes, cartazes, sinopses e metadados |
| Hospedagem | Vercel | Deploy, execução serverless e banco de dados |

### 7.3. Integração com a TMDB

- O catálogo (lançamentos, fichas, cartazes e sinopses) é consumido da TMDB em tempo de execução.
- Dados próprios da aplicação (usuários e avaliações) ficam no banco interno (Vercel Postgres).
- Cada filme é referenciado pelo seu identificador na TMDB, evitando duplicar o catálogo no banco.

---

## 8. Modelo de Dados (Conceitual)

Com o escopo enxuto, o domínio se reduz a duas entidades próprias, além da referência ao filme da TMDB.

| Entidade | Descrição | Principais relações |
|---|---|---|
| Usuário | Conta com e-mail, senha (hash), nome e avatar | Possui várias avaliações |
| Avaliação | Nota e comentário sobre um filme | Pertence a um usuário; referencia um filme (TMDB) por ID |
| Filme (TMDB) | Dado externo, não persistido integralmente | Referenciado por avaliações via ID da TMDB |

> Regra de integridade: um usuário possui no máximo uma avaliação por filme (pode editá-la ou excluí-la).

---

## 9. Jornadas Principais do Usuário

### 9.1. Criar conta e entrar

1. Visitante acessa o ReelRate e escolhe criar conta.
2. Informa nome, e-mail e senha.
3. A conta é criada e o usuário é autenticado, podendo avaliar filmes e acessar seu perfil.

### 9.2. Avaliar um filme

1. Usuário acessa a Home e identifica um filme de interesse (ou usa a busca).
2. Abre a página do filme e lê a sinopse, a nota média e os comentários.
3. Atribui uma nota e escreve um comentário.
4. A avaliação passa a compor a nota média do filme e aparece no perfil do usuário.

### 9.3. Consultar o próprio histórico

1. Usuário acessa seu perfil.
2. Visualiza a lista de todas as avaliações que fez.
3. Edita ou exclui uma avaliação, se desejar.

---

## 10. Roadmap

| Fase | Status | Entregas |
|---|---|---|
| **Fase 1 — MVP** | Em implementação | Cadastro/login por e-mail, Home de lançamentos, página do filme, avaliações (nota + comentário), perfil com histórico e busca |
| **Fase 2 — Conta+** | Planejada | Recuperação de senha, edição de perfil, avatar e verificação de e-mail |
| **Fase 3 — Descoberta** | Planejada | Filtros por gênero, ordenação por nota e estatísticas do perfil |
| **Fase 4 — Social** | Futuro | Reintroduzir camada social (seguir usuários, feed) e listas personalizadas, caso o produto valide a demanda |

---

## 11. Riscos e Premissas

### 11.1. Riscos

- **Dependência da API TMDB:** indisponibilidade ou mudanças de termos/limites afetam o catálogo.
- **Conteúdo inicial escasso:** poucas avaliações no começo reduzem o valor das notas médias.
- **Moderação:** comentários abusivos exigem política e ferramentas de moderação.
- **Privacidade:** dados de conta exigem tratamento adequado (LGPD).

### 11.2. Premissas

- A TMDB permanece disponível e gratuita dentro dos limites de uso do projeto.
- Os usuários têm acesso a navegador moderno e conexão à internet.
- A hospedagem e o banco (Vercel + Vercel Postgres) atendem à demanda inicial e escalam conforme o crescimento.

---

## 12. Equipe

| Nome | GitHub | Função |
|---|---|---|
| Gabryel Willers | @Gabryel-w | Desenvolvimento full-stack |
| Julia Jung | @juliazjung | Desenvolvimento full-stack |
| Ana Luiza Marks | @anxmarks | Desenvolvimento full-stack |

---

> Este PRD consolida as decisões da equipe sobre escopo e arquitetura do ReelRate. As funcionalidades, prioridades e a stack aqui descritas são as definições acordadas para a implementação desta versão.