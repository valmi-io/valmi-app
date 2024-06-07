// Utility function to calculate date ranges based on selected time range
export const getDateRange = (timeRange: string): { timeRange: string; start_date: Date; end_date: Date } => {
    let startDate = new Date();
    let endDate = new Date();

    switch (timeRange) {
      case 'last7days':
        startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last14days':
        startDate = new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case 'last30days':
        startDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'lastMonth':
        startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        endDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
        break;
      default:
        break;
    }

    return { timeRange, start_date: startDate, end_date: endDate };
  };
