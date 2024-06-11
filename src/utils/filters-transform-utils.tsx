interface AppliedFilter {
    column: string;
    column_type: string;
    operator: string;
    value: any;
}

// Utility function to transform applied filters
export const transformFilters = (appliedFilters: AppliedFilter[]): AppliedFilter[] => {
  return appliedFilters.map(filter => {
    const transformedFilter = { ...filter };

    // Transform integer values
    if (filter.column_type.toLowerCase() === 'integer') {
      transformedFilter.value = parseInt(filter.value, 10);
    }

    // Transform float values
    if (filter.column_type.toLowerCase() === 'float') {
      transformedFilter.value = parseFloat(filter.value);
    }

    // Transform boolean values
    if (filter.column_type.toLowerCase() === 'boolean') {
      transformedFilter.value = filter.value.toLowerCase() === 'true' ? 'true' : 'false';
    }

    // Transform string values with 'IN' operator
    if (filter.column_type.toLowerCase() === 'string' && filter.operator === 'IN') {
      transformedFilter.value = filter.value
        .split(',')
        .map((item: string) => `'${item.trim()}'`)
        .join(',');
    }

    // Transform date values
    if (filter.column_type.toLowerCase() === 'date' || filter.column_type.toLowerCase() === 'timestamp') {
      const date = new Date(filter.value);
      transformedFilter.value = date.toISOString();
    }

    return transformedFilter;
  });
};
