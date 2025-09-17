import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "./ThemedText";

export const Widget = ({ item }: any) => (
    <TouchableOpacity style={[styles.widget, { backgroundColor: item.bgColor }]}>
      <View style={styles.widgetContent}>
        <Ionicons name={item.iconName} size={24} color={item.textColor} />
        <View style={styles.widgetText}>
          <ThemedText style={[styles.widgetTitle, { color: item.textColor }]}>
            {item.title}
          </ThemedText>
          <ThemedText style={[styles.widgetSubtitle, { color: item.textColor + "80" }]}>
            {item.subtitle}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );




const styles = StyleSheet.create({
  widgetsContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
  },

  widget: {
    borderRadius: 16,
    marginRight: 12,
    minWidth: 200,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  widgetContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  widgetText: {
    flex: 1,
    marginLeft: 12,
  },

  widgetTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },

  widgetSubtitle: {
    fontSize: 14,
  },
});