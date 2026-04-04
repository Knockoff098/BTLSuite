# Whiteout Survival Clone

A Whiteout Survival-inspired Android game built with Kotlin and Jetpack Compose. Survive the frozen wasteland by managing resources, building your settlement, recruiting heroes, training troops, and exploring the world.

## Features

### Settlement Management
- **Furnace System** - Keep your settlement warm by burning coal. Temperature affects production rates.
- **Resource Production** - Build and upgrade Cookhouses, Sawmills, Iron Mines, and Coal Mines.
- **Day/Night Cycle** - Advance days to progress; each day consumes food and lowers temperature.

### Buildings (15 Types)
| Category | Buildings |
|----------|-----------|
| Core | Furnace, Shelter, Warehouse, Research Lab |
| Resource | Cookhouse, Sawmill, Iron Mine, Coal Mine |
| Military | Barracks, Range, Garage, Hospital |
| Defense | Watchtower, Wall |
| Social | Embassy |

### Hero System
- **10 unique heroes** across 5 rarity tiers (Common to Legendary)
- **3 hero classes**: Infantry, Marksman, Lancer
- **Gacha recruitment** with weighted rarity drops
- **Level up** heroes to increase stats and power
- **Deploy** heroes to lead troops or send on expeditions

### Army & Troops
- **3 troop types**: Infantry, Marksman, Lancer
- **Train** troops using resources
- **Heal** wounded troops at the Hospital
- **Army power** calculated from troop composition

### Exploration
- **6 expedition types**: Food/Wood/Iron gathering, Beast Hunt, Ruins Exploration, Rescue Mission
- **Up to 3 concurrent** expeditions
- **Assign heroes** for better rewards
- **Real-time countdown** with progress tracking

### Survival Mechanics
- **Temperature system** with 5 warmth levels (Warm, Mild, Cold, Freezing, Deadly)
- **Production modifiers** based on warmth (20% to 120%)
- **Coal consumption** to maintain warmth
- **Food consumption** per population each day

## Tech Stack

- **Language**: Kotlin
- **UI**: Jetpack Compose + Material 3
- **Architecture**: MVVM (ViewModel + StateFlow)
- **Min SDK**: 26 (Android 8.0)
- **Target SDK**: 34 (Android 14)

## Project Structure

```
app/src/main/java/com/whiteoutsurvival/
├── data/
│   ├── model/
│   │   ├── Building.kt          # 15 building types with upgrade costs & production
│   │   ├── Exploration.kt       # 6 expedition types with rewards
│   │   ├── GameState.kt         # Top-level game state
│   │   ├── Hero.kt              # Hero system with 10 heroes, skills, classes
│   │   ├── Resources.kt         # Resource management (food, wood, iron, coal, gems)
│   │   └── Troop.kt             # Army composition and troop training
│   └── repository/
│       └── GameRepository.kt    # Central state management
├── ui/
│   ├── components/
│   │   ├── GameCards.kt          # Building, Hero, Expedition card components
│   │   └── ResourceBar.kt       # Top resource display bar
│   ├── navigation/
│   │   └── NavGraph.kt          # Bottom navigation with 5 tabs
│   ├── screens/
│   │   ├── BuildScreen.kt       # Building management & construction
│   │   ├── ExplorationScreen.kt # Expedition management
│   │   ├── HeroScreen.kt        # Hero recruitment & management
│   │   ├── HomeScreen.kt        # Settlement overview & day progression
│   │   └── TroopScreen.kt       # Army training & healing
│   ├── theme/
│   │   ├── Color.kt             # Icy/frozen color palette
│   │   └── Theme.kt             # Material 3 dark theme
│   └── viewmodel/
│       └── GameViewModel.kt     # Game loop & action dispatch
├── MainActivity.kt
└── WhiteoutApp.kt
```

## Building

```bash
# Build debug APK
./gradlew assembleDebug

# Run unit tests
./gradlew test

# Install on connected device
./gradlew installDebug
```

## Future Improvements

- Room database for persistent game state
- Alliance/multiplayer system
- PvP battles with matchmaking
- Push notifications for expedition completion
- Sound effects and background music
- Animated weather effects
- Achievement system
- Daily login rewards
