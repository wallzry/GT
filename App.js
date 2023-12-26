import React, { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  Animated,
  Keyboard,
  Modal,
} from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import { Swipeable, GestureHandlerRootView } from "react-native-gesture-handler"
import { Dimensions } from "react-native"

const WeightDisplay = ({ weight }) => {
  const [wholePart, fractionalPart] = weight.toFixed(2).split(".")
  return (
    <View style={styles.exerciseInfo}>
      <Text style={styles.weightLeftTextBold}>{wholePart}.</Text>
      <Text style={styles.weightRightTextSmall}>{fractionalPart} kg</Text>
    </View>
  )
}

export default function App() {
  const [exercise, setExercise] = useState("")
  const [weight, setWeight] = useState("")
  const [repetitions, setRepetitions] = useState("")
  const [sets, setSets] = useState("")
  const [speed, setSpeed] = useState("")
  const [oneRepMax, setOneRepMax] = useState("")
  const [rest, setRest] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [exercisesList, setExercisesList] = useState([
    {
      id: "1",
      name: "Kniebeugen",
      weight: 60,
      repetitions: 10,
      sets: 3,
      speed: "1-1-3",
      oneRepMax: 100,
      rest: 60,
      isExpanded: false,
    },
    {
      id: "2",
      name: "Bankdrücken",
      weight: 70,
      repetitions: 8,
      sets: 3,
      speed: "2-0-2",
      oneRepMax: 120,
      rest: 90,
      isExpanded: true,
    },
    {
      id: "3",
      name: "Kreuzheben",
      weight: 80,
      repetitions: 6,
      sets: 4,
      speed: "3-1-1",
      oneRepMax: 150,
      rest: 120,
      isExpanded: false,
    },
    {
      id: "4",
      name: "Schulterdrücken",
      weight: 40,
      repetitions: 12,
      sets: 3,
      speed: "4-0-1",
      oneRepMax: 70,
      rest: 60,
      isExpanded: false,
    },
    {
      id: "5",
      name: "Klimmzüge",
      weight: 0,
      repetitions: 10,
      sets: 3,
      speed: "2-2-4",
      oneRepMax: null,
      rest: 90,
      isExpanded: false,
    },
  ])

  const toggleExpand = (id) => {
    setExercisesList(
      exercisesList.map((item) => {
        if (item.id === id) {
          return { ...item, isExpanded: !item.isExpanded }
        }
        return item
      })
    )
  }

  const formatSpeedInput = (text) => {
    const numbers = text.replace(/[^0-9]/g, "") // Entferne alle Nicht-Ziffern
    let formatted = numbers.substring(0, 3) // Beschränke die Länge auf drei Ziffern

    // Füge Bindestriche hinzu, abhängig von der Länge der Zahlenfolge
    if (formatted.length === 1) {
      // Nur eine Ziffer vorhanden
      formatted = `${formatted}-`
    } else if (formatted.length === 2) {
      // Zwei Ziffern vorhanden
      formatted = `${formatted.substring(0, 1)}-${formatted.substring(1)}-`
    } else if (formatted.length === 3) {
      // Drei Ziffern vorhanden
      formatted = `${formatted.substring(0, 1)}-${formatted.substring(
        1,
        2
      )}-${formatted.substring(2)}`
    }

    setSpeed(formatted) // Aktualisiere den Geschwindigkeitszustand mit dem formatierten Text
  }

  const addExercise = () => {
    let errorMessage = ""
    if (exercise === "") {
      errorMessage += "Bitte geben Sie den Namen der Übung ein."
    }
    if (weight === "") {
      errorMessage += errorMessage
        ? "\nBitte geben Sie das Gewicht ein."
        : "Bitte geben Sie das Gewicht ein."
    }

    if (errorMessage) {
      Alert.alert("Fehler", errorMessage)
      return
    }

    setExercisesList([
      ...exercisesList,
      {
        id: Math.random().toString(),
        name: exercise,
        weight: parseFloat(weight),
        repetitions,
        sets,
        speed,
        oneRepMax,
        rest,
      },
    ])
    clearInputs()
    setIsModalVisible(false)
  }

  const clearInputs = () => {
    setExercise("")
    setWeight("")
    setRepetitions("")
    setSets("")
    setSpeed("")
    setOneRepMax("")
    setRest("")
    Keyboard.dismiss()
  }

  const changeWeight = (id, delta) => {
    setExercisesList(
      exercisesList.map((item) => {
        if (item.id === id) {
          return { ...item, weight: Math.max(0.25, item.weight + delta * 0.25) }
        }
        return item
      })
    )
  }

  const deleteExercise = (id) => {
    setExercisesList(exercisesList.filter((item) => item.id !== id))
  }

  const renderRightActions = (progress, dragX, onPress) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.7],
      extrapolate: "clamp",
    })
    const opacity = dragX.interpolate({
      inputRange: [-100, -20, 0],
      outputRange: [1, 0.5, 0],
      extrapolate: "clamp",
    })

    return (
      <Animated.View style={[styles.rightAction, { opacity }]}>
        <TouchableOpacity onPress={onPress} style={styles.deleteButton}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <AntDesign name="delete" size={30} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeAreaTop}>
        <View style={styles.navbar}>
          <TouchableOpacity>
            <AntDesign name="caretleft" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.navTitleContainer}>
            <Text style={styles.navTitle}>Leg Day</Text>
          </View>
          <TouchableOpacity>
            <AntDesign name="caretright" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <FlatList
            data={exercisesList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Swipeable
                renderRightActions={(progress, dragX) =>
                  renderRightActions(progress, dragX, () =>
                    deleteExercise(item.id)
                  )
                }
              >
                <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                  <View
                    style={[
                      styles.listItem,
                      item.isExpanded
                        ? {
                            marginBottom: 0,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                          }
                        : {
                            marginBottom: 10,
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                          },
                    ]}
                  >
                    <View style={styles.exerciseLeft}>
                      <WeightDisplay weight={item.weight} />
                      <Text style={styles.exerciseText}>{item.name}</Text>
                    </View>
                    <View style={styles.weightButtons}>
                      <TouchableOpacity
                        onPress={() => changeWeight(item.id, 1)}
                      >
                        <Text style={styles.plusButton}>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => changeWeight(item.id, -1)}
                      >
                        <Text style={styles.minusButton}>-</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* Zeige weitere Details, wenn isExpanded true ist */}
                  {item.isExpanded && (
                    <View style={styles.additionalDetails}>
                      <Text style={styles.detailText}>
                        Wiederholungen: {item.repetitions}
                      </Text>
                      <Text style={styles.detailText}>Sätze: {item.sets}</Text>
                      <Text style={styles.detailText}>
                        Geschwindigkeit: {item.speed}
                      </Text>
                      <Text style={styles.detailText}>
                        1RM: {item.oneRepMax || "N/A"} kg
                      </Text>
                      <Text style={styles.detailText}>
                        Ruhe: {item.rest} Sekunden
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Swipeable>
            )}
            showsVerticalScrollIndicator={false}
          />

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsModalVisible(true)}
          >
            <AntDesign name="pluscircle" size={50} color="#93D5E1" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.safeAreaBottom} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Neue Übung</Text>
            <TextInput
              style={styles.input}
              placeholder="Übung"
              value={exercise}
              onChangeText={setExercise}
            />
            <TextInput
              style={styles.input}
              placeholder="Gewicht (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
            <Text style={styles.optionalHeading}>Optional</Text>
            <TextInput
              style={styles.input}
              placeholder="Wiederholungen"
              value={repetitions}
              onChangeText={setRepetitions}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Sätze"
              value={sets}
              onChangeText={setSets}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Geschwindigkeit (z.B. 2-0-2)"
              value={speed}
              onChangeText={formatSpeedInput} // Verwende die angepasste Funktion
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="1-Repetition-Maximum"
              value={oneRepMax}
              onChangeText={setOneRepMax}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Pause (sek)"
              value={rest}
              onChangeText={setRest}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={addExercise}>
              <Text style={styles.buttonText}>Hinzufügen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(!isModalVisible)
                clearInputs()
              }}
            >
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  safeAreaTop: {
    flex: 1,
    backgroundColor: "white",
  },
  safeAreaBottom: {
    // backgroundColor: "black",
    backgroundColor: "black", // Transparenter Hintergrund
    height: 0, // Keine zusätzliche Höhe
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "black",
  },
  navTitleContainer: {
    backgroundColor: "#93D5E1",
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 10,
  },
  navTitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  listItem: {
    width: 300,
    alignSelf: "center", // Centers the listItem in its container horizontally
    padding: 10,
    backgroundColor: "#0F1321",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Horizontally centers the content of the listItem
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  additionalDetails: {
    backgroundColor: "#0F1321",
    padding: 10,
    marginBottom: 10,
    width: "100%",
    alignSelf: "center",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginTop: 0, // Kein zusätzlicher Abstand zum oberen ListItem
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  detailText: {
    fontSize: 16,
    color: "white",
    paddingVertical: 2,
  },
  exerciseLeft: {
    display: "flex",
  },
  exerciseInfo: {
    display: "flex",
    flexDirection: "row",
  },
  weightLeftText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  exerciseText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 30,
  },
  weightRightText: {
    fontSize: 10,
  },
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
  weightButtons: {
    flexDirection: "column",
    alignItems: "center",
  },
  plusButton: {
    // backgroundColor: "red",
    fontSize: 60,
    fontWeight: "bold",
    color: "white",
    lineHeight: 60, // Einstellen auf die gleiche Größe wie fontSize oder leicht größer/kleiner
  },
  minusButton: {
    // backgroundColor: "blue",
    fontSize: 60,
    fontWeight: "bold",
    color: "white",
    lineHeight: 60, // Einstellen auf die gleiche Größe wie fontSize oder leicht größer/kleiner
  },
  weightButtonText: {
    color: "white",
    fontSize: 60,
    fontWeight: "bold",
  },
  rightAction: {
    backgroundColor: "red",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    padding: 15,
  },
  iconButton: {
    backgroundColor: "white",
    padding: 0,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute", // Absolute Positionierung
    bottom: 20, // Abstand vom unteren Rand des Bildschirms
    alignSelf: "center", // Zentriert den Button horizontal im Container
    zIndex: 10, // Stellt sicher, dass der Button über den ListItems liegt
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    width: "90%", // Modal nimmt fast die gesamte Breite ein
    height: "90%", // Modal nimmt fast die gesamte Höhe ein
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionalHeading: {
    fontSize: 18,
    fontStyle: "italic",
    marginTop: 10,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 20,
    textDecorationLine: "underline",
    color: "blue",
    fontSize: 18,
  },
})
