# 🎥 ReelRate — Documento de Requisitos de Produto (PRD)

> Plataforma web de avaliação de filmes integrada à API TMDB

| | |
|---|---|
| **Versão** | 2.1 |
| **Data** | Junho de 2026 |
| **Status** | Escopo definido — aprovado para implementação |
| **Documento técnico** | [DESIGN_DOC.md](./DESIGN_DOC.md) |

> Este PRD foca no **produto** (problema, usuários, funcionalidades e objetivos). As
> **decisões técnicas** (arquitetura, stack, banco de dados, autenticação e infraestrutura)
> estão na **[Especificação Técnica / Design Doc](./DESIGN_DOC.md)**.

---

## Sumário

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Objetivos e Metas](#2-objetivos-e-metas)
3. [Público-Alvo e Personas](#3-público-alvo-e-personas)
4. [Escopo](#4-escopo)
5. [Requisitos Funcionais](#5-requisitos-funcionais)
6. [Requisitos Não Funcionais](#6-requisitos-não-funcionais)
7. [Jornadas Principais do Usuário](#7-jornadas-principais-do-usuário)
8. [Roadmap](#8-roadmap)
9. [Riscos e Premissas](#9-riscos-e-premissas)
10. [Equipe](#10-equipe)

---

## 1. Visão Geral do Produto

O **ReelRate** é uma aplicação web voltada a amantes do cinema que combina um catálogo amplo de filmes com avaliações da comunidade. Os usuários exploram lançamentos, abrem a página de cada título e registram suas opiniões com nota e comentário, formando uma referência coletiva sobre cada filme.

O catálogo é alimentado pela API pública da **TMDB** (The Movie Database), garantindo uma base ampla e atualizada de títulos, sinopses, cartazes e metadados, sem que o produto precise manter esse conteúdo manualmente.

O ReelRate é deliberadamente **enxuto e focado**: o valor central está em avaliar filmes de forma simples e em consultar a opinião agregada da comunidade. A equipe optou por um escopo reduzido, priorizando entrega rápida, baixo custo operacional e facilidade de evolução, sem abrir mão da capacidade de escalar. As escolhas de implementação que sustentam essa simplicidade estão na [Especificação Técnica](./DESIGN_DOC.md).

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
4. Manter a aplicação simples de operar e de baixo custo.

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

Atributos de qualidade esperados do produto. As tecnologias e decisões que os atendem estão detalhadas na [Especificação Técnica](./DESIGN_DOC.md).

| Categoria | Requisito |
|---|---|
| Desempenho | Páginas e listas devem carregar rapidamente, com respostas ágeis às interações. |
| Escalabilidade | A aplicação deve suportar o crescimento do número de usuários sem necessidade de redesenho. |
| Disponibilidade | O serviço deve permanecer disponível de forma confiável, com hospedagem gerenciada. |
| Usabilidade | A interface deve ser responsiva e funcionar bem em diferentes tamanhos de tela. |
| Segurança | Autenticação confiável e armazenamento seguro de credenciais dos usuários. |
| Confiabilidade | Persistência consistente dos dados de usuários e avaliações. |
| Integração | A indisponibilidade do catálogo externo (TMDB) não deve derrubar a aplicação. |
| Manutenibilidade | Base de código consistente e fácil de evoluir. |
| Custo | Operação de baixo custo, evitando complexidade e serviços desnecessários. |

---

## 7. Jornadas Principais do Usuário

### 7.1. Criar conta e entrar

1. Visitante acessa o ReelRate e escolhe criar conta.
2. Informa nome, e-mail e senha.
3. A conta é criada e o usuário é autenticado, podendo avaliar filmes e acessar seu perfil.

### 7.2. Avaliar um filme

1. Usuário acessa a Home e identifica um filme de interesse (ou usa a busca).
2. Abre a página do filme e lê a sinopse, a nota média e os comentários.
3. Atribui uma nota e escreve um comentário.
4. A avaliação passa a compor a nota média do filme e aparece no perfil do usuário.

### 7.3. Consultar o próprio histórico

1. Usuário acessa seu perfil.
2. Visualiza a lista de todas as avaliações que fez.
3. Edita ou exclui uma avaliação, se desejar.

---

## 8. Roadmap

| Fase | Status | Entregas |
|---|---|---|
| **Fase 1 — MVP** | Em implementação | Cadastro/login por e-mail, Home de lançamentos, página do filme, avaliações (nota + comentário), perfil com histórico e busca |
| **Fase 2 — Conta+** | Planejada | Recuperação de senha, edição de perfil, avatar e verificação de e-mail |
| **Fase 3 — Descoberta** | Planejada | Filtros por gênero, ordenação por nota e estatísticas do perfil |
| **Fase 4 — Social** | Futuro | Reintroduzir camada social (seguir usuários, feed) e listas personalizadas, caso o produto valide a demanda |

---

## 9. Riscos e Premissas

### 9.1. Riscos

- **Dependência da API TMDB:** indisponibilidade ou mudanças de termos/limites afetam o catálogo.
- **Conteúdo inicial escasso:** poucas avaliações no começo reduzem o valor das notas médias.
- **Moderação:** comentários abusivos exigem política e ferramentas de moderação.
- **Privacidade:** dados de conta exigem tratamento adequado (LGPD).

### 9.2. Premissas

- A TMDB permanece disponível e gratuita dentro dos limites de uso do projeto.
- Os usuários têm acesso a navegador moderno e conexão à internet.
- A infraestrutura escolhida (ver [Especificação Técnica](./DESIGN_DOC.md)) atende à demanda inicial e escala conforme o crescimento.

---

## 10. Equipe

| Nome | GitHub | Função |
|---|---|---|
| Gabryel Willers | @Gabryel-w | Desenvolvimento full-stack |
| Julia Jung | @juliazjung | Desenvolvimento full-stack |
| Ana Luiza Marks | @anxmarks | Desenvolvimento full-stack |

---

> Este PRD consolida as decisões da equipe sobre o **produto** ReelRate — problema, público, funcionalidades e objetivos —, que são as definições acordadas para esta versão. As **decisões técnicas** correspondentes estão na [Especificação Técnica (Design Doc)](./DESIGN_DOC.md).