package com.whiteoutsurvival.data.model

import java.util.UUID

/**
 * Exploration missions send heroes and troops to gather resources,
 * fight beasts, or discover new areas in the frozen wasteland.
 */
data class Expedition(
    val id: String = UUID.randomUUID().toString(),
    val type: ExpeditionType,
    val heroId: String? = null,
    val troopsSent: Int = 0,
    val durationSeconds: Long,
    val remainingSeconds: Long,
    val isActive: Boolean = false,
    val rewards: ResourceCost = ResourceCost()
) {
    val isComplete: Boolean get() = isActive && remainingSeconds <= 0

    val progressPercent: Float get() {
        if (durationSeconds <= 0) return 1f
        return 1f - (remainingSeconds.toFloat() / durationSeconds.toFloat())
    }
}

enum class ExpeditionType(
    val displayName: String,
    val description: String,
    val icon: String
) {
    GATHER_FOOD("Food Expedition", "Scout the frozen plains for edible plants and wildlife.", "\uD83C\uDF3E"),
    GATHER_WOOD("Lumber Expedition", "Venture into the frozen forest to gather timber.", "\uD83C\uDF32"),
    GATHER_IRON("Mining Expedition", "Explore abandoned mines for iron deposits.", "\u26CF\uFE0F"),
    BEAST_HUNT("Beast Hunt", "Track and fight dangerous frost beasts for rewards.", "\uD83D\uDC3B"),
    RUINS_EXPLORE("Ruins Exploration", "Explore ancient ruins for rare treasures and gems.", "\uD83C\uDFDA\uFE0F"),
    RESCUE_MISSION("Rescue Mission", "Rescue stranded survivors to grow your settlement.", "\uD83C\uDD98")
}

object ExpeditionTemplates {
    fun createExpedition(type: ExpeditionType, furnaceLevel: Int): Expedition {
        val baseReward = furnaceLevel * 50L
        val duration = when (type) {
            ExpeditionType.GATHER_FOOD -> 300L
            ExpeditionType.GATHER_WOOD -> 300L
            ExpeditionType.GATHER_IRON -> 600L
            ExpeditionType.BEAST_HUNT -> 900L
            ExpeditionType.RUINS_EXPLORE -> 1200L
            ExpeditionType.RESCUE_MISSION -> 1800L
        }
        val rewards = when (type) {
            ExpeditionType.GATHER_FOOD -> ResourceCost(food = baseReward * 3)
            ExpeditionType.GATHER_WOOD -> ResourceCost(wood = baseReward * 3)
            ExpeditionType.GATHER_IRON -> ResourceCost(iron = baseReward * 2)
            ExpeditionType.BEAST_HUNT -> ResourceCost(
                food = baseReward,
                wood = baseReward,
                gems = furnaceLevel
            )
            ExpeditionType.RUINS_EXPLORE -> ResourceCost(
                iron = baseReward,
                gems = furnaceLevel * 2
            )
            ExpeditionType.RESCUE_MISSION -> ResourceCost(
                food = baseReward * 2,
                wood = baseReward * 2,
                iron = baseReward,
                gems = furnaceLevel * 3
            )
        }
        return Expedition(
            type = type,
            durationSeconds = duration,
            remainingSeconds = duration,
            rewards = rewards
        )
    }
}
