import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSize, Palette, Radii, Spacing } from '@/src/constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, ...rest }: InputProps) {
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor(
    { light: Palette.mutedLight, dark: Palette.mutedDark },
    'icon',
  );
  const defaultBorder = useThemeColor(
    { light: Palette.borderLight, dark: Palette.borderDark },
    'icon',
  );
  const borderColor = error ? Palette.danger : defaultBorder;
  const helperContent = error ?? helperText;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: textColor }]} accessibilityRole="text">
          {label}
        </Text>
      )}
      <TextInput
        style={[styles.input, { color: textColor, borderColor }]}
        placeholderTextColor={placeholderColor}
        accessibilityLabel={label}
        {...rest}
      />
      {helperContent && (
        <Text style={[styles.helper, error ? styles.errorText : { color: placeholderColor }]}>
          {helperContent}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.xs },
  label: { fontSize: FontSize.sm, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    minHeight: 44,
  },
  helper: { fontSize: FontSize.xs },
  errorText: { color: Palette.danger },
});
