package com.whiteoutsurvival.data.repository

import com.whiteoutsurvival.data.model.*
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class GameRepositoryTest {

    private lateinit var repo: GameRepository

    @Before
    fun setup() {
        repo = GameRepository()
    }

    @Test
    fun `initial state has default buildings`() {
        val state = repo.gameState.value
        assertTrue(state.buildings.any { it.type == BuildingType.FURNACE })
        assertTrue(state.buildings.any { it.type == BuildingType.COOKHOUSE })
        assertTrue(state.buildings.any { it.type == BuildingType.SAWMILL })
        assertTrue(state.buildings.any { it.type == BuildingType.SHELTER })
    }

    @Test
    fun `tickResources increases resource amounts`() {
        val before = repo.gameState.value.resources.food
        repo.tickResources()
        val after = repo.gameState.value.resources.food
        assertTrue(after > before)
    }

    @Test
    fun `upgradeBuilding increases level and spends resources`() {
        val state = repo.gameState.value
        val furnace = state.buildings.first { it.type == BuildingType.FURNACE }
        val success = repo.upgradeBuilding(furnace.id)
        assertTrue(success)
        val updated = repo.gameState.value.buildings.first { it.type == BuildingType.FURNACE }
        assertEquals(2, updated.level)
    }

    @Test
    fun `buildNewBuilding adds a building`() {
        val before = repo.gameState.value.buildings.size
        repo.buildNewBuilding(BuildingType.BARRACKS)
        val after = repo.gameState.value.buildings.size
        assertEquals(before + 1, after)
    }

    @Test
    fun `trainTroops adds troops and spends resources`() {
        val success = repo.trainTroops(TroopType.INFANTRY, 10)
        assertTrue(success)
        assertEquals(10, repo.gameState.value.army.infantry)
    }

    @Test
    fun `advanceDay increments day count`() {
        val before = repo.gameState.value.daysSurvived
        repo.advanceDay()
        assertEquals(before + 1, repo.gameState.value.daysSurvived)
    }

    @Test
    fun `startExpedition adds active expedition`() {
        val success = repo.startExpedition(ExpeditionType.GATHER_FOOD, null)
        assertTrue(success)
        assertEquals(1, repo.gameState.value.expeditions.count { it.isActive })
    }

    @Test
    fun `cannot start more than 3 expeditions`() {
        repo.startExpedition(ExpeditionType.GATHER_FOOD, null)
        repo.startExpedition(ExpeditionType.GATHER_WOOD, null)
        repo.startExpedition(ExpeditionType.GATHER_IRON, null)
        val fourth = repo.startExpedition(ExpeditionType.BEAST_HUNT, null)
        assertFalse(fourth)
    }
}
