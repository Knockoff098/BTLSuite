package com.whiteoutsurvival.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.whiteoutsurvival.data.model.Resources
import com.whiteoutsurvival.ui.theme.*

@Composable
fun ResourceBar(
    resources: Resources,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(bottomStart = 12.dp, bottomEnd = 12.dp))
            .background(SurfaceMedium)
            .padding(horizontal = 8.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically
    ) {
        ResourceChip(icon = "\uD83C\uDF5E", value = formatNumber(resources.food), color = FoodGreen)
        ResourceChip(icon = "\uD83E\uDEB5", value = formatNumber(resources.wood), color = WoodBrown)
        ResourceChip(icon = "\u2699\uFE0F", value = formatNumber(resources.iron), color = IronGray)
        ResourceChip(icon = "\u26AB", value = formatNumber(resources.coal), color = CoalBlack)
        ResourceChip(icon = "\uD83D\uDC8E", value = resources.gems.toString(), color = GemPurple)
    }
}

@Composable
private fun ResourceChip(
    icon: String,
    value: String,
    color: androidx.compose.ui.graphics.Color
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center,
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(color.copy(alpha = 0.15f))
            .padding(horizontal = 6.dp, vertical = 3.dp)
    ) {
        Text(
            text = icon,
            fontSize = 12.sp
        )
        Spacer(modifier = Modifier.width(3.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.bodySmall,
            color = TextPrimary,
            textAlign = TextAlign.Center
        )
    }
}

fun formatNumber(value: Long): String {
    return when {
        value >= 1_000_000 -> "${value / 1_000_000}M"
        value >= 1_000 -> "${value / 1_000}K"
        else -> value.toString()
    }
}
