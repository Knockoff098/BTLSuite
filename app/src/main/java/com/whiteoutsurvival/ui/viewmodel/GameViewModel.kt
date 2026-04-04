package com.whiteoutsurvival.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.whiteoutsurvival.data.model.*
import com.whiteoutsurvival.data.repository.GameRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

/**
 * Main game ViewModel that bridges the UI with the game repository.
 * Manages the game loop tick and delegates all state mutations.
 */
class GameViewModel : ViewModel() {

    private val repository = GameRepository()

    val gameState: StateFlow<GameState> = repository.gameState
        .stateIn(viewModelScope, SharingStarted.Eagerly, GameState())

    init {
        startGameLoop()
    }

    private fun startGameLoop() {
        viewModelScope.launch {
            while (true) {
                delay(60_000L) // Every minute: produce resources
                repository.tickResources()
            }
        }
        viewModelScope.launch {
            while (true) {
                delay(1_000L) // Every second: tick expeditions
                repository.tickExpeditions()
            }
        }
        viewModelScope.launch {
            while (true) {
                delay(300_000L) // Every 5 minutes: consume coal for warmth
                repository.consumeCoalForWarmth()
            }
        }
    }

    // --- Building actions ---

    fun upgradeBuilding(buildingId: String) {
        repository.upgradeBuilding(buildingId)
    }

    fun buildNew(type: BuildingType) {
        repository.buildNewBuilding(type)
    }

    // --- Hero actions ---

    fun recruitHero() {
        repository.recruitHero()
    }

    fun levelUpHero(heroId: String) {
        repository.levelUpHero(heroId)
    }

    fun deployHero(heroId: String) {
        repository.deployHero(heroId)
    }

    // --- Troop actions ---

    fun trainTroops(type: TroopType, count: Int) {
        repository.trainTroops(type, count)
    }

    fun healTroops(type: TroopType, count: Int) {
        repository.healTroops(type, count)
    }

    // --- Expedition actions ---

    fun startExpedition(type: ExpeditionType, heroId: String?) {
        repository.startExpedition(type, heroId)
    }

    fun collectExpedition(expeditionId: String) {
        repository.collectExpedition(expeditionId)
    }

    // --- Day actions ---

    fun advanceDay() {
        repository.advanceDay()
        repository.consumeCoalForWarmth()
    }

    fun burnCoal() {
        repository.consumeCoalForWarmth()
    }
}
