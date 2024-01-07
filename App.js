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
  Keyboard,
  Modal,
  Animated,
} from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import ListItem from "./components/ListItem"
import { PanGestureHandler, State } from "react-native-gesture-handler"

export default function App() {
  const [translateX, setTranslateX] = useState(new Animated.Value(0))
  const [exercise, setExercise] = useState("")
  const [weight, setWeight] = useState("")
  const [repetitions, setRepetitions] = useState("")
  const [sets, setSets] = useState("")
  const [speed, setSpeed] = useState("")
  const [oneRepMax, setOneRepMax] = useState("")
  const [rest, setRest] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingExerciseId, setEditingExerciseId] = useState(null)
  const [currentDay, setCurrentDay] = useState("Leg Day")
  const [days, setDays] = useState({
    "Leg Day": [
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
        name: "ABC",
        weight: 40,
        repetitions: 12,
        sets: 3,
        speed: "4-0-1",
        oneRepMax: 70,
        rest: 60,
        isExpanded: false,
      },
      {
        id: "6",
        name: "DEF",
        weight: 40,
        repetitions: 12,
        sets: 3,
        speed: "4-0-1",
        oneRepMax: 70,
        rest: 60,
        isExpanded: false,
      },
    ],
    "Chest Day": [
      {
        id: "1",
        name: "Klimmzüge",
        weight: 0,
        repetitions: 10,
        sets: 3,
        speed: "2-2-4",
        oneRepMax: null,
        rest: 90,
        isExpanded: false,
      },
      {
        id: "2",
        name: "nur1",
        weight: 34,
        repetitions: 10,
        sets: "",
        speed: "",
        oneRepMax: "",
        rest: "",
        isExpanded: "",
      },
      {
        id: "3",
        name: "keins",
        weight: 22,
        repetitions: "",
        sets: "",
        speed: "",
        oneRepMax: "",
        rest: "",
        isExpanded: "",
      },
    ],
    // Fügen Sie hier weitere Tage hinzu
  })

  const goToNextDay = () => {
    const dayNames = Object.keys(days)
    const currentIndex = dayNames.indexOf(currentDay)
    const nextIndex = (currentIndex + 1) % dayNames.length

    // Starten der Animation nach links
    Animated.timing(translateX, {
      toValue: -0, // Bewegung nach links
      duration: 0, // Dauer in Millisekunden
      useNativeDriver: true, // Nutzt die native Animation Engine
    }).start(() => {
      translateX.setValue(0) // Setze den Animated Value zurück
      setCurrentDay(dayNames[nextIndex]) // Aktualisiere den aktuellen Tag
    })
  }

  const goToPreviousDay = () => {
    const dayNames = Object.keys(days)
    const currentIndex = dayNames.indexOf(currentDay)
    const previousIndex = (currentIndex - 1 + dayNames.length) % dayNames.length

    // Starten der Animation nach rechts
    Animated.timing(translateX, {
      toValue: 0, // Bewegung nach rechts
      duration: 0, // Dauer in Millisekunden
      useNativeDriver: true, // Nutzt die native Animation Engine
    }).start(() => {
      translateX.setValue(0) // Setze den Animated Value zurück
      setCurrentDay(dayNames[previousIndex]) // Aktualisiere den aktuellen Tag
    })
  }

  const onSwipe = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      // Überprüfen Sie, ob die Geste abgeschlossen ist
      if (nativeEvent.translationX > 50) {
        // Benutzer hat genug nach rechts gewischt
        goToPreviousDay()
      } else if (nativeEvent.translationX < -50) {
        // Benutzer hat genug nach links gewischt
        goToNextDay()
      }
    }
  }

  const toggleExpand = (id) => {
    setDays({
      ...days,
      [currentDay]: days[currentDay].map((item) => {
        if (item.id === id) {
          return { ...item, isExpanded: !item.isExpanded }
        }
        return item
      }),
    })
  }

  // Funktion zum Starten des Bearbeitungsmodus
  // Funktion zum Starten des Bearbeitungsmodus
  const startEditing = (id) => {
    // Verwenden Sie days[currentDay], um die zu bearbeitende Übung zu finden.
    const exerciseToEdit = days[currentDay].find((e) => e.id === id)
    if (exerciseToEdit) {
      setEditingExerciseId(id)
      setExercise(exerciseToEdit.name)
      setWeight(exerciseToEdit.weight.toString()) // Wandeln Sie Zahlen in Strings um, da TextInput Strings erwartet
      setRepetitions(exerciseToEdit.repetitions.toString())
      setSets(exerciseToEdit.sets.toString())
      setSpeed(exerciseToEdit.speed)
      setOneRepMax(
        exerciseToEdit.oneRepMax ? exerciseToEdit.oneRepMax.toString() : ""
      )
      setRest(exerciseToEdit.rest.toString())
      setIsModalVisible(true)
    }
  }

  // Funktion zum Speichern der Bearbeitung
  const saveEdits = () => {
    setDays({
      ...days,
      [currentDay]: days[currentDay].map((item) =>
        item.id === editingExerciseId
          ? {
              ...item,
              name: exercise,
              weight: parseFloat(weight),
              repetitions,
              sets,
              speed,
              oneRepMax: oneRepMax ? parseFloat(oneRepMax) : null,
              rest,
            }
          : item
      ),
    })
    setIsModalVisible(false)
    setEditingExerciseId(null)
    clearInputs()
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

  // setze das geschwiendigkeit feld zurück wenn focus weil sonst löschen über keyboard nicht geht
  const handleFocus = (stateSetter) => {
    stateSetter("")
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

    const newExercise = {
      id: Math.random().toString(),
      name: exercise,
      weight: parseFloat(weight),
      repetitions,
      sets,
      speed,
      oneRepMax,
      rest,
      isExpanded: false, // Stellen Sie sicher, dass die neue Übung nicht erweitert ist
    }

    setDays({
      ...days,
      [currentDay]: [...days[currentDay], newExercise],
    })

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
    setDays({
      ...days,
      [currentDay]: days[currentDay].map((item) => {
        if (item.id === id) {
          return { ...item, weight: Math.max(0.25, item.weight + delta * 0.25) }
        }
        return item
      }),
    })
  }

  const deleteExercise = (id) => {
    setDays({
      ...days,
      [currentDay]: days[currentDay].filter((item) => item.id !== id),
    })
  }

  const expandAllItems = () => {
    setDays({
      ...days,
      [currentDay]: days[currentDay].map((item) => ({
        ...item,
        isExpanded: true,
      })),
    })
  }

  const deexpandAllItems = () => {
    setDays({
      ...days,
      [currentDay]: days[currentDay].map((item) => ({
        ...item,
        isExpanded: false,
      })),
    })
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeAreaTop}>
        <PanGestureHandler onHandlerStateChange={onSwipe}>
          <View style={styles.navbarContainer}>
            <View style={styles.navbar}>
              <TouchableOpacity onPress={goToPreviousDay}>
                <AntDesign name="caretleft" size={40} color="white" />
              </TouchableOpacity>
              <Animated.View
                style={[
                  styles.navTitleContainer,
                  {
                    transform: [{ translateX }], // Fügt die animierte Bewegung hinzu
                  },
                ]}
              >
                <Text style={styles.navTitle}>{currentDay}</Text>
              </Animated.View>
              <TouchableOpacity onPress={goToNextDay}>
                <AntDesign name="caretright" size={40} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.navAddButton}>
              <AntDesign name="pluscircleo" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </PanGestureHandler>
        <View style={styles.expandButtons}>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={expandAllItems}
          >
            <MaterialCommunityIcons
              name="arrow-expand-vertical"
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={deexpandAllItems}
          >
            <MaterialCommunityIcons
              name="arrow-collapse-vertical"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <FlatList
            data={days[currentDay]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListItem
                item={item}
                toggleExpand={toggleExpand}
                deleteExercise={deleteExercise}
                changeWeight={changeWeight}
                startEditing={startEditing}
              />
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
            <Text style={styles.modalTitle}>
              {" "}
              {editingExerciseId ? "Übung bearbeiten" : "Neue Übung"}
            </Text>
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
              onFocus={() => handleFocus(setSpeed)}
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
            <TouchableOpacity
              style={styles.button}
              onPress={editingExerciseId ? saveEdits : addExercise}
            >
              <Text style={styles.buttonText}>
                {editingExerciseId ? "Änderungen speichern" : "Hinzufügen"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(!isModalVisible)
                setEditingExerciseId(null)
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
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: "70%",
  },
  navAddButton: {
    color: "white",
    position: "absolute",
    right: 10,
  },
  navbarContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F1321",
    position: "relative",
  },
  navTitleContainer: {
    backgroundColor: "#93D5E1",
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 10,
  },
  navTitle: {
    color: "#0F1321",
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
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    zIndex: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: "90%",
    height: "90%",
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
  cancelButton: {
    marginTop: 20,
    textDecorationLine: "underline",
    color: "blue",
    fontSize: 18,
  },
  safeAreaBottom: {
    backgroundColor: "#0F1321",
  },
  expandButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 20,
  },
  expandButton: {
    backgroundColor: "#0F1321",
    padding: 5,
    borderRadius: 5,
  },
})
