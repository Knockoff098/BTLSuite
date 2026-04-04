package com.whiteoutsurvival.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.whiteoutsurvival.data.model.GameState
import com.whiteoutsurvival.ui.components.HeroCard
import com.whiteoutsurvival.ui.theme.*

@Composable
fun HeroScreen(
    gameState: GameState,
    onRecruitHero: () -> Unit,
    onLevelUpHero: (String) -> Unit,
    onDeployHero: (String) -> Unit
) {
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
                    text = "Heroes",
                    style = MaterialTheme.typography.headlineMedium,
                    color = TextPrimary
                )
                Text(
                    text = "${gameState.heroes.size} recruited",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary
                )
            }
            Button(
                onClick = onRecruitHero,
                colors = ButtonDefaults.buttonColors(containerColor = GemPurple),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("\uD83D\uDC8E 10  Recruit")
            }
        }

        if (gameState.heroes.isEmpty()) {
            // Empty state
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(48.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "\uD83E\uDDB8", fontSize = 48.sp)
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "No heroes recruited yet",
                        style = MaterialTheme.typography.titleLarge,
                        color = TextPrimary
                    )
                    Text(
                        text = "Spend gems to recruit heroes.\nThey lead your troops and go on expeditions.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = onRecruitHero,
                        colors = ButtonDefaults.buttonColors(containerColor = GemPurple),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("\uD83D\uDC8E 10  Recruit Hero")
                    }
                }
            }
        } else {
            LazyColumn(
                contentPadding = PaddingValues(bottom = 80.dp)
            ) {
                items(
                    gameState.heroes.sortedByDescending { it.power },
                    key = { it.id }
                ) { hero ->
                    HeroCard(
                        hero = hero,
                        onLevelUp = { onLevelUpHero(hero.id) },
                        onDeploy = { onDeployHero(hero.id) }
                    )
                }
            }
        }
    }
}
