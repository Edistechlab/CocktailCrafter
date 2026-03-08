/**
 * Calculations for cocktail characteristics based on ingredients and technique.
 */

export interface CalculationIngredient {
    amount: number | string
    alcoholContent?: number | null
    sugarContent?: number | null
    acidity?: number | null
    name?: string
}

export interface CalculationOptions {
    dilution?: number | null
}

export function calculateCocktailMetrics(ingredients: CalculationIngredient[], options: CalculationOptions = {}) {
    let totalVolume = 0
    let totalAlcoholVolume = 0
    let totalSugar = 0
    let totalAcid = 0

    ingredients.forEach(ing => {
        const amount = typeof ing.amount === 'string' ? parseFloat(ing.amount) : ing.amount
        if (isNaN(amount)) return

        totalVolume += amount

        if (ing.alcoholContent) {
            totalAlcoholVolume += (amount * ing.alcoholContent) / 100
        }

        if (ing.sugarContent) {
            let effectiveSugar = (amount * ing.sugarContent) / 100
            // Bitterness heavily suppresses perceived sweetness. Offset sugar for amaro/bitters:
            const name = (ing.name || '').toLowerCase()
            if (name.includes('campari') || name.includes('amaro') || name.includes('aperol') || name.includes('bitter')) {
                effectiveSugar *= 0.1 // 90% suppression of perceived sweetness by intense bitterness
            } else if (name.includes('vermouth')) {
                effectiveSugar *= 0.3 // 70% suppression of perceived sweetness by herbs
            }
            totalSugar += effectiveSugar
        }

        if (ing.acidity) {
            totalAcid += (amount * ing.acidity) / 100
        }
    })

    if (totalVolume === 0) return { abv: 0, balance: 5, sugar: 0, acid: 0 }

    // Apply dilution (shaking adds water)
    const dilutionFactor = 1 + (options.dilution || 0)
    const finalVolume = totalVolume * dilutionFactor

    // ABV %
    const abv = (totalAlcoholVolume / finalVolume) * 100

    // Taste Balance (0 = Very Sour, 5 = Balanced, 10 = Very Sweet)
    // Acid is much more intensive than sugar in terms of perception.
    // A standard "balanced" ratio is roughly 10 parts sugar per 1 part acid by weight.
    let balance = 5
    const ACID_WEIGHT = 10

    if (totalAcid > 0) {
        // We use a logarithmic scale to map the ratio to a 0-10 range.
        // If totalSugar / (totalAcid * ACID_WEIGHT) is 1, balance is 5.
        const weightedRatio = totalSugar / (totalAcid * ACID_WEIGHT)

        // Safety check for ratio
        if (weightedRatio > 0) {
            // log2(1) = 0 -> 5
            // log2(2) = 1 -> 7 (Sweet side)
            // log2(0.5) = -1 -> 3 (Sour side)
            balance = 5 + (Math.log2(weightedRatio) * 2)
        } else {
            balance = 1 // Extremely sour
        }
    } else if (totalSugar > 0) {
        balance = 8 // Sweet, no acid
    }

    // Clamp balance
    balance = Math.min(10, Math.max(0, balance))

    return {
        abv: parseFloat(abv.toFixed(1)),
        balance: parseFloat(balance.toFixed(1)),
        totalVolume: parseFloat(finalVolume.toFixed(1)),
        totalSugar: parseFloat(totalSugar.toFixed(1)),
        totalAcid: parseFloat(totalAcid.toFixed(1))
    }
}
