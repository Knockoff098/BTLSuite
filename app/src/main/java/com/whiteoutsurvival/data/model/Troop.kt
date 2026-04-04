package com.whiteoutsurvival.data.model

/**
 * Troops can be trained in military buildings and deployed with heroes.
 */
data class TroopBatch(
    val type: TroopType,
    val count: Int,
    val tier: Int = 1
) {
    val totalPower: Int get() = type.basePower * tier * count

    val trainingCost: ResourceCost get() {
        val multiplier = tier.toLong()
        return when (type) {
            TroopType.INFANTRY -> ResourceCost(
                food = 10 * multiplier * count,
                wood = 5 * multiplier * count
            )
            TroopType.MARKSMAN -> ResourceCost(
                food = 8 * multiplier * count,
                wood = 8 * multiplier * count,
                iron = 3 * multiplier * count
            )
            TroopType.LANCER -> ResourceCost(
                food = 12 * multiplier * count,
                iron = 6 * multiplier * count
            )
        }
    }

    val trainingTimeSeconds: Long get() = (30L * tier * count)
}

enum class TroopType(
    val displayName: String,
    val basePower: Int,
    val icon: String
) {
    INFANTRY("Infantry", 10, "\u2694\uFE0F"),
    MARKSMAN("Marksman", 12, "\uD83C\uDFF9"),
    LANCER("Lancer", 11, "\uD83D\uDDE1\uFE0F")
}

/**
 * Player's overall army composition.
 */
data class Army(
    val infantry: Int = 0,
    val marksmen: Int = 0,
    val lancers: Int = 0,
    val woundedInfantry: Int = 0,
    val woundedMarksmen: Int = 0,
    val woundedLancers: Int = 0
) {
    val totalTroops: Int get() = infantry + marksmen + lancers
    val totalWounded: Int get() = woundedInfantry + woundedMarksmen + woundedLancers
    val totalPower: Int get() = (infantry * TroopType.INFANTRY.basePower) +
            (marksmen * TroopType.MARKSMAN.basePower) +
            (lancers * TroopType.LANCER.basePower)

    fun addTroops(type: TroopType, count: Int): Army {
        return when (type) {
            TroopType.INFANTRY -> copy(infantry = infantry + count)
            TroopType.MARKSMAN -> copy(marksmen = marksmen + count)
            TroopType.LANCER -> copy(lancers = lancers + count)
        }
    }

    fun healWounded(type: TroopType, count: Int): Army {
        return when (type) {
            TroopType.INFANTRY -> copy(
                infantry = infantry + minOf(count, woundedInfantry),
                woundedInfantry = maxOf(0, woundedInfantry - count)
            )
            TroopType.MARKSMAN -> copy(
                marksmen = marksmen + minOf(count, woundedMarksmen),
                woundedMarksmen = maxOf(0, woundedMarksmen - count)
            )
            TroopType.LANCER -> copy(
                lancers = lancers + minOf(count, woundedLancers),
                woundedLancers = maxOf(0, woundedLancers - count)
            )
        }
    }
}
