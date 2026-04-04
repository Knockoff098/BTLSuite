package com.whiteoutsurvival.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.whiteoutsurvival.data.model.*
import com.whiteoutsurvival.ui.components.ExpeditionCard
import com.whiteoutsurvival.ui.theme.*

@Composable
fun ExplorationScreen(
    gameState: GameState,
    onStartExpedition: (ExpeditionType, String?) -> Unit,
    onCollectExpedition: (String) -> Unit
) {
    var showNewExpeditionDialog by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize()) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Exploration",
                    style = MaterialTheme.typography.headlineMedium,
                    color = TextPrimary
                )
                Text(
                    text = "${gameState.expeditions.count { it.isActive }}/3 active expeditions",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary
                )
            }
            Button(
                onClick = { showNewExpeditionDialog = true },
                colors = ButtonDefaults.buttonColors(containerColor = FireOrange),
                shape = RoundedCornerShape(8.dp),
                enabled = gameState.expeditions.count { it.isActive } < 3
            ) {
                Text("+ New")
            }
        }

        LazyColumn(
            contentPadding = PaddingValues(bottom = 80.dp)
        ) {
            // Active expeditions
            val activeExpeditions = gameState.expeditions.filter { it.isActive }
            if (activeExpeditions.isNotEmpty()) {
                item {
                    Text(
                        text = "Active Expeditions",
                        style = MaterialTheme.typography.titleMedium,
                        color = TextSecondary,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                    )
                }
                items(activeExpeditions, key = { it.id }) { expedition ->
                    ExpeditionCard(
                        expedition = expedition,
                        onCollect = { onCollectExpedition(expedition.id) }
                    )
                }
            }

            // Empty state
            if (activeExpeditions.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(48.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(text = "\uD83D\uDDFA\uFE0F", fontSize = 48.sp)
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                text = "No active expeditions",
                                style = MaterialTheme.typography.titleLarge,
                                color = TextPrimary
                            )
                            Text(
                                text = "Send heroes on expeditions to gather\nresources and discover the frozen world.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = TextSecondary
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Button(
                                onClick = { showNewExpeditionDialog = true },
                                colors = ButtonDefaults.buttonColors(containerColor = FireOrange),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text("Start Expedition")
                            }
                        }
                    }
                }
            }
        }
    }

    if (showNewExpeditionDialog) {
        NewExpeditionDialog(
            heroes = gameState.heroes,
            furnaceLevel = gameState.furnaceLevel,
            onStart = { type, heroId ->
                onStartExpedition(type, heroId)
                showNewExpeditionDialog = false
            },
            onDismiss = { showNewExpeditionDialog = false }
        )
    }
}

@Composable
private fun NewExpeditionDialog(
    heroes: List<Hero>,
    furnaceLevel: Int,
    onStart: (ExpeditionType, String?) -> Unit,
    onDismiss: () -> Unit
) {
    var selectedType by remember { mutableStateOf(ExpeditionType.GATHER_FOOD) }
    var selectedHeroId by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text("New Expedition", color = TextPrimary)
        },
        text = {
            Column {
                Text(
                    text = "Select mission type:",
                    style = MaterialTheme.typography.titleMedium,
                    color = TextSecondary
                )
                Spacer(modifier = Modifier.height(8.dp))

                ExpeditionType.entries.forEach { type ->
                    val expedition = ExpeditionTemplates.createExpedition(type, furnaceLevel)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 2.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = selectedType == type,
                            onClick = { selectedType = type }
                        )
                        Column(modifier = Modifier.padding(start = 4.dp)) {
                            Text(
                                text = "${type.icon} ${type.displayName}",
                                style = MaterialTheme.typography.bodyMedium,
                                color = TextPrimary
                            )
                            val duration = expedition.durationSeconds
                            Text(
                                text = "${duration / 60}m duration",
                                style = MaterialTheme.typography.bodySmall,
                                color = TextSecondary
                            )
                        }
                    }
                }

                if (heroes.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Assign a hero (optional):",
                        style = MaterialTheme.typography.titleMedium,
                        color = TextSecondary
                    )
                    Spacer(modifier = Modifier.height(4.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = selectedHeroId == null,
                            onClick = { selectedHeroId = null }
                        )
                        Text("No hero", color = TextSecondary)
                    }

                    heroes.filter { !it.isDeployed }.take(5).forEach { hero ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = selectedHeroId == hero.id,
                                onClick = { selectedHeroId = hero.id }
                            )
                            Text(
                                text = "${hero.name} (Lv.${hero.level})",
                                color = TextPrimary
                            )
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = { onStart(selectedType, selectedHeroId) },
                colors = ButtonDefaults.buttonColors(containerColor = FireOrange)
            ) {
                Text("Start")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        },
        containerColor = SurfaceMedium
    )
}
