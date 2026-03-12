import { StyleSheet, Text, TextStyle, useColorScheme, AccessibilityProps } from "react-native";
import { Colors, Fonts } from "@/constants/theme";

interface TitleProps extends AccessibilityProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
}

export function Title({ children, style,
  accessible = true,
  accessibilityRole = "header",
  accessibilityLabel,
  ...accessibilityProps
}: TitleProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Text
      style={[
        styles.title,
        { color: colors.text, fontFamily: Fonts.bold },
        style,
      ]}
      accessible={accessible}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      {...accessibilityProps}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "left",
    paddingTop: 75,
    paddingLeft: 20,
  },
});