import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, type SpacingToken } from '@/src/constants/theme';

interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  padding?: SpacingToken | 'none';
  style?: StyleProp<ViewStyle>;
}

export function Screen({ children, scrollable = false, padding = 'lg', style }: ScreenProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const horizontal = padding === 'none' ? 0 : Spacing[padding];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]} edges={['top', 'left', 'right']}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontal },
            style,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, { paddingHorizontal: horizontal }, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, paddingVertical: Spacing.md },
  scrollContent: { flexGrow: 1, paddingVertical: Spacing.md },
});
