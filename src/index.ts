/**
 * React Native Filter - Barrel Export
 *
 * Modern, reusable filter system for React Native with bottom sheet UI.
 *
 * Features:
 * - Bottom sheet UI (smooth animations)
 * - Single/multi-select support
 * - Icon support for filter options
 * - Clear filters button
 * - Theme-aware colors
 * - Safe area handling
 * - Offline-compatible (100% client-side)
 *
 * Usage:
 * ```tsx
 * import {
 *   FilterSheet,
 *   useListFilters,
 *   useListModals,
 *   useBottomSheet,
 * } from '@umituz/react-native-filter';
 * import { BottomSheet } from '@umituz/react-native-bottom-sheet';
 *
 * const MyScreen = () => {
 *   const { sheetRef, open, close } = useBottomSheet();
 *   const { openFilterModal, closeFilterModal } = useListModals();
 *   const { selectedIds, handleFilterPress, handleClearFilters } = useListFilters({
 *     options: [
 *       { id: 'all', label: 'All Items' },
 *       { id: 'active', label: 'Active', icon: 'Circle' },
 *       { id: 'completed', label: 'Completed', icon: 'CircleCheck' },
 *     ],
 *     defaultFilterId: 'all',
 *   });
 *
 *   return (
 *     <>
 *       <Button onPress={open}>Filter</Button>
 *       <FilterSheet
 *         ref={sheetRef}
 *         options={filterOptions}
 *         selectedIds={selectedIds}
 *         onFilterPress={handleFilterPress}
 *         onClearFilters={handleClearFilters}
 *         onClose={close}
 *       />
 *     </>
 *   );
 * };
 * ```
 *
 * Technical:
 * - Uses React Native's native Modal component (no extra dependencies)
 * - Theme-aware with @umituz/react-native-design-system-theme
 * - Localization support with @umituz/react-native-localization
 * - Zero backend dependencies
 */

// Domain Entities
export type { FilterOption, FilterConfig, FilterCondition } from "./domain/entities/Filter";
export { FilterUtils, DataFilterUtils } from "./domain/entities/Filter";

// Hooks
export { useListFilters, type UseListFiltersReturn } from "./presentation/hooks/useListFilters";
export { useListModals, type UseListModalsReturn } from "./presentation/hooks/useListModals";

// Components
export { FilterSheet, type FilterSheetProps } from "./presentation/components/FilterSheet";

