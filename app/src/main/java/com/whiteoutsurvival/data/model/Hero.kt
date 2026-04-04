package com.whiteoutsurvival.data.model

import java.util.UUID

/**
 * Heroes lead troops, provide buffs, and can be sent on expeditions.
 * Inspired by Whiteout Survival's hero gacha and progression system.
 */
data class Hero(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val rarity: HeroRarity,
    val heroClass: HeroClass,
    val level: Int = 1,
    val experience: Long = 0L,
    val attack: Int,
    val defense: Int,
    val health: Int,
    val skill: HeroSkill,
    val isDeployed: Boolean = false
) {
    val maxLevel: Int get() = rarity.maxLevel

    val power: Int get() = (attack + defense + health) * level

    val experienceToNextLevel: Long get() = (100L * level * level)

    fun levelUp(): Hero {
        if (level >= maxLevel) return this
        return copy(
            level = level + 1,
            attack = attack + rarity.statGrowth,
            defense = defense + rarity.statGrowth,
            health = health + (rarity.statGrowth * 2),
            experience = 0L
        )
    }

    fun addExperience(amount: Long): Hero {
        val newExp = experience + amount
        return if (newExp >= experienceToNextLevel && level < maxLevel) {
            copy(experience = newExp - experienceToNextLevel).levelUp()
        } else {
            copy(experience = newExp)
        }
    }
}

enum class HeroRarity(
    val displayName: String,
    val maxLevel: Int,
    val statGrowth: Int,
    val colorHex: Long
) {
    COMMON("Common", 40, 2, 0xFF9E9E9E),
    UNCOMMON("Uncommon", 50, 3, 0xFF4CAF50),
    RARE("Rare", 60, 4, 0xFF2196F3),
    EPIC("Epic", 70, 6, 0xFF9C27B0),
    LEGENDARY("Legendary", 80, 8, 0xFFFF9800)
}

enum class HeroClass(val displayName: String) {
    INFANTRY("Infantry"),
    MARKSMAN("Marksman"),
    LANCER("Lancer")
}

data class HeroSkill(
    val name: String,
    val description: String,
    val cooldownSeconds: Int
)

/**
 * Predefined hero roster that can be recruited.
 */
object HeroRoster {
    val allHeroes: List<Hero> = listOf(
        Hero(
            name = "Sergei",
            rarity = HeroRarity.LEGENDARY,
            heroClass = HeroClass.INFANTRY,
            attack = 45,
            defense = 40,
            health = 120,
            skill = HeroSkill("Frozen Fury", "Deals 200% ATK damage to all enemies and freezes them for 3s.", 15)
        ),
        Hero(
            name = "Natalia",
            rarity = HeroRarity.LEGENDARY,
            heroClass = HeroClass.MARKSMAN,
            attack = 55,
            defense = 25,
            health = 90,
            skill = HeroSkill("Blizzard Shot", "Fires a piercing ice arrow dealing 250% ATK damage.", 12)
        ),
        Hero(
            name = "Viktor",
            rarity = HeroRarity.EPIC,
            heroClass = HeroClass.LANCER,
            attack = 38,
            defense = 45,
            health = 110,
            skill = HeroSkill("Ice Wall", "Creates a barrier absorbing 300% DEF damage for 5s.", 18)
        ),
        Hero(
            name = "Elena",
            rarity = HeroRarity.EPIC,
            heroClass = HeroClass.MARKSMAN,
            attack = 42,
            defense = 28,
            health = 85,
            skill = HeroSkill("Frost Volley", "Fires 5 arrows dealing 80% ATK each to random targets.", 10)
        ),
        Hero(
            name = "Boris",
            rarity = HeroRarity.RARE,
            heroClass = HeroClass.INFANTRY,
            attack = 30,
            defense = 35,
            health = 95,
            skill = HeroSkill("Rally Cry", "Boosts all troops ATK by 20% for 8s.", 20)
        ),
        Hero(
            name = "Anya",
            rarity = HeroRarity.RARE,
            heroClass = HeroClass.LANCER,
            attack = 32,
            defense = 30,
            health = 88,
            skill = HeroSkill("Spear Thrust", "Piercing attack dealing 180% ATK to a line.", 8)
        ),
        Hero(
            name = "Dmitri",
            rarity = HeroRarity.UNCOMMON,
            heroClass = HeroClass.INFANTRY,
            attack = 22,
            defense = 25,
            health = 75,
            skill = HeroSkill("Shield Bash", "Stuns target for 2s and deals 120% ATK.", 10)
        ),
        Hero(
            name = "Mila",
            rarity = HeroRarity.UNCOMMON,
            heroClass = HeroClass.MARKSMAN,
            attack = 28,
            defense = 18,
            health = 60,
            skill = HeroSkill("Quick Shot", "Fires 3 rapid arrows dealing 60% ATK each.", 6)
        ),
        Hero(
            name = "Ivan",
            rarity = HeroRarity.COMMON,
            heroClass = HeroClass.INFANTRY,
            attack = 15,
            defense = 18,
            health = 55,
            skill = HeroSkill("Slash", "Basic attack dealing 130% ATK damage.", 5)
        ),
        Hero(
            name = "Olga",
            rarity = HeroRarity.COMMON,
            heroClass = HeroClass.LANCER,
            attack = 16,
            defense = 16,
            health = 50,
            skill = HeroSkill("Poke", "Quick strike dealing 125% ATK damage.", 5)
        )
    )
}
