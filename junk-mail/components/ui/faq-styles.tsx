import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/theme";

export const faqStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  faqItem: {
    backgroundColor: "#FFF7F7",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingRight: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Fonts.regular,
    flex: 1,
    paddingRight: 12,
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  answerText: {
    fontSize: 16,
    color: "#2C2C2C",
    fontFamily: Fonts.regular,
    lineHeight: 24,
  },
  bulletContainer: {
    marginTop: 12,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 18,
    color: "#324D7F",
    marginRight: 10,
    fontFamily: Fonts.bold,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 15,
    color: "#2C2C2C",
    fontFamily: Fonts.regular,
    lineHeight: 22,
    flex: 1,
  },
});