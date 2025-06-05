export const getCleanServiceName = (serviceName: string): string => {
  if (!serviceName) return 'Service';
  
  console.log('Original service name:', serviceName);
  
  // Remove common separators and split
  const separatorRegex = /\s*[-–—|,]\s*/g;
  const parts = serviceName.split(separatorRegex);
  
  console.log('Split parts:', parts);
  
  // Clean each part and remove empty strings
  const cleanedParts = parts
    .map(part => part.trim())
    .filter(part => part.length > 0);
  
  console.log('Cleaned parts:', cleanedParts);
  
  // Remove exact duplicates
  const uniqueParts = [...new Set(cleanedParts)];
  
  console.log('Unique parts:', uniqueParts);
  
  // If we have multiple parts, check for similar parts
  if (uniqueParts.length > 1) {
    const normalized = uniqueParts.map(part => ({
      original: part,
      normalized: part.toLowerCase()
        .replace(/s$/, '') // Remove trailing 's'
        .replace(/ing$/, '') // Remove 'ing'
        .replace(/[^a-z0-9]/g, '') // Keep only alphanumeric
    }));
    
    console.log('Normalized parts:', normalized);
    
    // Keep only truly unique normalized parts
    const reallyUnique = [];
    const seenNormalized = new Set();
    
    for (const item of normalized) {
      if (!seenNormalized.has(item.normalized)) {
        seenNormalized.add(item.normalized);
        reallyUnique.push(item.original);
      }
    }
    
    console.log('Really unique parts:', reallyUnique);
    
    // If we still have multiple unique parts, join them
    if (reallyUnique.length > 1) {
      return reallyUnique.join(' - ');
    }
    
    return reallyUnique[0] || 'Service';
  }
  
  const result = uniqueParts[0] || 'Service';
  console.log('Final result:', result);
  return result;
};
