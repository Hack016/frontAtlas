// components/SessionCard.js
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { getUserAvatar } from "../utils/avatar";

export const SessionCard = ({ item }) => {
  return (
    <View style={styles.sessionCard}>
      {/* Nombre de usuario con fecha de la sesión y foto de perfil  */}
      <View style={styles.userHeader}>
        <Image source={getUserAvatar(item.usuario)} style={styles.image} />
        <View>
          <Text style={styles.userSession}>{item.usuario.username}</Text>
          <Text style={styles.sessionDate}>
            {new Date(item.fecha).toLocaleDateString()}
          </Text>
        </View>
      </View>
      {/* Información de la sesión */}
      <Text style={styles.sessionTitle}>{item.nombre}</Text>

      {item.tiempo > 60 ? (
        <View style={styles.sessionRow}>
          <Text style={[styles.sessionInfo, { marginRight: 20 }]}>
            Time: {Math.floor(item.tiempo / 60)} h {item.tiempo % 60} min
          </Text>
          <Text style={styles.sessionInfo}>
            Volume:
            {item.volumen} kg
          </Text>
        </View>
      ) : (
        <View style={styles.sessionRow}>
          <Text style={[styles.sessionInfo, { marginRight: 20 }]}>
            Time: {item.tiempo} min
          </Text>
          <Text style={styles.sessionInfo}>
            Volume:
            {item.volumen} kg
          </Text>
        </View>
      )}

      {item.ejercicios.map((ej, index) => (
        <View key={index} style={styles.exercisePreview}>
          <View style={styles.exerciseRow}>
            <Image source={{ uri: ej.imagen }} style={styles.image} />
            <Text style={styles.exerciseName}>{ej.nombre}</Text>
          </View>
        </View>
      ))}
      {item.morethan3 === true && (
        <Text style={styles.loadMore}>Load more...</Text>
      )}

      <View style={styles.sessionSocial}>
        <Text style={styles.socialText}>
          {item.likes} {item.likes === 1 ? "like" : "likes"} {item.comentarios}{" "}
          {item.comentarios === 1 ? "comment" : "comments"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sessionCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  userSession: {
    fontWeight: "bold",
    fontSize: 16,
  },
  sessionDate: {
    fontSize: 14,
    color: "gray",
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sessionRow: {
    flexDirection: "row",
    marginVertical: 10,
    paddingBottom: 10,
  },
  sessionInfo: {
    fontSize: 14,
    color: "gray",
  },
  exercisePreview: {},
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  exerciseName: {
    fontSize: 14,
    alignContent: "center",
  },
  loadMore: {
    paddingTop: 10,
    fontSize: 14,
    color: "gray",
  },
  sessionSocial: {
    marginTop: 10,
  },
  socialText: {
    fontSize: 14,
    color: "gray",
  },
});
