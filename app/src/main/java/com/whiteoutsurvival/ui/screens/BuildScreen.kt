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
import com.whiteoutsurvival.data.model.*
import com.whiteoutsurvival.ui.components.BuildingCard
import com.whiteoutsurvival.ui.theme.*

@Composable
fun BuildScreen(
    gameState: GameState,
    onUpgradeBuilding: (String) -> Unit,
    onBuildNew: (BuildingType) -> Unit
) {
    var selectedCategory by remember { mutableStateOf<BuildingCategory?>(null) }
    var showBuildDialog by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize()) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Buildings",
                style = MaterialTheme.typography.headlineMedium,
                color = TextPrimary
            )
            Button(
                onClick = { showBuildDialog = true },
                colors = ButtonDefaults.buttonColors(containerColor = FireOrange),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("+ Build New")
            }
        }

        // Category filter chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            FilterChip(
                selected = selectedCategory == null,
                onClick = { selectedCategory = null },
                label = { Text("All") }
            )
            BuildingCategory.entries.forEach { category ->
                FilterChip(
                    selected = selectedCategory == category,
                    onClick = { selectedCategory = category },
                    label = { Text(category.displayName) }
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Buildings list
        val filteredBuildings = if (selectedCategory != null) {
            gameState.buildings.filter { it.type.category == selectedCategory }
        } else {
            gameState.buildings
        }

        LazyColumn(
            contentPadding = PaddingValues(bottom = 80.dp)
        ) {
            items(filteredBuildings, key = { it.id }) { building ->
                BuildingCard(
                    building = building,
                    onUpgrade = { onUpgradeBuilding(building.id) }
                )
            }

            if (filteredBuildings.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(48.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No buildings in this category.\nBuild new ones!",
                            style = MaterialTheme.typography.bodyLarge,
                            color = TextSecondary
                        )
                    }
                }
            }
        }
    }

    // Build new building dialog
    if (showBuildDialog) {
        BuildNewDialog(
            existingTypes = gameState.buildings.map { it.type }.toSet(),
            onBuild = { type ->
                onBuildNew(type)
                showBuildDialog = false
            },
            onDismiss = { showBuildDialog = false }
        )
    }
}

@Composable
private fun BuildNewDialog(
    existingTypes: Set<BuildingType>,
    onBuild: (BuildingType) -> Unit,
    onDismiss: () -> Unit
) {
    val availableTypes = BuildingType.entries.filter { type ->
        // Allow duplicates for non-unique buildings
        val uniqueTypes = setOf(
            BuildingType.FURNACE, BuildingType.EMBASSY,
            BuildingType.RESEARCH_LAB, BuildingType.WAREHOUSE
        )
        type !in uniqueTypes || type !in existingTypes
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text("Build New Structure", color = TextPrimary)
        },
        text = {
            LazyColumn {
                items(availableTypes) { type ->
                    val building = Building(type = type)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = building.icon, modifier = Modifier.padding(end = 8.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = type.displayName,
                                style = MaterialTheme.typography.titleMedium,
                                color = TextPrimary
                            )
                            Text(
                                text = type.category.displayName,
                                style = MaterialTheme.typography.bodySmall,
                                color = TextSecondary
                            )
                        }
                        TextButton(onClick = { onBuild(type) }) {
                            Text("Build", color = FireOrange, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        },
        confirmButton = {},
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        },
        containerColor = SurfaceMedium
    )
}
