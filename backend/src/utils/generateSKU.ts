export const generateSKU = (productName: string, categoryName: string): string => {
  const timestamp = Date.now().toString().slice(-6);
  const namePrefix = productName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  const categoryPrefix = categoryName.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, '');
  
  // Ensure we have at least 2 characters for prefixes
  const finalNamePrefix = namePrefix.padEnd(3, 'X');
  const finalCategoryPrefix = categoryPrefix.padEnd(2, 'X');
  
  return `${finalCategoryPrefix}-${finalNamePrefix}-${timestamp}`;
};

export const isValidSKU = (sku: string): boolean => {
  // SKU format: XX-XXX-XXXXXX (category-product-timestamp)
  const skuRegex = /^[A-Z]{2}-[A-Z]{3}-\d{6}$/;
  return skuRegex.test(sku);
};