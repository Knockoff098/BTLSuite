package com.whiteoutsurvival.data.repository

import com.whiteoutsurvival.data.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * Central repository for all game state mutations.
 * In a production app this would persist to Room DB; here we use in-memory state.
 */
class GameRepository {

    private val _gameState = MutableStateFlow(GameState())
    val gameState: StateFlow<GameState> = _gameState.asStateFlow()

    // --- Resource operations ---

    fun tickResources() {
        _gameState.update { state ->
            val modifier = state.warmthLevel.productionModifier
            val res = state.resources
            state.copy(
                resources = res.copy(
                    food = res.food + (res.foodPerMinute * modifier).toLong(),
                    wood = res.wood + (res.woodPerMinute * modifier).toLong(),
                    iron = res.iron + (res.ironPerMinute * modifier).toLong(),
                    coal = res.coal + (res.coalPerMinute * modifier).toLong()
                )
            )
        }
    }

    fun consumeCoalForWarmth() {
        _gameState.update { state ->
            val coalConsumed = (state.furnaceLevel * 2).toLong()
            val newCoal = maxOf(0L, state.resources.coal - coalConsumed)
            val tempChange = if (newCoal > 0) state.furnaceLevel else -5
            state.copy(
                resources = state.resources.copy(coal = newCoal),
                temperature = minOf(10, state.temperature + tempChange)
            )
        }
    }

    // --- Building operations ---

    fun upgradeBuilding(buildingId: String): Boolean {
        var success = false
        _gameState.update { state ->
            val building = state.buildings.find { it.id == buildingId } ?: return@update state
            val cost = building.upgradeCost()
            if (!state.resources.canAfford(cost) || building.level >= building.maxLevel) {
                return@update state
            }
            success = true
            val updatedBuildings = state.buildings.map {
                if (it.id == buildingId) {
                    it.copy(level = it.level + 1)
                } else it
            }

            // Recalculate production rates from buildings
            var foodRate = 2.0
            var woodRate = 2.0
            var ironRate = 0.5
            var coalRate = 1.0
            updatedBuildings.forEach { b ->
                b.productionPerMinute().forEach { (resource, amount) ->
                    when (resource) {
                        "food" -> foodRate += amount
                        "wood" -> woodRate += amount
                        "iron" -> ironRate += amount
                        "coal" -> coalRate += amount
                    }
                }
            }

            val furnaceLevel = updatedBuildings
                .find { it.type == BuildingType.FURNACE }?.level ?: state.furnaceLevel

            val shelterLevel = updatedBuildings
                .find { it.type == BuildingType.SHELTER }?.level ?: 1
            val maxPop = 20 + (shelterLevel * 10)

            state.copy(
                resources = state.resources.spend(cost).copy(
                    foodPerMinute = foodRate,
                    woodPerMinute = woodRate,
                    ironPerMinute = ironRate,
                    coalPerMinute = coalRate
                ),
                buildings = updatedBuildings,
                furnaceLevel = furnaceLevel,
                maxPopulation = maxPop
            )
        }
        return success
    }

    fun buildNewBuilding(type: BuildingType): Boolean {
        var success = false
        _gameState.update { state ->
            // Check if we already have this building (for unique buildings)
            val uniqueTypes = setOf(
                BuildingType.FURNACE, BuildingType.EMBASSY,
                BuildingType.RESEARCH_LAB, BuildingType.WAREHOUSE
            )
            if (type in uniqueTypes && state.buildings.any { it.type == type }) {
                return@update state
            }

            val newBuilding = Building(type = type, level = 1)
            val cost = newBuilding.upgradeCost()
            if (!state.resources.canAfford(cost)) return@update state

            success = true
            state.copy(
                resources = state.resources.spend(cost),
                buildings = state.buildings + newBuilding
            )
        }
        return success
    }

    // --- Hero operations ---

