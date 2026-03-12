import { Pressable, StyleSheet, AccessibilityProps } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme, StyleProp, ViewStyle } from 'react-native';
import { ComponentProps } from 'react';

interface PrimaryButtonProps extends AccessibilityProps {
  icon: ComponentProps<typeof IconSymbol>['name'];
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({ icon, title, onPress, disabled = false,accessible = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "button",
  ...accessibilityProps }: PrimaryButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ThemedView style={styles.container}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        accessibilityState={{ disabled }}
        {...accessibilityProps}
        style={[
          styles.button,
          { backgroundColor: disabled ? '#E0E0E0' : colors.buttonBackground }
        ]}
      >
        <ThemedView style={styles.content}>
          <IconSymbol 
            name={icon} 
            size={24} 
            color={disabled ? '#9E9E9E' : colors.buttonText} 
          />
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.text, 
              { 
                color: disabled ? '#888888' : colors.buttonText, 
                fontFamily: Fonts.semiBold 
              }
            ]}
          >
            {title}
          </ThemedText>
        </ThemedView>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  button: {
    borderRadius: 8,
    width: 280,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
  },
});
