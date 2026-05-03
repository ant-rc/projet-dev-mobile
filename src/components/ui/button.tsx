import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { FontSize, Palette, Radii, Spacing } from '@/src/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.label.color} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.labelBase, variantStyle.label, sizeStyle.label]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  labelBase: { fontWeight: '600' },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
});

const VARIANT_STYLES = {
  primary: {
    container: { backgroundColor: Palette.primary },
    label: { color: Palette.white },
  },
  secondary: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: Palette.primary,
    },
    label: { color: Palette.primary },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: { color: Palette.primary },
  },
  danger: {
    container: { backgroundColor: Palette.danger },
    label: { color: Palette.white },
  },
} as const;

const SIZE_STYLES = {
  sm: {
    container: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, minHeight: 36 },
    label: { fontSize: FontSize.sm },
  },
  md: {
    container: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, minHeight: 44 },
    label: { fontSize: FontSize.md },
  },
  lg: {
    container: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, minHeight: 52 },
    label: { fontSize: FontSize.lg },
  },
} as const;
