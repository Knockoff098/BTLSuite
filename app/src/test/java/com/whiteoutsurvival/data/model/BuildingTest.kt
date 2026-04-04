package com.whiteoutsurvival.data.model

import org.junit.Assert.*
import org.junit.Test

class BuildingTest {

    @Test
    fun `building has correct display name`() {
        val building = Building(type = BuildingType.FURNACE)
        assertEquals("Furnace", building.displayName)
    }

    @Test
    fun `upgrade cost scales with level`() {
        val level1 = Building(type = BuildingType.COOKHOUSE, level = 1)
        val level2 = Building(type = BuildingType.COOKHOUSE, level = 2)
        assertTrue(level2.upgradeCost().wood > level1.upgradeCost().wood)
    }

    @Test
    fun `production increases with level`() {
        val level1 = Building(type = BuildingType.COOKHOUSE, level = 1)
        val level5 = Building(type = BuildingType.COOKHOUSE, level = 5)
        val prod1 = level1.productionPerMinute()["food"] ?: 0.0
        val prod5 = level5.productionPerMinute()["food"] ?: 0.0
        assertTrue(prod5 > prod1)
    }

    @Test
    fun `non-resource buildings have empty production`() {
        val barracks = Building(type = BuildingType.BARRACKS)
        assertTrue(barracks.productionPerMinute().isEmpty())
    }

    @Test
    fun `upgrade time scales quadratically`() {
        val level1 = Building(type = BuildingType.FURNACE, level = 1)
        val level3 = Building(type = BuildingType.FURNACE, level = 3)
        assertEquals(60L, level1.upgradeTimeSeconds())
        assertEquals(540L, level3.upgradeTimeSeconds())
    }
}
