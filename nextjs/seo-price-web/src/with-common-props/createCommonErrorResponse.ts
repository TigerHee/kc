function createCommonErrorResponse(data?: any, error?: any): any {
  if (typeof window !== 'undefined') {
    return data || null;
  }
  throw error || 'Get Server Side Props Error';
}

export default createCommonErrorResponse;