    fun recruitHero(): Hero? {
        val cost = ResourceCost(gems = 10)
        var recruited: Hero? = null
        _gameState.update { state ->
            if (!state.resources.canAfford(cost)) return@update state

            val available = HeroRoster.allHeroes.filter { roster ->
                state.heroes.none { it.name == roster.name }
            }
            if (available.isEmpty()) return@update state

            // Weighted random by rarity
            val weights = available.map { hero ->
                when (hero.rarity) {
                    HeroRarity.COMMON -> 40
                    HeroRarity.UNCOMMON -> 30
                    HeroRarity.RARE -> 18
                    HeroRarity.EPIC -> 9
                    HeroRarity.LEGENDARY -> 3
                }
            }
            val totalWeight = weights.sum()
            var roll = (0 until totalWeight).random()
            var selectedIndex = 0
            for (i in weights.indices) {
                roll -= weights[i]
                if (roll < 0) {
                    selectedIndex = i
                    break
                }
            }

            val newHero = available[selectedIndex].copy()
            recruited = newHero
            state.copy(
                resources = state.resources.spend(cost),
                heroes = state.heroes + newHero
            )
        }
        return recruited
    }

    fun levelUpHero(heroId: String): Boolean {
        var success = false
        _gameState.update { state ->
            val hero = state.heroes.find { it.id == heroId } ?: return@update state
            if (hero.level >= hero.maxLevel) return@update state

            val cost = ResourceCost(food = 50L * hero.level, gems = hero.level / 5)
            if (!state.resources.canAfford(cost)) return@update state

            success = true
            state.copy(
                resources = state.resources.spend(cost),
                heroes = state.heroes.map {
                    if (it.id == heroId) it.levelUp() else it
                }
            )
        }
        return success
    }

    fun deployHero(heroId: String) {
        _gameState.update { state ->
            state.copy(
                heroes = state.heroes.map {
                    if (it.id == heroId) it.copy(isDeployed = !it.isDeployed) else it
                }
            )
        }
    }

    // --- Troop operations ---

    fun trainTroops(type: TroopType, count: Int): Boolean {
        var success = false
        _gameState.update { state ->
            val batch = TroopBatch(type, count)
            if (!state.resources.canAfford(batch.trainingCost)) return@update state
            success = true
            state.copy(
                resources = state.resources.spend(batch.trainingCost),
                army = state.army.addTroops(type, count)
            )
        }
        return success
    }

    fun healTroops(type: TroopType, count: Int): Boolean {
        var success = false
        _gameState.update { state ->
            val cost = ResourceCost(food = 5L * count)
            if (!state.resources.canAfford(cost)) return@update state
            success = true
            state.copy(
                resources = state.resources.spend(cost),
                army = state.army.healWounded(type, count)
            )
        }
        return success
    }

    // --- Expedition operations ---

    fun startExpedition(type: ExpeditionType, heroId: String?): Boolean {
        var success = false
        _gameState.update { state ->
            if (state.expeditions.count { it.isActive } >= 3) return@update state

            val expedition = ExpeditionTemplates.createExpedition(type, state.furnaceLevel)
                .copy(heroId = heroId, isActive = true)
            success = true
            state.copy(expeditions = state.expeditions + expedition)
        }
        return success
    }

    fun tickExpeditions() {
        _gameState.update { state ->
            state.copy(
                expeditions = state.expeditions.map { exp ->
                    if (exp.isActive && exp.remainingSeconds > 0) {
                        exp.copy(remainingSeconds = exp.remainingSeconds - 1)
                    } else exp
                }
            )
        }
    }

    fun collectExpedition(expeditionId: String): Boolean {
        var success = false
        _gameState.update { state ->
            val expedition = state.expeditions.find { it.id == expeditionId } ?: return@update state
            if (!expedition.isComplete) return@update state

            success = true
            state.copy(
                resources = state.resources.earn(expedition.rewards),
                expeditions = state.expeditions.filter { it.id != expeditionId }
            )
        }
        return success
    }

    // --- Day progression ---

    fun advanceDay() {
        _gameState.update { state ->
            val foodCost = state.population * 2L
            val newFood = maxOf(0L, state.resources.food - foodCost)
            val tempDrop = if (newFood == 0L) -5 else 0

            state.copy(
                daysSurvived = state.daysSurvived + 1,
                resources = state.resources.copy(food = newFood),
                temperature = state.temperature + tempDrop - 1 // gets colder each day
            )
        }
    }
}
