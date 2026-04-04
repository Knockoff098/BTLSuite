package com.whiteoutsurvival.data.model

import org.junit.Assert.*
import org.junit.Test

class HeroTest {

    private fun createHero(level: Int = 1, rarity: HeroRarity = HeroRarity.COMMON) = Hero(
        name = "Test",
        rarity = rarity,
        heroClass = HeroClass.INFANTRY,
        level = level,
        attack = 10,
        defense = 10,
        health = 20,
        skill = HeroSkill("Test Skill", "Does something", 5)
    )

    @Test
    fun `power scales with level`() {
        val hero1 = createHero(level = 1)
        val hero5 = createHero(level = 5)
        assertTrue(hero5.power > hero1.power)
    }

    @Test
    fun `levelUp increases stats`() {
        val hero = createHero(level = 1, rarity = HeroRarity.RARE)
        val leveled = hero.levelUp()
        assertEquals(2, leveled.level)
        assertTrue(leveled.attack > hero.attack)
        assertTrue(leveled.defense > hero.defense)
        assertTrue(leveled.health > hero.health)
    }

    @Test
    fun `levelUp does not exceed max level`() {
        val hero = createHero(level = 40, rarity = HeroRarity.COMMON)
        val leveled = hero.levelUp()
        assertEquals(40, leveled.level) // COMMON max is 40
    }

    @Test
    fun `experience to next level scales with level`() {
        val hero1 = createHero(level = 1)
        val hero10 = createHero(level = 10)
        assertTrue(hero10.experienceToNextLevel > hero1.experienceToNextLevel)
    }

    @Test
    fun `hero roster contains all expected heroes`() {
        assertTrue(HeroRoster.allHeroes.size >= 10)
        assertTrue(HeroRoster.allHeroes.any { it.rarity == HeroRarity.LEGENDARY })
    }
}
