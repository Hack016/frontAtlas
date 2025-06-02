import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryBar,
  VictoryVoronoiContainer,
  VictoryArea,
  VictoryGroup,
  VictoryPolarAxis,
} from "victory-native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { BASE_URL } from "../../context/config";
import { Picker } from "@react-native-picker/picker";
import { getMuscleGroupPercentages } from "../../utils/musclegroup_converter";

const screenWidth = Dimensions.get("window").width;

export default function StatsScreen() {
  const fetchWithAuth = useFetchWithAuth();

  const [period, setPeriod] = useState("3months");
  const [metric, setMetric] = useState("volume");
  const [muscleperiod, setMusclePeriod] = useState("3months");
  const [lineData, setLineData] = useState([]);
  const [muscleData, setMuscleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBar, setSelectedBar] = useState(null);

  const fetchLineData = async () => {
    setLoading(true);
    let endpoint = "";

    if (metric === "volume") {
      endpoint = "Volume";
    } else if (metric === "duration") {
      endpoint = "Duration";
    } else if (metric === "sets") {
      endpoint = "Set";
    }

    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/get${endpoint}Stats/?period=${period}`
      );
      const data = await response.json();

      const formattedData = data.map((item, index) => {
        const date = new Date(item.periodo);
        let label = "";
        if (period === "3months") {
          label = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        } else if (period === "year") {
          label = date.toLocaleDateString("en-US", { month: "short" });
        } else if (period === "all") {
          label = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
        }
        return {
          x: label,
          y:
            metric === "volume"
              ? item.volumen / 1000
              : metric === "duration"
                ? Math.round(item.duration / 60)
                : item.sets,
        };
      });

      setLineData(formattedData);
      setSelectedBar(null);
    } catch (error) {
      console.error("Error fetching line data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMuscleData = async () => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/getMuscleStats/?period=${muscleperiod}`
      );
      const data = await response.json();

      setMuscleData(getMuscleGroupPercentages(data));
    } catch (error) {
      console.error("Error fetching muscle data:", error);
    }
  };

  useEffect(() => {
    fetchLineData();
    // fetchMuscleData();
  }, [period, metric]);

  useEffect(() => {
    fetchMuscleData();
  }, [muscleperiod]);

  // Valor máximo y grid personalizado (en forma hexagonal) para el radar chart
  const maxValue =
    muscleData.reduce((max, point) => Math.max(max, point.y), 0) + 0.05; //Le sumo 0.05 para que no este en el maximo nunca y se vea mejor
  // Uso lenght: 5 porque quiero 5 hexagonos desde el centro hacia afuera
  const gridData = Array.from({ length: 5 }, (_, level) =>
    muscleData.map((point) => ({
      x: point.x,
      y: (maxValue / 5) * (level + 1),
    }))
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.StatsTitulo}>Track your progress</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <View style={styles.row}>
              <Text style={styles.title}>
                {selectedBar
                  ? `${selectedBar.x} - ${selectedBar.y} ${
                      metric === "volume"
                        ? "kg"
                        : metric === "duration"
                          ? "hours"
                          : "sets"
                    }`
                  : "Bar Graph"}
              </Text>
              <Picker
                selectedValue={period}
                onValueChange={(itemValue) => setPeriod(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="3 Months" value="3months" />
                <Picker.Item label="Year" value="year" />
                <Picker.Item label="All Time" value="all" />
              </Picker>
            </View>

            <View style={styles.bargraphContainer}>
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={{ x: 30, y: 10 }}
                width={350}
                height={250}
                padding={{ top: 20, bottom: 50, left: 60, right: 20 }}
                animate={{ duration: 1000, easing: "bounce" }}
                containerComponent={
                  <VictoryVoronoiContainer
                    onActivated={(points) => {
                      // points es un array con los puntos activados (normalmente 1)
                      if (points.length > 0) {
                        setSelectedBar(points[0]);
                      }
                    }}
                  />
                }
              >
                <VictoryAxis
                  fixLabelOverlap
                  style={{
                    tickLabels: { fontSize: 12, padding: 5 },
                  }}
                  tickFormat={(t, index) => {
                    // Para que no se solapen las etiquetas, muestro 1 de cada 3
                    return index % 3 === 0 ? t : "";
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    tickLabels: { fontSize: 12, padding: 5 },
                  }}
                  tickFormat={(tick) => {
                    if (metric === "volume") {
                      return `${tick}k kg`;
                    } else if (metric === "duration") {
                      return `${tick} hrs`;
                    } else {
                      return `${tick} sets`;
                    }
                  }}
                />
                <VictoryBar
                  data={lineData}
                  barWidth={20}
                  style={{
                    data: {
                      fill: "#4A90E2",
                      stroke: "#357ABD",
                      strokeWidth: 2,
                    },
                  }}
                />
              </VictoryChart>
              <View style={styles.row}>
                <Pressable
                  style={[
                    styles.button,
                    metric === "volume" && styles.buttonActive,
                  ]}
                  onPress={() => {
                    setMetric("volume");
                    setSelectedBar(null);
                  }}
                >
                  <Text style={styles.buttonText}>Volume</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    metric === "duration" && styles.buttonActive,
                  ]}
                  onPress={() => {
                    setMetric("duration");
                    setSelectedBar(null);
                  }}
                >
                  <Text style={styles.buttonText}>Duration</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    metric === "sets" && styles.buttonActive,
                  ]}
                  onPress={() => {
                    setMetric("sets");
                    setSelectedBar(null);
                  }}
                >
                  <Text style={styles.buttonText}>Sets</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
        <Text style={styles.StatsTitulo}>Muscle Distribution</Text>
        <Picker
          selectedValue={muscleperiod}
          onValueChange={(itemValue) => setMusclePeriod(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="3 Months" value="3months" />
          <Picker.Item label="Year" value="year" />
          <Picker.Item label="All Time" value="all" />
        </Picker>
        <VictoryChart
          polar //El prop polar indica que se trata de un gráfico polar (circular) en vez de cartesiano (rectangular)
          width={screenWidth - 16}
          height={screenWidth - 16}
          domain={{ y: [0, maxValue] }}
        >
          <VictoryGroup
            color="#007AFF"
            style={{ data: { fillOpacity: 0.4, strokeWidth: 2 } }}
          >
            <VictoryArea data={muscleData} />
          </VictoryGroup>

          {muscleData.map((point, i) => (
            <VictoryPolarAxis
              dependentAxis
              key={i}
              label={point.x}
              labelPlacement="perpendicular"
              style={{
                axisLabel: { padding: 10, fontSize: 14, fill: "gray" },
                tickLabels: { fill: "transparent" }, // ocultamos números en el eje radial
                axis: { stroke: "none" },
              }}
              axisValue={point.x}
              domain={[0, maxValue]}
            />
          ))}
          {/* Cada uno de los hexagonos que forma el grid del radar: */}
          {gridData.map((levelData, i) => (
            <VictoryGroup
              key={i}
              style={{
                data: {
                  stroke: "gray",
                  strokeWidth: 0.4,
                  fill: "transparent",
                },
              }}
            >
              <VictoryArea data={levelData} />
            </VictoryGroup>
          ))}

          <VictoryPolarAxis
            style={{
              tickLabels: { fill: "transparent" }, //ocultar los labels del polaraxis por defecto
              axis: { stroke: "none" },
              grid: { stroke: "#ccc", opacity: 0.5 },
            }}
          />
        </VictoryChart>
        <View style={{ marginBottom: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  StatsTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "grey",
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    alignItems: "center",
  },
  bargraphContainer: {
    flex: 1,
    width: "100%",
    // alignItems: "center",
    // justifyContent: "center",
  },
  button: {
    backgroundColor: "#4F4F4F",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: "#4A90E2",
    borderColor: "#357ABD",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    flex: 1,
    marginLeft: 10,
  },
});
