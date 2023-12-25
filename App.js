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
  const [exercisesList, setExercisesList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)

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
                <View style={styles.listItem}>
                  <View style={styles.exerciseLeft}>
                    <WeightDisplay weight={item.weight} />
                    <Text style={styles.exerciseText}>{item.name}</Text>
                  </View>
                  <View style={styles.weightButtons}>
                    <TouchableOpacity
                      style={styles.plusButton}
                      onPress={() => changeWeight(item.id, 1)}
                    >
                      <AntDesign name="plus" size={50} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.minusButton}
                      onPress={() => changeWeight(item.id, -1)}
                    >
                      <AntDesign name="minus" size={50} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Swipeable>
            )}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsModalVisible(true)}
          >
            <AntDesign name="pluscircle" size={50} color="white" />
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
              placeholder="Geschwindigkeit"
              value={speed}
              onChangeText={setSpeed}
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
    backgroundColor: "black",
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
    backgroundColor: "lightgray",
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
    width: "80%",
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#0F1321",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
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
  },
  minusButton: {
    // backgroundColor: "blue",
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
    backgroundColor: "#93D5E1",
    padding: 0,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
