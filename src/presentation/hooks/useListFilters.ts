/**
 * useListFilters Hook
 *
 * Hook for managing filter state in list screens.
 * Supports both single-select and multi-select modes.
 */

import { useState, useMemo } from "react";
import type { FilterOption, FilterConfig } from "../../domain/entities/Filter";
import { FilterUtils } from "../../domain/entities/Filter";

export interface UseListFiltersReturn {
  selectedIds: string[];
  activeFilter: string;
  hasActiveFilter: boolean;
  handleFilterPress: (filterId: string) => void;
  handleClearFilters: () => void;
  applyFilters: <T>(
    items: T[],
    filterFn: (item: T, filterId: string) => boolean
  ) => T[];
  filterOptions: FilterOption[];
}

export const useListFilters = (
  config: FilterConfig
): UseListFiltersReturn => {
  const defaultFilterId = config.defaultFilterId || "all";
  const [selectedIds, setSelectedIds] = useState<string[]>([defaultFilterId]);

  const activeFilter = useMemo(() => {
    return FilterUtils.getActiveFilter(selectedIds, defaultFilterId);
  }, [selectedIds, defaultFilterId]);

  const hasActiveFilter = useMemo(() => {
    return FilterUtils.hasActiveFilter(selectedIds, defaultFilterId);
  }, [selectedIds, defaultFilterId]);

  const handleFilterPress = (filterId: string) => {
    if (config.singleSelect !== false) {
      // Single select mode (default)
      // If clicking the same filter, deselect it (go back to default)
      if (selectedIds.includes(filterId) && filterId !== defaultFilterId) {
        setSelectedIds([defaultFilterId]);
      } else {
        // Select the new filter
        setSelectedIds([filterId]);
      }
    } else {
      // Multi-select mode
      if (filterId === defaultFilterId) {
        setSelectedIds([defaultFilterId]);
      } else if (selectedIds.includes(filterId)) {
        // Deselect
        const newIds = selectedIds.filter((id) => id !== filterId);
        setSelectedIds(newIds.length > 0 ? newIds : [defaultFilterId]);
      } else {
        // Select (remove default if present)
        const newIds = selectedIds.filter((id) => id !== defaultFilterId);
        setSelectedIds([...newIds, filterId]);
      }
    }
  };

  const handleClearFilters = () => {
    setSelectedIds([defaultFilterId]);
  };

  const applyFilters = <T>(
    items: T[],
    filterFn: (item: T, filterId: string) => boolean
  ): T[] => {
    if (!hasActiveFilter) return items;

    return items.filter((item) => {
      return selectedIds.some((filterId) => filterFn(item, filterId));
    });
  };

  return {
    selectedIds,
    activeFilter,
    hasActiveFilter,
    handleFilterPress,
    handleClearFilters,
    applyFilters,
    filterOptions: config.options,
  };
};

