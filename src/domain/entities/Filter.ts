/**
 * Filter Domain Entity
 *
 * Core types and interfaces for the filter system.
 */

/**
 * Filter option interface
 */
export interface FilterOption {
  id: string;
  label: string;
  icon?: string;
}

/**
 * Filter configuration
 */
export interface FilterConfig {
  options: FilterOption[];
  defaultFilterId?: string;
  singleSelect?: boolean; // If true, only one filter can be selected at a time
}

/**
 * Filter utilities
 */
export class FilterUtils {
  /**
   * Check if a filter is active (not default)
   */
  static isActiveFilter(
    filterId: string,
    defaultFilterId: string = "all"
  ): boolean {
    return filterId !== defaultFilterId;
  }

  /**
   * Get active filter from selected IDs
   */
  static getActiveFilter(
    selectedIds: string[],
    defaultFilterId: string = "all"
  ): string {
    return selectedIds[0] || defaultFilterId;
  }

  /**
   * Check if any filter is active
   */
  static hasActiveFilter(
    selectedIds: string[],
    defaultFilterId: string = "all"
  ): boolean {
    const activeFilter = this.getActiveFilter(selectedIds, defaultFilterId);
    return this.isActiveFilter(activeFilter, defaultFilterId);
  }
}

