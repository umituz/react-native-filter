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

/**
 * Filter condition interface for data filtering
 * Generic type for filtering data arrays
 */
export interface FilterCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in';
  value: any;
}

/**
 * Data filtering utilities
 */
export class DataFilterUtils {
  /**
   * Apply filters to data array
   */
  static applyFilters<T>(data: T[], filters: FilterCondition[]): T[] {
    if (!filters || filters.length === 0) return data;

    return data.filter((item) => {
      return filters.every((filter) => {
        const value = (item as any)[filter.field];
        
        switch (filter.operator) {
          case 'eq':
            return value === filter.value;
          case 'neq':
            return value !== filter.value;
          case 'gt':
            return value > filter.value;
          case 'gte':
            return value >= filter.value;
          case 'lt':
            return value < filter.value;
          case 'lte':
            return value <= filter.value;
          case 'like':
            return String(value).includes(filter.value);
          case 'ilike':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(value);
          default:
            return true;
        }
      });
    });
  }

  /**
   * Build filter string from filter conditions
   */
  static buildFilterString(filters: FilterCondition[]): string {
    return filters
      .map((filter) => {
        const value = typeof filter.value === 'string' ? `"${filter.value}"` : filter.value;
        return `${filter.field}.${filter.operator}.${value}`;
      })
      .join(',');
  }
}

