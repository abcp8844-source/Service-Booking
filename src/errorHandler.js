export const getErrorMessage = (error) => {
  const errorMap = {
    // Auth Errors
    'auth/invalid-credential': { code: 'ERR-101', msg: 'Invalid login credentials.' },
    'auth/user-not-found': { code: 'ERR-102', msg: 'User account not found.' },
    
    // Firestore/Permission Errors
    'permission-denied': { code: 'ERR-403', msg: 'Access denied. You do not have permission.' },
    'unavailable': { code: 'ERR-503', msg: 'Service is temporarily unavailable.' },
    'not-found': { code: 'ERR-404', msg: 'Requested data not found.' },
    
    // Network/Connection Errors
    'network-request-failed': { code: 'ERR-001', msg: 'Network connection issue. Please check your internet.' },
    
    // Default Fallback
    'default': { code: 'ERR-000', msg: 'An unexpected error occurred. Please try again later.' }
  };

  // اگر ایرر کوڈ میپ میں موجود ہے تو وہ دکھائے ورنہ ڈیفالٹ
  const err = errorMap[error.code] || errorMap['default'];
  
  // پروفیشنل طریقہ: صرف کوڈ اور میسج دکھائیں
  return `Error [${err.code}]: ${err.msg}`;
};
