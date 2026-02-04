export const getDateRangeFromTimeline = (timeline) => {
  const today = new Date();
  
  if (!timeline || timeline === 'flexible') return null;
  
  if (timeline === 'immediate') {
    // Available now or within next 7 days
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);
    return {
      start: new Date(today),
      end: endDate
    };
  } 
  else if (timeline === 'within_week') {
    // Available within next 7 days
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);
    return {
      start: new Date(today),
      end: endDate
    };
  } 
  else if (timeline === 'within_month') {
    // Available within next 30 days
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);
    return {
      start: new Date(today),
      end: endDate
    };
  } 
  else if (timeline === '1_3_months') {
    // Available within 1-3 months
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() + 1);
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + 3);
    return {
      start: startDate,
      end: endDate
    };
  } 
  else if (timeline === '3_6_months') {
    // Available within 3-6 months
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() + 3);
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + 6);
    return {
      start: startDate,
      end: endDate
    };
  } 
  else {
    return null;
  }
};

// Helper to show availability text
export const getAvailabilityText = (availableFrom) => {
  const availableDate = new Date(availableFrom);
  const today = new Date();
  const diffTime = Math.abs(availableDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) {
    return "Available Now";
  } else if (diffDays <= 7) {
    return `Available in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  } else if (diffDays <= 30) {
    return `Available in ${Math.ceil(diffDays / 7)} weeks`;
  } else {
    return `Available ${availableDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }
};