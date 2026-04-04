package com.whiteoutsurvival.data.model

import java.util.UUID

/**
 * Represents a building in the player's settlement.
 * Buildings provide resources, shelter, troop capacity, etc.
 */
data class Building(
    val id: String = UUID.randomUUID().toString(),
    val type: BuildingType,
    val level: Int = 1,
    val isUpgrading: Boolean = false,
    val upgradeTimeRemainingSeconds: Long = 0L
) {
    val maxLevel: Int get() = 30

    val displayName: String get() = type.displayName

    val description: String get() = when (type) {
        BuildingType.FURNACE -> "Keeps your settlement warm. Upgrade to increase temperature and unlock buildings."
        BuildingType.COOKHOUSE -> "Produces food for your survivors. Higher levels increase production."
        BuildingType.SAWMILL -> "Produces wood for construction. Higher levels increase production."
        BuildingType.IRON_MINE -> "Extracts iron ore for advanced buildings and equipment."
        BuildingType.COAL_MINE -> "Mines coal to fuel the furnace and keep warmth levels up."
        BuildingType.BARRACKS -> "Train infantry troops to defend your settlement."
        BuildingType.RANGE -> "Train ranged troops for long-distance attacks."
        BuildingType.GARAGE -> "Build and maintain vehicles for exploration."
        BuildingType.HOSPITAL -> "Heals wounded troops after battles."
        BuildingType.WATCHTOWER -> "Provides early warning of incoming attacks."
        BuildingType.SHELTER -> "Houses survivors. Upgrade to increase population capacity."
        BuildingType.WAREHOUSE -> "Stores resources safely. Protects from raids."
        BuildingType.EMBASSY -> "Allows alliance interactions and reinforcements."
        BuildingType.RESEARCH_LAB -> "Research technologies to improve your settlement."
        BuildingType.WALL -> "Defends your settlement from attackers."
    }

    val icon: String get() = when (type) {
        BuildingType.FURNACE -> "\uD83D\uDD25"
        BuildingType.COOKHOUSE -> "\uD83C\uDF73"
        BuildingType.SAWMILL -> "\uD83E\uDE93"
        BuildingType.IRON_MINE -> "\u26CF\uFE0F"
        BuildingType.COAL_MINE -> "\u26AB"
        BuildingType.BARRACKS -> "\u2694\uFE0F"
        BuildingType.RANGE -> "\uD83C\uDFF9"
        BuildingType.GARAGE -> "\uD83D\uDE97"
        BuildingType.HOSPITAL -> "\uD83C\uDFE5"
        BuildingType.WATCHTOWER -> "\uD83D\uDDFC"
        BuildingType.SHELTER -> "\uD83C\uDFE0"
        BuildingType.WAREHOUSE -> "\uD83C\uDFED"
        BuildingType.EMBASSY -> "\uD83C\uDFDB\uFE0F"
        BuildingType.RESEARCH_LAB -> "\uD83D\uDD2C"
        BuildingType.WALL -> "\uD83E\uDDF1"
    }

    fun upgradeCost(): ResourceCost {
        val multiplier = level.toLong()
        return when (type) {
            BuildingType.FURNACE -> ResourceCost(
                wood = 200 * multiplier,
                coal = 150 * multiplier,
                iron = 100 * multiplier
            )
            BuildingType.COOKHOUSE -> ResourceCost(
                wood = 100 * multiplier,
                iron = 50 * multiplier
            )
            BuildingType.SAWMILL -> ResourceCost(
                food = 80 * multiplier,
                iron = 40 * multiplier
            )
            BuildingType.IRON_MINE -> ResourceCost(
                food = 120 * multiplier,
                wood = 120 * multiplier
            )
            BuildingType.COAL_MINE -> ResourceCost(
                food = 100 * multiplier,
                wood = 100 * multiplier
            )
            BuildingType.BARRACKS -> ResourceCost(
                food = 150 * multiplier,
                wood = 150 * multiplier,
                iron = 80 * multiplier
            )
            BuildingType.RANGE -> ResourceCost(
                food = 150 * multiplier,
                wood = 120 * multiplier,
                iron = 100 * multiplier
            )
            BuildingType.GARAGE -> ResourceCost(
                wood = 200 * multiplier,
                iron = 200 * multiplier,
                coal = 100 * multiplier
            )
            BuildingType.HOSPITAL -> ResourceCost(
                food = 120 * multiplier,
                wood = 80 * multiplier
            )
            BuildingType.WATCHTOWER -> ResourceCost(
                wood = 100 * multiplier,
                iron = 60 * multiplier
            )
            BuildingType.SHELTER -> ResourceCost(
                wood = 150 * multiplier,
                coal = 80 * multiplier
            )
            BuildingType.WAREHOUSE -> ResourceCost(
                wood = 180 * multiplier,
                iron = 90 * multiplier
            )
            BuildingType.EMBASSY -> ResourceCost(
                food = 200 * multiplier,
                wood = 200 * multiplier,
                iron = 150 * multiplier
            )
            BuildingType.RESEARCH_LAB -> ResourceCost(
                food = 250 * multiplier,
                wood = 200 * multiplier,
                iron = 200 * multiplier
            )
            BuildingType.WALL -> ResourceCost(
                wood = 120 * multiplier,
                iron = 120 * multiplier
            )
        }
    }

    fun upgradeTimeSeconds(): Long {
        return (60L * level * level) // Quadratic scaling
    }

    fun productionPerMinute(): Map<String, Double> {
        val base = level * 1.5
        return when (type) {
            BuildingType.COOKHOUSE -> mapOf("food" to base)
            BuildingType.SAWMILL -> mapOf("wood" to base)
            BuildingType.IRON_MINE -> mapOf("iron" to base * 0.5)
            BuildingType.COAL_MINE -> mapOf("coal" to base * 0.7)
            else -> emptyMap()
        }
    }
}

enum class BuildingType(val displayName: String, val category: BuildingCategory) {
    FURNACE("Furnace", BuildingCategory.CORE),
    COOKHOUSE("Cookhouse", BuildingCategory.RESOURCE),
    SAWMILL("Sawmill", BuildingCategory.RESOURCE),
    IRON_MINE("Iron Mine", BuildingCategory.RESOURCE),
    COAL_MINE("Coal Mine", BuildingCategory.RESOURCE),
    BARRACKS("Barracks", BuildingCategory.MILITARY),
    RANGE("Range", BuildingCategory.MILITARY),
    GARAGE("Garage", BuildingCategory.MILITARY),
    HOSPITAL("Hospital", BuildingCategory.MILITARY),
    WATCHTOWER("Watchtower", BuildingCategory.DEFENSE),
    SHELTER("Shelter", BuildingCategory.CORE),
    WAREHOUSE("Warehouse", BuildingCategory.CORE),
    EMBASSY("Embassy", BuildingCategory.SOCIAL),
    RESEARCH_LAB("Research Lab", BuildingCategory.CORE),
    WALL("Wall", BuildingCategory.DEFENSE)
}

enum class BuildingCategory(val displayName: String) {
    CORE("Core"),
    RESOURCE("Resource"),
    MILITARY("Military"),
    DEFENSE("Defense"),
    SOCIAL("Social")
}
