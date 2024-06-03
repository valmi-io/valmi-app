type Condition = {
    operator: string;
    value: string | string[];
};

type TransformedFilter = {
    tag: string;
    operator: string;
    value: string;
};

export default function transformFilters(data: Record<string, any | Condition[]>): { filters: TransformedFilter[]; schema_id: string } {
    // Initialize the transformed filters array
    const filters: TransformedFilter[] = [];

    // Extract schema_id
    const schema_id = data.schema_id;

    filters.push({
        tag: "utcdate", // Assuming date column is "utcdate"
        operator: "BETWEEN",
        value: `'${data.start_date}' AND '${data.end_date}'`,
      });

    // Loop through each key-value pair in the data object
    for (const [key, value] of Object.entries(data)) {
        // Skip schema_id and "filters" key
        if (key === "schema_id" || key === "filters" || key === "start_date" || key === "end_date") {
            continue;
        }

        for (const condition of value) {
                // Handle BETWEEN with separate to and from properties
                if (condition.operator === "BETWEEN" && condition.to !== undefined && condition.from !== undefined) {
                    filters.push({
                        tag: key,
                        operator: "BETWEEN",
                        value: `${condition.from} AND ${condition.to}`,
                    });
                } else if (condition.operator && condition.value) { // Handle other conditions
                    filters.push({
                        tag: key,
                        operator: condition.operator,
                        value: transformConditionValue(condition),
                    });
                }
            }

    }

    return { filters, schema_id };
}

function transformConditionValue(condition: Condition): string {
    if (Array.isArray(condition.value)) {
        return `'${condition.value.join("', '")}'`; // Wrap IN/NOT IN values in single quotes
    } else {
        return condition.value;
    }
}
