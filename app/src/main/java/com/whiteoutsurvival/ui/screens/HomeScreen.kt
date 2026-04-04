package com.whiteoutsurvival.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.whiteoutsurvival.data.model.GameState
import com.whiteoutsurvival.data.model.WarmthLevel
import com.whiteoutsurvival.ui.theme.*

@Composable
fun HomeScreen(
    gameState: GameState,
    onAdvanceDay: () -> Unit,
    onBurnCoal: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Settlement header
        Text(
            text = gameState.settlementName,
            style = MaterialTheme.typography.headlineLarge,
            color = TextPrimary,
            textAlign = TextAlign.Center
        )

        Text(
            text = "Day ${gameState.daysSurvived}",
            style = MaterialTheme.typography.titleMedium,
            color = TextSecondary
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Temperature display
        TemperatureCard(gameState)

        Spacer(modifier = Modifier.height(16.dp))

        // Power display
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Settlement Power",
                    style = MaterialTheme.typography.titleMedium,
                    color = TextSecondary
                )
                Text(
                    text = formatPower(gameState.totalPower),
                    style = MaterialTheme.typography.headlineLarge,
                    color = FireOrange,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Stats grid
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            InfoCard(
                title = "Population",
                value = "${gameState.population}/${gameState.maxPopulation}",
                icon = "\uD83D\uDC65",
                modifier = Modifier.weight(1f)
            )
            InfoCard(
                title = "Buildings",
                value = gameState.buildings.size.toString(),
                icon = "\uD83C\uDFD7\uFE0F",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            InfoCard(
                title = "Heroes",
                value = gameState.heroes.size.toString(),
                icon = "\uD83E\uDDB8",
                modifier = Modifier.weight(1f)
            )
            InfoCard(
                title = "Troops",
                value = gameState.army.totalTroops.toString(),
                icon = "\u2694\uFE0F",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            InfoCard(
                title = "Furnace",
                value = "Lv.${gameState.furnaceLevel}",
                icon = "\uD83D\uDD25",
                modifier = Modifier.weight(1f)
            )
            InfoCard(
                title = "Expeditions",
                value = "${gameState.expeditions.count { it.isActive }}/3",
                icon = "\uD83D\uDDFA\uFE0F",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Production rates
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Production / min",
                    style = MaterialTheme.typography.titleMedium,
                    color = TextSecondary
                )
                Spacer(modifier = Modifier.height(8.dp))
                val modifier = gameState.warmthLevel.productionModifier
                ProductionRow("\uD83C\uDF5E Food", "+${String.format("%.1f", gameState.resources.foodPerMinute * modifier)}", FoodGreen)
                ProductionRow("\uD83E\uDEB5 Wood", "+${String.format("%.1f", gameState.resources.woodPerMinute * modifier)}", WoodBrown)
                ProductionRow("\u2699\uFE0F Iron", "+${String.format("%.1f", gameState.resources.ironPerMinute * modifier)}", IronGray)
                ProductionRow("\u26AB Coal", "+${String.format("%.1f", gameState.resources.coalPerMinute * modifier)}", CoalBlack)

                if (modifier < 1.0) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Cold weather reducing production to ${(modifier * 100).toInt()}%",
                        style = MaterialTheme.typography.bodySmall,
                        color = TempFreezing
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Action buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Button(
                onClick = onBurnCoal,
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(containerColor = FireOrange),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("\uD83D\uDD25 Burn Coal")
            }
            Button(
                onClick = onAdvanceDay,
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(containerColor = IceBlueLight),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("\uD83C\uDF19 Next Day")
            }
        }

        Spacer(modifier = Modifier.height(80.dp)) // Bottom nav padding
    }
}

@Composable
private fun TemperatureCard(gameState: GameState) {
    val warmth = gameState.warmthLevel
    val tempColor = when (warmth) {
        WarmthLevel.WARM -> TempWarm
        WarmthLevel.MILD -> TempMild
        WarmthLevel.COLD -> TempCold
        WarmthLevel.FREEZING -> TempFreezing
        WarmthLevel.DEADLY -> TempDeadly
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = tempColor.copy(alpha = 0.15f)),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "\u2744\uFE0F",
                fontSize = 32.sp
            )
            Text(
                text = "${gameState.temperature}\u00B0C",
                style = MaterialTheme.typography.headlineLarge,
                color = tempColor,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = warmth.displayName,
                style = MaterialTheme.typography.titleMedium,
                color = tempColor
            )
        }
    }
}

@Composable
private fun InfoCard(
    title: String,
    value: String,
    icon: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = icon, fontSize = 24.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleLarge,
                color = TextPrimary,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = title,
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary
            )
        }
    }
}

@Composable
private fun ProductionRow(
    label: String,
    value: String,
    color: androidx.compose.ui.graphics.Color
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = TextPrimary
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            color = color,
            fontWeight = FontWeight.SemiBold
        )
    }
}

private fun formatPower(power: Long): String {
    return when {
        power >= 1_000_000 -> String.format("%.1fM", power / 1_000_000.0)
        power >= 1_000 -> String.format("%.1fK", power / 1_000.0)
        else -> power.toString()
    }
}
