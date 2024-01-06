import React from "react"
import { View, Text, StyleSheet } from "react-native"

const WeightDisplay = ({ weight }) => {
  // Trenne das Gewicht in ganzzahligen und fraktionellen Teil.
  const [wholePart, fractionalPart] = weight.toFixed(2).split(".")

  return (
    <View style={styles.exerciseInfo}>
      <Text style={styles.weightLeftTextBold}>{wholePart}.</Text>
      <Text style={styles.weightRightTextSmall}>{fractionalPart} kg</Text>
    </View>
  )
}

// Hier definieren Sie den Stil für Ihre Komponente.
const styles = StyleSheet.create({
  exerciseInfo: {
    flexDirection: "row",
    alignItems: "baseline", // Diese Zeile hinzufügen
  },
  weightLeftTextBold: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#93D5E1",
    // Eventuell weitere Anpassungen zur Feinabstimmung
  },
  weightRightTextSmall: {
    fontSize: 16,
    color: "#93D5E1",
    // Eventuell weitere Anpassungen zur Feinabstimmung
  },
})

export default WeightDisplay
