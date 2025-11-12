/**
 * FilterSheet Component
 *
 * Modern filter bottom sheet using @umituz/react-native-bottom-sheet.
 * Provides a clean, theme-aware filter UI for list screens.
 *
 * Features:
 * - Bottom sheet UI (smooth animations)
 * - Single/multi-select support
 * - Icon support for filter options
 * - Clear filters button
 * - Theme-aware colors
 * - Safe area handling
 *
 * Usage:
 * ```tsx
 * const { sheetRef, open, close } = useBottomSheet();
 * const { selectedIds, handleFilterPress, handleClearFilters } = useListFilters({
 *   options: filterOptions,
 *   defaultFilterId: "all",
 * });
 *
 * <FilterSheet
 *   ref={sheetRef}
 *   options={filterOptions}
 *   selectedIds={selectedIds}
 *   onFilterPress={handleFilterPress}
 *   onClearFilters={handleClearFilters}
 *   onClose={close}
 * />
 * ```
 */

import React, { forwardRef, useCallback, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  AtomicText,
  AtomicButton,
  AtomicIcon,
} from "@umituz/react-native-design-system";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import { useLocalization } from "@umituz/react-native-localization";
import { BottomSheet, type BottomSheetRef } from "@umituz/react-native-bottom-sheet";
import type { FilterOption } from "../../domain/entities/Filter";
import { FilterUtils } from "../../domain/entities/Filter";

export interface FilterSheetProps {
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
 * Modern filter bottom sheet with smooth animations.
 */
export const FilterSheet = forwardRef<BottomSheetRef, FilterSheetProps>(
  (
    {
      options,
      selectedIds,
      onFilterPress,
      onClearFilters,
      onClose,
      defaultFilterId = "all",
      title,
    },
    ref
  ) => {
    const tokens = useAppDesignTokens();
    const { t } = useLocalization();
    const [isRendered, setIsRendered] = useState(false);
    const internalRef = React.useRef<BottomSheetRef>(null);

    // Helper function to ensure component is rendered before calling methods
    const ensureRendered = useCallback(() => {
      if (!isRendered) {
        setIsRendered(true);
        return true; // Component needs to be rendered first
      }
      return false; // Component is already rendered
    }, [isRendered]);

    // Expose ref methods
    React.useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => {
        const needsRender = ensureRendered();
        if (needsRender) {
          // Wait for component to mount, then call snapToIndex
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              internalRef.current?.snapToIndex(index);
            });
          });
        } else {
          internalRef.current?.snapToIndex(index);
        }
      },
      snapToPosition: (position: string | number) => {
        const needsRender = ensureRendered();
        if (needsRender) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              internalRef.current?.snapToPosition(position);
            });
          });
        } else {
          internalRef.current?.snapToPosition(position);
        }
      },
      expand: () => {
        const needsRender = ensureRendered();
        if (needsRender) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              internalRef.current?.expand();
            });
          });
        } else {
          internalRef.current?.expand();
        }
      },
      collapse: () => {
        if (isRendered) {
          internalRef.current?.collapse();
        }
      },
      close: () => {
        if (isRendered) {
          internalRef.current?.close();
        }
      },
    }), [isRendered, ensureRendered]);

    const activeFilter = FilterUtils.getActiveFilter(selectedIds, defaultFilterId);
    const hasActiveFilter = FilterUtils.hasActiveFilter(selectedIds, defaultFilterId);

    const handleFilterPressWithClose = useCallback(
      (filterId: string) => {
        onFilterPress(filterId);
        // Auto-close on single-select mode (common pattern)
        // Remove this if you want manual close control
      },
      [onFilterPress]
    );

    const handleClose = useCallback(() => {
      onClose?.();
    }, [onClose]);

    // Lazy rendering: Only render BottomSheet when it's been opened at least once
    // This prevents Reanimated initialization errors on app startup
    if (!isRendered) {
      return null;
    }

    return (
      <BottomSheet
        ref={internalRef}
        preset="medium"
        enableBackdrop
        onClose={handleClose}
      >
        <View style={styles.container}>
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
              onPress={handleClose}
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
        </View>
      </BottomSheet>
    );
  }
);

FilterSheet.displayName = "FilterSheet";

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexGrow: 1,
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

