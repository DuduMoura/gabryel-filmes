# Guia de Contribuição

Este documento define **como a equipe trabalha** neste repositório e como o trabalho
é entregue ao repositório original do projeto. Seguir este fluxo garante que **a
contribuição de cada pessoa fique registrada e visível** no destino final.

---

## 🗺️ Visão geral do fluxo

```
Colaboradores → branch → PR → [ main deste repo ] → push + PR → [ repo original ]
   (cada um)    (1 feature)  (revisão do time)      (a "ponte")     (destino final)
```

- **Colaboradores** trabalham aqui, cada um em sua branch, e abrem PR para a `main`.
- A `main` deste repositório é sempre a versão **estável e revisada** do time.
- A entrega ao repositório original é feita pela **pessoa-ponte** (quem tem acesso de
  escrita lá), enviando a `main` como uma branch e abrindo um PR.

---

## 1. Configuração inicial (cada pessoa, uma vez)

Para que seus commits sejam **vinculados ao seu perfil do GitHub**, configure o Git com
o **mesmo e-mail da sua conta GitHub**:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email-do-github@exemplo.com"
```

> 💡 Recomendado: use o e-mail privado `…@users.noreply.github.com` disponível em
> **GitHub → Settings → Emails**. Ele vincula o commit ao seu perfil sem expor seu
> e-mail real.

Verifique com:

```bash
git config user.name
git config user.email
```

---

## 2. Fluxo diário do colaborador

**Uma branch por funcionalidade.** Nunca commite direto na `main`.

```bash
# Sempre parta da main atualizada
git checkout main
git pull origin main

# Crie uma branch para a sua tarefa
git checkout -b feature/nome-da-funcionalidade

# Faça os commits da sua funcionalidade
git add .
git commit -m "feat: descreve o que foi feito"

# Envie a branch para este repositório
git push origin feature/nome-da-funcionalidade
```

Depois, **abra um Pull Request** desta branch para a `main` deste repositório e peça
revisão a outro membro do time.

### Padrão de mensagens de commit

Use prefixos para deixar claro o tipo da mudança:

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `refactor:` refatoração sem mudar comportamento
- `style:` formatação/estilo
- `test:` testes

---

## 3. Revisando e aceitando PRs (merge na `main`)

Ao aprovar um PR, **use "Create a merge commit"** (ou "Rebase and merge").

> ⚠️ **Não use "Squash and merge".**
> O squash colapsa todos os commits do PR em um único commit, perde o histórico
> passo a passo e rebaixa coautores (em PRs feitos em dupla) a uma nota de rodapé.
> Para preservar **quem fez o quê**, prefira o merge commit.

Resumo:

| Estratégia | Preserva cada commit? | Recomendado? |
|---|---|---|
| Create a merge commit | ✅ Sim | ✅ **Use esta** |
| Rebase and merge | ✅ Sim | ✅ Alternativa válida |
| Squash and merge | ❌ Colapsa em 1 commit | ❌ Evitar |

---

## 4. Entrega ao repositório original (a "ponte")

Feita pela pessoa com acesso de escrita ao repositório original. O remote `upstream`
aponta para ele.

```bash
# 1. Atualize a main local com o que o time mergeou
git checkout main
git pull origin main

# 2. Traga o que mudou no repositório original (evita divergência)
git pull upstream main

# 3. Envie a main como uma BRANCH nova no repositório original
git push upstream main:entrega-N      # use um nome novo a cada entrega: entrega-2, entrega-3...

# 4. Abra o PR no repositório original: base "main" ← compare "entrega-N"
```

Após o `push`, o GitHub devolve um link pronto para abrir o PR. Como os commits
carregam a autoria original de cada pessoa, o repositório de destino mostrará
**todos os colaboradores** que participaram (aba *Commits* do PR, histórico da
`main` e *Insights → Contributors*).

> Use **sempre uma branch nova** por entrega. Não envie direto para a `main` do
> repositório original — o PR existe justamente para a revisão final.

---

## ✅ Checklist rápido

**Colaborador, antes de abrir o PR:**

- [ ] `user.email` configurado com o e-mail da conta GitHub
- [ ] Trabalho feito em uma branch própria (não na `main`)
- [ ] Branch atualizada com a `main` mais recente
- [ ] Mensagens de commit claras e com prefixo (`feat:`, `fix:`…)

**Quem aprova o PR:**

- [ ] Revisou as mudanças
- [ ] Mergeou com **"Create a merge commit"** (sem squash)
