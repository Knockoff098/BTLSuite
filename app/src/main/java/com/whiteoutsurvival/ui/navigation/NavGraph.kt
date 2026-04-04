package com.whiteoutsurvival.ui.navigation

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.whiteoutsurvival.ui.components.ResourceBar
import com.whiteoutsurvival.ui.screens.*
import com.whiteoutsurvival.ui.theme.*
import com.whiteoutsurvival.ui.viewmodel.GameViewModel

enum class GameScreen(
    val title: String,
    val icon: ImageVector
) {
    HOME("Home", Icons.Filled.Home),
    BUILD("Build", Icons.Filled.Build),
    HEROES("Heroes", Icons.Filled.Star),
    TROOPS("Troops", Icons.Filled.Shield),
    EXPLORE("Explore", Icons.Filled.Explore)
}

@Composable
fun GameNavigation(
    viewModel: GameViewModel = viewModel()
) {
    val gameState by viewModel.gameState.collectAsStateWithLifecycle()
    var currentScreen by remember { mutableStateOf(GameScreen.HOME) }

    Scaffold(
        topBar = {
            ResourceBar(resources = gameState.resources)
        },
        bottomBar = {
            NavigationBar(
                containerColor = SurfaceMedium,
                contentColor = TextPrimary
            ) {
                GameScreen.entries.forEach { screen ->
                    NavigationBarItem(
                        icon = {
                            Icon(
                                screen.icon,
                                contentDescription = screen.title
                            )
                        },
                        label = { Text(screen.title) },
                        selected = currentScreen == screen,
                        onClick = { currentScreen = screen },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = FireOrange,
                            selectedTextColor = FireOrange,
                            indicatorColor = FireOrange.copy(alpha = 0.15f),
                            unselectedIconColor = TextSecondary,
                            unselectedTextColor = TextSecondary
                        )
                    )
                }
            }
        }
    ) { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues)) {
            when (currentScreen) {
                GameScreen.HOME -> HomeScreen(
                    gameState = gameState,
                    onAdvanceDay = viewModel::advanceDay,
                    onBurnCoal = viewModel::burnCoal
                )
                GameScreen.BUILD -> BuildScreen(
                    gameState = gameState,
                    onUpgradeBuilding = viewModel::upgradeBuilding,
                    onBuildNew = viewModel::buildNew
                )
                GameScreen.HEROES -> HeroScreen(
                    gameState = gameState,
                    onRecruitHero = viewModel::recruitHero,
                    onLevelUpHero = viewModel::levelUpHero,
                    onDeployHero = viewModel::deployHero
                )
                GameScreen.TROOPS -> TroopScreen(
                    gameState = gameState,
                    onTrainTroops = viewModel::trainTroops,
                    onHealTroops = viewModel::healTroops
                )
                GameScreen.EXPLORE -> ExplorationScreen(
                    gameState = gameState,
                    onStartExpedition = viewModel::startExpedition,
                    onCollectExpedition = viewModel::collectExpedition
                )
            }
        }
    }
}
