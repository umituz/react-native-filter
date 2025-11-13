/**
 * FilterSheet Component
 *
 * Simple filter modal using React Native's native Modal component.
 * No extra dependencies, works out of the box.
 *
 * Features:
 * - Native Modal (no Reanimated issues)
 * - Single/multi-select support
 * - Icon support for filter options
 * - Clear filters button
 * - Theme-aware colors
 * - Safe area handling
 *
 * Usage:
 * ```tsx
 * const [visible, setVisible] = useState(false);
 * const { selectedIds, handleFilterPress, handleClearFilters } = useListFilters({
 *   options: filterOptions,
 *   defaultFilterId: "all",
 * });
 *
 * <FilterSheet
 *   visible={visible}
 *   options={filterOptions}
 *   selectedIds={selectedIds}
 *   onFilterPress={handleFilterPress}
 *   onClearFilters={handleClearFilters}
 *   onClose={() => setVisible(false)}
 * />
 * ```
 */

import React, { useCallback } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AtomicText,
  AtomicButton,
  AtomicIcon,
} from "@umituz/react-native-design-system";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import { useLocalization } from "@umituz/react-native-localization";
import type { FilterOption } from "../../domain/entities/Filter";
import { FilterUtils } from "../../domain/entities/Filter";

export interface FilterSheetProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean;
  /**
   * Filter options to display
   */
  options: FilterOption[];
  /**
   * Currently selected filter IDs
   */
  selectedIds: string[];
  /**
   * Callback when a filter option is pressed
   */
  onFilterPress: (filterId: string) => void;
  /**
   * Callback to clear all filters
   */
  onClearFilters: () => void;
  /**
   * Callback when sheet is closed
   */
  onClose?: () => void;
  /**
   * Default filter ID (usually "all")
   */
  defaultFilterId?: string;
  /**
   * Title for the filter sheet
   */
  title?: string;
}

/**
 * FilterSheet Component
 *
 * Simple native Modal-based filter sheet - no extra dependencies.
 */
export const FilterSheet: React.FC<FilterSheetProps> = ({
  visible,
  options,
  selectedIds,
  onFilterPress,
  onClearFilters,
  onClose,
  defaultFilterId = "all",
  title,
}) => {
  const tokens = useAppDesignTokens();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();

  const hasActiveFilter = FilterUtils.hasActiveFilter(selectedIds, defaultFilterId);

  const handleFilterPressWithClose = useCallback(
    (filterId: string) => {
      onFilterPress(filterId);
      onClose?.();
    },
    [onFilterPress, onClose]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: tokens.colors.surface,
              paddingBottom: insets.bottom,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle indicator */}
          <View style={[styles.handle, { backgroundColor: tokens.colors.border }]} />

          {/* Header */}
          <View
            style={[
              styles.header,
              {
                borderBottomColor: tokens.colors.border,
                borderBottomWidth: tokens.borders.width.thin,
              },
            ]}
          >
            <AtomicText type="headlineMedium" style={styles.title}>
              {title || t("general.filter") || "Filter"}
            </AtomicText>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="close-filter-sheet"
            >
              <AtomicIcon name="X" size="md" color="primary" />
            </TouchableOpacity>
          </View>

          {/* Filter Options */}
          <ScrollView
            style={styles.optionsList}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option) => {
              const isSelected = selectedIds.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleFilterPressWithClose(option.id)}
                  style={[
                    styles.option,
                    {
                      borderBottomColor: tokens.colors.borderLight,
                      borderBottomWidth: tokens.borders.width.thin,
                    },
                    isSelected && {
                      backgroundColor: tokens.colors.primary + "15",
                    },
                  ]}
                  testID={`filter-option-${option.id}`}
                >
                  <View style={styles.optionContent}>
                    {option.icon && (
                      <AtomicIcon
                        name={option.icon as any}
                        size="md"
                        color={isSelected ? "primary" : "secondary"}
                      />
                    )}
                    <AtomicText
                      type="bodyLarge"
                      style={[
                        styles.optionLabel,
                        isSelected && {
                          color: tokens.colors.primary,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {option.label}
                    </AtomicText>
                  </View>
                  {isSelected && (
                    <AtomicIcon
                      name="CircleCheck"
                      size="md"
                      color="primary"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Clear Filters Button */}
          {hasActiveFilter && (
            <View
              style={[
                styles.footer,
                {
                  borderTopColor: tokens.colors.border,
                  borderTopWidth: tokens.borders.width.thin,
                },
              ]}
            >
              <AtomicButton
                variant="outline"
                onPress={onClearFilters}
                fullWidth
                testID="clear-filters-button"
              >
                {t("general.clear") || "Clear"}
              </AtomicButton>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

FilterSheet.displayName = "FilterSheet";

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  title: {
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  optionsList: {
    maxHeight: 400,
    paddingVertical: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  optionLabel: {
    flex: 1,
  },
});

