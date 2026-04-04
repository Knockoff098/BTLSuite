package com.whiteoutsurvival.data.model

/**
 * Top-level game state that holds everything about the player's settlement.
 */
data class GameState(
    val settlementName: String = "Frosthold",
    val furnaceLevel: Int = 1,
    val temperature: Int = -20,
    val resources: Resources = Resources(),
    val buildings: List<Building> = defaultBuildings(),
    val heroes: List<Hero> = listOf(),
    val army: Army = Army(),
    val expeditions: List<Expedition> = listOf(),
    val population: Int = 10,
    val maxPopulation: Int = 20,
    val daysSurvived: Int = 1
) {
    val totalPower: Long
        get() = army.totalPower.toLong() +
                heroes.sumOf { it.power.toLong() } +
                buildings.sumOf { it.level.toLong() * 100 }

    val warmthLevel: WarmthLevel
        get() = when {
            temperature >= 0 -> WarmthLevel.WARM
            temperature >= -10 -> WarmthLevel.MILD
            temperature >= -20 -> WarmthLevel.COLD
            temperature >= -30 -> WarmthLevel.FREEZING
            else -> WarmthLevel.DEADLY
        }
}

enum class WarmthLevel(
    val displayName: String,
    val colorHex: Long,
    val productionModifier: Double
) {
    WARM("Warm", 0xFFFF9800, 1.2),
    MILD("Mild", 0xFF4CAF50, 1.0),
    COLD("Cold", 0xFF2196F3, 0.8),
    FREEZING("Freezing", 0xFF9C27B0, 0.5),
    DEADLY("Deadly", 0xFFF44336, 0.2)
}

fun defaultBuildings(): List<Building> = listOf(
    Building(type = BuildingType.FURNACE, level = 1),
    Building(type = BuildingType.COOKHOUSE, level = 1),
    Building(type = BuildingType.SAWMILL, level = 1),
    Building(type = BuildingType.SHELTER, level = 1)
)
