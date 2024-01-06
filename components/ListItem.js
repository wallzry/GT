import React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { Swipeable } from "react-native-gesture-handler"
import WeightDisplay from "./WeightDisplay"
const { width: screenWidth } = Dimensions.get("window")
const desiredWidth = screenWidth * 0.9

const ListItem = ({
  item,
  toggleExpand,
  deleteExercise,
  changeWeight,
  startEditing,
}) => {
  const renderRightActions = (progress, dragX) => {
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
        <TouchableOpacity
          onPress={() => deleteExercise(item.id)}
          style={styles.deleteButton}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <AntDesign name="delete" size={30} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, () => deleteExercise(item.id))
      }
    >
      <TouchableOpacity
        style={styles.editButtonWrapper}
        onPress={() => startEditing(item.id)}
      >
        <View style={styles.editButton}>
          <AntDesign name="edit" size={14} color="#D9DDEF" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.9}
      >
        <View
          style={[
            styles.listItem,
            item.isExpanded &&
            (item.repetitions ||
              item.sets ||
              item.speed ||
              item.oneRepMax ||
              item.rest)
              ? {
                  marginBottom: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }
              : {
                  marginBottom: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
          ]}
        >
          <View style={styles.exerciseLeft}>
            <WeightDisplay weight={item.weight} />
            <Text style={styles.exerciseText}>{item.name}</Text>
          </View>
          <View style={styles.weightButtons}>
            <TouchableOpacity onPress={() => changeWeight(item.id, 1)}>
              <Text style={styles.plusButton}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeWeight(item.id, -1)}>
              <Text style={styles.minusButton}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Zeige weitere Details, wenn isExpanded true ist */}
        {item.isExpanded &&
          (item.repetitions ||
            item.sets ||
            item.speed ||
            item.oneRepMax ||
            item.rest) && (
            <View style={styles.additionalDetails}>
              {item.repetitions && (
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailText}>
                    <AntDesign name="reload1" size={20} color="#0F1321" /> Reps:{" "}
                    {item.repetitions}
                  </Text>
                </View>
              )}
              {item.sets && (
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailText}>
                    <AntDesign name="sync" size={20} color="#0F1321" /> Sätze:{" "}
                    {item.sets}
                  </Text>
                </View>
              )}
              {item.speed && (
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailText}>
                    <AntDesign name="dashboard" size={20} color="#0F1321" />{" "}
                    Geschwindigkeit: {item.speed}
                  </Text>
                </View>
              )}
              {item.oneRepMax && (
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailText}>
                    <MaterialCommunityIcons
                      name="fire-circle"
                      size={20}
                      color="#0F1321"
                    />{" "}
                    1-RM: {item.oneRepMax || "N/A"} kg
                  </Text>
                </View>
              )}
              {item.rest && (
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailText}>
                    <AntDesign name="pausecircleo" size={20} color="#0F1321" />
                    Pause: {item.rest} Sekunden
                  </Text>
                </View>
              )}
            </View>
          )}
        {/* Zeige den Pfeil falls mind. eine optionale Angabe */}
        {(item.repetitions ||
          item.sets ||
          item.speed ||
          item.oneRepMax ||
          item.rest) && (
          <View style={styles.arrowContainer}>
            {item.isExpanded ? (
              <AntDesign name="up" size={12} color="#D9DDEF" />
            ) : (
              <AntDesign name="down" size={12} color="#D9DDEF" />
            )}
          </View>
        )}
        {/* Zeige den Pfeil nicht wenn keine optionale Angabe */}
        {!item.repetitions &&
          !item.sets &&
          !item.speed &&
          !item.oneRepMax &&
          !item.rest && (
            <View style={styles.noArrowContainer}>
              <AntDesign name="minus" size={12} color="#D9DDEF" />
            </View>
          )}
      </TouchableOpacity>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  listItem: {
    width: desiredWidth,
    alignSelf: "center",
    paddingTop: 10,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 0,
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
  additionalDetails: {
    width: desiredWidth,
    alignSelf: "center",
    backgroundColor: "#0F1321",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  arrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F1321",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  noArrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F1321",
    paddingBottom: 5,
    marginBottom: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  detailTextWrapper: {
    backgroundColor: "#D9DDEF",
    borderRadius: 100,
    margin: 5,
    paddingHorizontal: 5,
  },
  detailText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F1321",
  },
  exerciseLeft: {
    display: "flex",
  },
  exerciseText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 30,
  },
  weightButtons: {
    flexDirection: "column",
    alignItems: "center",
  },
  plusButton: {
    fontSize: 60,
    fontWeight: "bold",
    color: "white",
    lineHeight: 60,
  },
  minusButton: {
    fontSize: 60,
    fontWeight: "bold",
    color: "white",
    lineHeight: 60,
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
  editButton: {
    backgroundColor: "#0F1321",
    width: 25,
    height: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    padding: 5,
    marginBottom: -26,
    // borderColor: "#D9DDEF",
    // borderWidth: 1,
  },
  editButtonWrapper: {
    zIndex: 10,
  },
})

export default ListItem
