# GeoResto

Application mobile React Native de décision de groupe pour choisir un restaurant. Inspirée du swipe Tinder : chaque participant valide ou rejette des cartes restaurant, un match est déclenché quand tout le monde a liké le même lieu.

Projet de fin de module **React Native** (M2 DEV, AD Education).

## Stack

| Couche | Choix |
| --- | --- |
| Framework | Expo SDK 54 (managed) |
| Langage | TypeScript 5.9 strict |
| Navigation | `expo-router` v6 (file-based, typed routes) |
| State global | Context API + `useReducer` |
| Animations | `react-native-reanimated` v4 + `react-native-worklets` |
| Gestes | `react-native-gesture-handler` v2 |
| API externe | Google Places (Nearby Search + Place Details) |
| Persistance | `@react-native-async-storage/async-storage` |
| Géolocalisation | `expo-location` |
| Haptics | `expo-haptics` |
| Images | `expo-image` |
| Icônes | `lucide-react-native` |
| Lint | ESLint (`eslint-config-expo`) + commitlint + husky |

## Architecture

```
projet-dev-mobile/
├── app/                          # Routes expo-router (file-based)
│   ├── _layout.tsx               # Provider + GestureHandlerRootView
│   ├── index.tsx                 # Redirect selon état d'auth
│   ├── (auth)/
│   │   └── join.tsx              # Saisie pseudo
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Bottom tabs
│   │   ├── index.tsx             # Liste des events (FlatList)
│   │   └── profile.tsx           # Profil + reset
│   ├── event/
│   │   ├── _layout.tsx
│   │   ├── create.tsx            # Formulaire création event
│   │   └── [id]/
│   │       ├── _layout.tsx
│   │       ├── lobby.tsx         # Salle d'attente
│   │       ├── swipe.tsx         # Stack de cartes swipables
│   │       └── match.tsx         # Écran match (modal)
│   └── restaurant/
│       └── [id].tsx              # Fiche détaillée
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Primitives (Button, Input, Screen, EmptyState, Skeleton)
│   │   ├── restaurant/           # RestaurantCard, RatingBadge, PriceIndicator
│   │   ├── swipe/                # SwipeCard, SwipeStack, SwipeOverlay, SwipeActions
│   │   └── event/                # FriendListItem, FriendPickerGrid, filtres
│   ├── store/
│   │   ├── types.ts              # AppState, Action union
│   │   ├── reducer.ts            # Reducer pur + assertNever
│   │   ├── app-context.tsx       # Provider + useApp hook
│   │   └── selectors.ts          # Sélecteurs purs
│   ├── services/
│   │   ├── places/               # Client Google + nearby + details + mock
│   │   └── storage/              # Wrapper AsyncStorage + snapshot
│   ├── hooks/
│   │   ├── use-restaurants.ts    # Fetch + cache restos
│   │   ├── use-swipe-action.ts   # Orchestration swipe + match
│   │   ├── use-swipe-gesture.ts  # Pan gesture + reanimated
│   │   ├── use-location.ts       # Géoloc + fallback Paris
│   │   └── use-haptics.ts        # Wrapper haptics
│   ├── utils/
│   │   ├── factories.ts          # createUser, createEvent, createSwipe
│   │   ├── simulate-swipe.ts     # Algorithme déterministe ami simulé
│   │   ├── match.ts              # Détection de match (logique pure)
│   │   ├── friend-presets.ts     # 8 amis préfabriqués
│   │   └── maps.ts               # Construction URL Google Maps
│   ├── constants/
│   │   ├── config.ts             # Env vars + magic numbers
│   │   └── theme.ts              # Spacing, Radii, FontSize, Palette
│   └── types/
│       ├── models.ts             # User, Event, Restaurant, Match, etc.
│       └── api.ts                # Types réponses Google Places
│
└── assets/                       # Images, polices
```

**Règle d'or** : `app/` ne contient que des routes (orchestrateurs fins). Toute la logique métier vit dans `src/`.

## Setup

### Prérequis

- Node.js 20+
- npm 10+
- Expo Go installé sur ton téléphone (iOS / Android)

### Installation

```bash
npm install
```

### Variables d'environnement

```bash
cp .env.local.example .env.local
```

Puis édite `.env.local` :

```
EXPO_PUBLIC_GOOGLE_PLACES_KEY=<ta_clé_google_places>
```

Sans clé, l'app utilise des données mock (10 restaurants Paris en dur). Avec clé, elle interroge Google Places API en live.

### Configuration Google Cloud (si tu utilises l'API)

Sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials) :

1. Créer une clé API
2. Activer **Places API** et **Places API (New)**
3. Application restrictions :
   - "None" pour tests rapides en dev
   - Sinon : restreindre par bundle ID (`host.exp.Exponent` pour Expo Go)

### Lancement

```bash
npx expo start
```

Scanner le QR code avec l'app Expo Go.

## Commandes

| Commande | Effet |
| --- | --- |
| `npm start` | Démarre Metro + Expo |
| `npm run android` | Lance sur émulateur Android |
| `npm run ios` | Lance sur simulateur iOS |
| `npm run web` | Lance sur navigateur |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Vérification des types |

## Flow utilisateur

```
Auth (pseudo) → Liste events → Création event (filtres + amis)
                                    ↓
                                  Lobby
                                    ↓
                                  Swipe (cartes empilées)
                                    ↓
                                  Match → Google Maps
```

## Concepts techniques mis en œuvre

- **expo-router** : routes file-based, layouts imbriqués, segments dynamiques `[id]`, typed routes, `useLocalSearchParams`
- **State global** : Context API + `useReducer`, union discriminée typée + `assertNever` pour exhaustivité compile-time
- **Reanimated v4** : `useSharedValue`, `useAnimatedStyle`, `useAnimatedReaction`, `withSpring`, `withTiming`, `runOnJS`, layout animations (`FadeIn`, `FadeOut`, `LinearTransition`)
- **Gesture handler v2** : `Gesture.Pan()` avec callbacks worklets, `GestureDetector`
- **Custom hooks** : abstraction des fetchs, gestures, persistance, haptics, géoloc
- **Mémoïsation** : `useCallback` pour stabilité des refs, `useMemo` pour les sets de lookup
- **Persistance** : snapshot complet de l'`AppState` dans AsyncStorage, versionning + drop si schéma incompatible
- **Sélecteurs** : couche d'abstraction au-dessus du state pour éviter le couplage UI / structure interne
- **Fallback API** : si pas de clé Google, l'app fonctionne en mode mock (démo possible offline)
- **FlatList** : virtualisation pour la liste des events
- **Skeleton loaders** : pendant le fetch des restaurants

## Convention de commit

Conventional Commits via husky + commitlint :

```
type(scope): subject
```

Types : `feat`, `fix`, `refactor`, `chore`, `style`, `docs`, `test`, `build`, `ci`, `perf`, `revert`.
