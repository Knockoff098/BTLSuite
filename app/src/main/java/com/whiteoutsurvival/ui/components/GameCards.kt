package com.whiteoutsurvival.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.whiteoutsurvival.data.model.*
import com.whiteoutsurvival.ui.theme.*

@Composable
fun BuildingCard(
    building: Building,
    onUpgrade: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Icon
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(IceBlue.copy(alpha = 0.3f)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = building.icon, fontSize = 24.sp)
            }

            Spacer(modifier = Modifier.width(12.dp))

            // Info
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = building.displayName,
                    style = MaterialTheme.typography.titleMedium,
                    color = TextPrimary
                )
                Text(
                    text = "Level ${building.level}",
                    style = MaterialTheme.typography.bodySmall,
                    color = FireOrange,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = building.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Upgrade button
            if (building.level < building.maxLevel) {
                Button(
                    onClick = onUpgrade,
                    colors = ButtonDefaults.buttonColors(containerColor = FireOrange),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text("Upgrade", fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
fun HeroCard(
    hero: Hero,
    onLevelUp: () -> Unit,
    onDeploy: () -> Unit,
    modifier: Modifier = Modifier
) {
    val rarityColor = Color(hero.rarity.colorHex)

    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Rarity indicator
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(rarityColor.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = hero.heroClass.displayName.first().toString(),
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = rarityColor
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = hero.name,
                            style = MaterialTheme.typography.titleMedium,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = hero.rarity.displayName,
                            style = MaterialTheme.typography.bodySmall,
                            color = rarityColor,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Text(
                        text = "${hero.heroClass.displayName} | Lv.${hero.level} | Power: ${hero.power}",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                }

                if (hero.isDeployed) {
                    Text(
                        text = "DEPLOYED",
                        style = MaterialTheme.typography.bodySmall,
                        color = FoodGreen,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Stats row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                StatChip("ATK", hero.attack.toString(), FireRed)
                StatChip("DEF", hero.defense.toString(), IceBlueLight)
                StatChip("HP", hero.health.toString(), FoodGreen)
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Skill
            Text(
                text = "${hero.skill.name}: ${hero.skill.description}",
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary.copy(alpha = 0.8f),
                maxLines = 2
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Action buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                OutlinedButton(
                    onClick = onDeploy,
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                ) {
                    Text(
                        if (hero.isDeployed) "Recall" else "Deploy",
                        fontSize = 12.sp
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Button(
                    onClick = onLevelUp,
                    colors = ButtonDefaults.buttonColors(containerColor = FireOrange),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                    enabled = hero.level < hero.maxLevel
                ) {
                    Text("Level Up", fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
fun StatChip(label: String, value: String, color: Color) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(color.copy(alpha = 0.1f))
            .padding(horizontal = 16.dp, vertical = 4.dp)
    ) {
        Text(
            text = value,
            style = MaterialTheme.typography.titleMedium,
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
fun ExpeditionCard(
    expedition: Expedition,
    onCollect: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = expedition.type.icon, fontSize = 24.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = expedition.type.displayName,
                        style = MaterialTheme.typography.titleMedium,
                        color = TextPrimary
                    )
                    Text(
                        text = expedition.type.description,
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Progress bar
            LinearProgressIndicator(
                progress = { expedition.progressPercent },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp)
                    .clip(RoundedCornerShape(4.dp)),
                color = if (expedition.isComplete) FoodGreen else IceBlueLight,
                trackColor = SurfaceDark
            )

            Spacer(modifier = Modifier.height(4.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (expedition.isComplete) {
                    Text(
                        text = "Complete!",
                        style = MaterialTheme.typography.bodySmall,
                        color = FoodGreen,
                        fontWeight = FontWeight.Bold
                    )
                } else {
                    val minutes = expedition.remainingSeconds / 60
                    val seconds = expedition.remainingSeconds % 60
                    Text(
                        text = "${minutes}m ${seconds}s remaining",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                }

                if (expedition.isComplete) {
                    Button(
                        onClick = onCollect,
                        colors = ButtonDefaults.buttonColors(containerColor = FoodGreen),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                    ) {
                        Text("Collect", fontSize = 12.sp)
                    }
                }
            }
        }
    }
}
