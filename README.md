# @umituz/react-native-filter

Modern, reusable filter system for React Native with bottom sheet UI, single/multi-select support, and theme-aware design.

## Installation

```bash
npm install @umituz/react-native-filter
```

## Peer Dependencies

- `react` >= 18.2.0
- `react-native` >= 0.74.0
- `react-native-safe-area-context` >= 5.0.0
- `@umituz/react-native-design-system` >= 1.0.0
- `@umituz/react-native-design-system-theme` >= 1.0.0
- `@umituz/react-native-localization` >= 1.0.0

## Features

- ✅ Native Modal UI (no extra dependencies, works out of the box)
- ✅ Single/multi-select support
- ✅ Icon support for filter options
- ✅ Clear filters button
- ✅ Theme-aware colors
- ✅ Safe area handling
- ✅ Offline-compatible (100% client-side)
- ✅ TypeScript support

## Usage

### Basic Usage

```tsx
import { useState } from 'react';
import {
  FilterSheet,
  useListFilters,
} from '@umituz/react-native-filter';

const MyScreen = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  
  const filterOptions = [
    { id: 'all', label: 'All Items' },
    { id: 'active', label: 'Active', icon: 'Circle' },
    { id: 'completed', label: 'Completed', icon: 'CircleCheck' },
  ];

  const { selectedIds, handleFilterPress, handleClearFilters } = useListFilters({
    options: filterOptions,
    defaultFilterId: 'all',
  });

  return (
    <>
      <Button onPress={() => setFilterVisible(true)}>Filter</Button>
      <FilterSheet
        visible={filterVisible}
        options={filterOptions}
        selectedIds={selectedIds}
        onFilterPress={handleFilterPress}
        onClearFilters={handleClearFilters}
        onClose={() => setFilterVisible(false)}
      />
    </>
  );
};
```

### With Filter Icon Button

```tsx
import { AtomicIcon } from '@umituz/react-native-design-system';
import {
  FilterSheet,
  useListFilters,
  useBottomSheet,
} from '@umituz/react-native-filter';

const MyScreen = () => {
  const { sheetRef, open, close } = useBottomSheet();
  const { selectedIds, handleFilterPress, handleClearFilters, hasActiveFilter } = useListFilters({
    options: filterOptions,
    defaultFilterId: 'all',
  });

  return (
    <>
      <TouchableOpacity onPress={open}>
        <AtomicIcon
          name="Filter"
          size="md"
          color={hasActiveFilter ? "primary" : "secondary"}
        />
        {hasActiveFilter && (
          <View style={styles.filterBadge} />
        )}
      </TouchableOpacity>
      
      <FilterSheet
        ref={sheetRef}
        options={filterOptions}
        selectedIds={selectedIds}
        onFilterPress={handleFilterPress}
        onClearFilters={handleClearFilters}
        onClose={close}
      />
    </>
  );
};
```

### Applying Filters to Data

```tsx
const { applyFilters } = useListFilters({
  options: filterOptions,
  defaultFilterId: 'all',
});

const filteredItems = applyFilters(items, (item, filterId) => {
  if (filterId === 'all') return true;
  if (filterId === 'active') return item.status === 'active';
  if (filterId === 'completed') return item.status === 'completed';
  return false;
});
```

### Multi-Select Mode

```tsx
const { selectedIds, handleFilterPress } = useListFilters({
  options: filterOptions,
  defaultFilterId: 'all',
  singleSelect: false, // Enable multi-select
});
```

## API

### Components

- `FilterSheet`: Main filter bottom sheet component

### Hooks

- `useListFilters(config)`: Hook for managing filter state
- `useListModals()`: Hook for managing modal visibility (optional)
- `useBottomSheet()`: Hook for managing bottom sheet state (re-exported)

### Types

- `FilterOption`: Filter option interface
- `FilterConfig`: Filter configuration interface
- `UseListFiltersReturn`: Return type of useListFilters hook

## License

MIT

