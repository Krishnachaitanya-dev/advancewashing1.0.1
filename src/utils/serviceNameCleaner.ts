
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
  
  // More aggressive duplicate removal - normalize and compare
  const normalizedParts = cleanedParts.map(part => part.toLowerCase().replace(/\s+/g, ' ').trim());
  
  // Find the first unique part by checking if it's already included in previous parts
  const uniqueParts = [];
  const seen = new Set<string>();
  
  for (let i = 0; i < normalizedParts.length; i++) {
    const normalized = normalizedParts[i];
    const original = cleanedParts[i];
    
    // Check if this normalized part is similar to any we've already seen
    let isDuplicate = false;
    
    for (const seenPart of seen) {
      // Check for exact match or if one contains the other
      if (normalized === seenPart || 
          normalized.includes(seenPart) || 
          seenPart.includes(normalized)) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      seen.add(normalized);
      uniqueParts.push(original);
    }
  }
  
  console.log('Unique parts after aggressive filtering:', uniqueParts);
  
  // If we still have multiple parts, try to find the most meaningful one
  if (uniqueParts.length > 1) {
    // Prefer parts that are not just service types like "Wash & Fold"
    const meaningfulParts = uniqueParts.filter(part => 
      !part.toLowerCase().includes('wash') &&
      !part.toLowerCase().includes('fold') &&
      !part.toLowerCase().includes('iron') &&
      !part.toLowerCase().includes('steam')
    );
    
    if (meaningfulParts.length > 0) {
      console.log('Using meaningful part:', meaningfulParts[0]);
      return meaningfulParts[0];
    }
  }
  
  // Return the first unique part or fallback
  const result = uniqueParts[0] || 'Service';
  console.log('Final result:', result);
  return result;
};
