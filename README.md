# Thought Forge — skeleton

Squelette Node.js + PostgreSQL pour un système de pensée assistée sous contraintes.

## Flux

- **A** = contexte utile chargé depuis la mémoire : constitution, contraintes, erreurs, hypothèses, décisions, scories.
- **B** = constructeur : propose un mécanisme précis et une première traduction produit.
- **B agit sur A** via **dissensus** : attaque les hypothèses cachées, les oublis d'adoption, les angles morts économiques/humains/légaux.
- **C** = arbitrage : décide ce qui survit, ce qui est rejeté, ce qui devient contrainte, erreur, hypothèse, décision, ou scorie.

## Ce qui est stocké

- `projects` : noyau du projet.
- `memory_items` : contraintes, erreurs, hypothèses, décisions, scories.
- `sessions` : traces A/B/C d'une session.
- `security_events` : événements suspects.

## Structure

```text
src/
  app.js
  index.js
  config/
  controllers/
  middleware/
  repositories/
  routes/
  security/
  services/
  validators/
  public/
sql/
  001_init.sql
```

## Démarrage

1. Créer une base PostgreSQL.
2. Exécuter `sql/001_init.sql`.
3. Copier `.env.example` vers `.env` et renseigner les variables.
4. Installer les dépendances.
5. Lancer le serveur.

```bash
cp .env.example .env
npm install
psql "$DATABASE_URL" -f sql/001_init.sql
npm run dev
```

## API

- `POST /api/projects/bootstrap`
- `GET /api/projects/:projectId/workspace`
- `POST /api/projects/:projectId/sessions/run`
- `GET /api/projects/:projectId/sessions/:sessionId`
- `GET /api/projects/:projectId/security/events`

## Ce que ce squelette fait déjà

- front minimal sans dashboard
- pipeline async A → B → C
- mémoire projet persistée en PostgreSQL
- double appel LLM (constructeur + dissensus) + arbitrage
- gardes d'entrée simples contre oversize/prompt injection basique
- journalisation sécurité
- headers sécurité + rate limiting + CSP

## Ce qu'il faut ensuite

- authentification
- gestion d'équipes / rôles
- chiffrement de certains champs au repos
- test suite
- système de versionnage mémoire
- pièces jointes / documents
- file d'attente pour longues exécutions
- Docker quand le périmètre devient stable
# Jung
