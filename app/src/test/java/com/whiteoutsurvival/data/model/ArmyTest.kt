package com.whiteoutsurvival.data.model

import org.junit.Assert.*
import org.junit.Test

class ArmyTest {

    @Test
    fun `addTroops increases correct troop count`() {
        val army = Army()
        val updated = army.addTroops(TroopType.INFANTRY, 50)
        assertEquals(50, updated.infantry)
        assertEquals(0, updated.marksmen)
    }

    @Test
    fun `totalPower computes correctly`() {
        val army = Army(infantry = 10, marksmen = 5, lancers = 3)
        val expected = (10 * 10) + (5 * 12) + (3 * 11) // basePower values
        assertEquals(expected, army.totalPower)
    }

    @Test
    fun `healWounded moves troops from wounded to active`() {
        val army = Army(infantry = 10, woundedInfantry = 5)
        val healed = army.healWounded(TroopType.INFANTRY, 3)
        assertEquals(13, healed.infantry)
        assertEquals(2, healed.woundedInfantry)
    }

    @Test
    fun `healWounded does not heal more than wounded count`() {
        val army = Army(infantry = 10, woundedInfantry = 2)
        val healed = army.healWounded(TroopType.INFANTRY, 10)
        assertEquals(12, healed.infantry)
        assertEquals(0, healed.woundedInfantry)
    }

    @Test
    fun `totalTroops sums all active units`() {
        val army = Army(infantry = 10, marksmen = 20, lancers = 30)
        assertEquals(60, army.totalTroops)
    }
}
