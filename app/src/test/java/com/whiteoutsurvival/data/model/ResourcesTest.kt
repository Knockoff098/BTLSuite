package com.whiteoutsurvival.data.model

import org.junit.Assert.*
import org.junit.Test

class ResourcesTest {

    @Test
    fun `canAfford returns true when resources are sufficient`() {
        val resources = Resources(food = 100, wood = 100, iron = 100, coal = 100, gems = 10)
        val cost = ResourceCost(food = 50, wood = 50, iron = 50, coal = 50, gems = 5)
        assertTrue(resources.canAfford(cost))
    }

    @Test
    fun `canAfford returns false when resources are insufficient`() {
        val resources = Resources(food = 10, wood = 100, iron = 100, coal = 100, gems = 10)
        val cost = ResourceCost(food = 50)
        assertFalse(resources.canAfford(cost))
    }

    @Test
    fun `spend deducts resources correctly`() {
        val resources = Resources(food = 100, wood = 200, iron = 50)
        val cost = ResourceCost(food = 30, wood = 50)
        val result = resources.spend(cost)
        assertEquals(70L, result.food)
        assertEquals(150L, result.wood)
        assertEquals(50L, result.iron)
    }

    @Test
    fun `earn adds resources correctly`() {
        val resources = Resources(food = 100, gems = 5)
        val reward = ResourceCost(food = 50, gems = 10)
        val result = resources.earn(reward)
        assertEquals(150L, result.food)
        assertEquals(15, result.gems)
    }
}
