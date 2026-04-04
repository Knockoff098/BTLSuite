package com.whiteoutsurvival.data.model

/**
 * Core resource types in the survival game.
 * Players must manage these to keep their settlement alive.
 */
data class Resources(
    val food: Long = 500L,
    val wood: Long = 500L,
    val iron: Long = 200L,
    val coal: Long = 300L,
    val gems: Int = 50,
    val foodPerMinute: Double = 2.0,
    val woodPerMinute: Double = 2.0,
    val ironPerMinute: Double = 0.5,
    val coalPerMinute: Double = 1.0
) {
    fun canAfford(cost: ResourceCost): Boolean {
        return food >= cost.food &&
                wood >= cost.wood &&
                iron >= cost.iron &&
                coal >= cost.coal &&
                gems >= cost.gems
    }

    fun spend(cost: ResourceCost): Resources {
        return copy(
            food = food - cost.food,
            wood = wood - cost.wood,
            iron = iron - cost.iron,
            coal = coal - cost.coal,
            gems = gems - cost.gems
        )
    }

    fun earn(reward: ResourceCost): Resources {
        return copy(
            food = food + reward.food,
            wood = wood + reward.wood,
            iron = iron + reward.iron,
            coal = coal + reward.coal,
            gems = gems + reward.gems
        )
    }
}

data class ResourceCost(
    val food: Long = 0L,
    val wood: Long = 0L,
    val iron: Long = 0L,
    val coal: Long = 0L,
    val gems: Int = 0
)
