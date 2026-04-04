package com.whiteoutsurvival.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.whiteoutsurvival.data.model.Army
import com.whiteoutsurvival.data.model.GameState
import com.whiteoutsurvival.data.model.TroopType
import com.whiteoutsurvival.ui.theme.*

@Composable
fun TroopScreen(
    gameState: GameState,
    onTrainTroops: (TroopType, Int) -> Unit,
    onHealTroops: (TroopType, Int) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = "Army",
            style = MaterialTheme.typography.headlineMedium,
            color = TextPrimary
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Army overview
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
                    text = "Total Army Power",
                    style = MaterialTheme.typography.titleMedium,
                    color = TextSecondary
                )
                Text(
                    text = gameState.army.totalPower.toString(),
                    style = MaterialTheme.typography.headlineLarge,
                    color = FireOrange,
                    fontWeight = FontWeight.Bold
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    TroopCount("Active", gameState.army.totalTroops, FoodGreen)
                    TroopCount("Wounded", gameState.army.totalWounded, FireRed)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Troop types
        TroopTypeCard(
            type = TroopType.INFANTRY,
            count = gameState.army.infantry,
            wounded = gameState.army.woundedInfantry,
            onTrain = { count -> onTrainTroops(TroopType.INFANTRY, count) },
            onHeal = { count -> onHealTroops(TroopType.INFANTRY, count) }
        )

        Spacer(modifier = Modifier.height(12.dp))

        TroopTypeCard(
            type = TroopType.MARKSMAN,
            count = gameState.army.marksmen,
            wounded = gameState.army.woundedMarksmen,
            onTrain = { count -> onTrainTroops(TroopType.MARKSMAN, count) },
            onHeal = { count -> onHealTroops(TroopType.MARKSMAN, count) }
        )

        Spacer(modifier = Modifier.height(12.dp))

        TroopTypeCard(
            type = TroopType.LANCER,
            count = gameState.army.lancers,
            wounded = gameState.army.woundedLancers,
            onTrain = { count -> onTrainTroops(TroopType.LANCER, count) },
            onHeal = { count -> onHealTroops(TroopType.LANCER, count) }
        )

        Spacer(modifier = Modifier.height(80.dp))
    }
}

@Composable
private fun TroopCount(
    label: String,
    count: Int,
    color: androidx.compose.ui.graphics.Color
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = count.toString(),
            style = MaterialTheme.typography.titleLarge,
            color = color,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = TextSecondary
        )
    }
}

@Composable
private fun TroopTypeCard(
    type: TroopType,
    count: Int,
    wounded: Int,
    onTrain: (Int) -> Unit,
    onHeal: (Int) -> Unit
) {
    var trainAmount by remember { mutableIntStateOf(10) }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = type.icon, fontSize = 28.sp)
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = type.displayName,
                        style = MaterialTheme.typography.titleLarge,
                        color = TextPrimary
                    )
                    Text(
                        text = "Power per unit: ${type.basePower}",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = count.toString(),
                        style = MaterialTheme.typography.titleLarge,
                        color = FoodGreen,
                        fontWeight = FontWeight.Bold
                    )
                    if (wounded > 0) {
                        Text(
                            text = "$wounded wounded",
                            style = MaterialTheme.typography.bodySmall,
                            color = FireRed
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Train amount selector
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Train:", color = TextSecondary, style = MaterialTheme.typography.bodyMedium)
                listOf(5, 10, 25, 50).forEach { amount ->
                    FilterChip(
                        selected = trainAmount == amount,
                        onClick = { trainAmount = amount },
                        label = { Text(amount.toString()) },
                        modifier = Modifier.height(32.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = { onTrain(trainAmount) },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = IceBlueLight),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Train $trainAmount")
                }
                if (wounded > 0) {
                    Button(
                        onClick = { onHeal(wounded) },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = FoodGreen),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Heal All")
                    }
                }
            }
        }
    }
}
