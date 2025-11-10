/**
 * useListModals Hook
 *
 * Hook for managing modal visibility state in list screens.
 * Provides simple state management for filter and sort modals.
 */

import { useState } from "react";

export interface UseListModalsReturn {
  filterModalVisible: boolean;
  sortModalVisible: boolean;
  openFilterModal: () => void;
  closeFilterModal: () => void;
  toggleFilterModal: () => void;
  openSortModal: () => void;
  closeSortModal: () => void;
  toggleSortModal: () => void;
}

export const useListModals = (): UseListModalsReturn => {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const openFilterModal = () => setFilterModalVisible(true);
  const closeFilterModal = () => setFilterModalVisible(false);
  const toggleFilterModal = () => setFilterModalVisible((prev) => !prev);

  const openSortModal = () => setSortModalVisible(true);
  const closeSortModal = () => setSortModalVisible(false);
  const toggleSortModal = () => setSortModalVisible((prev) => !prev);

  return {
    filterModalVisible,
    sortModalVisible,
    openFilterModal,
    closeFilterModal,
    toggleFilterModal,
    openSortModal,
    closeSortModal,
    toggleSortModal,
  };
};

