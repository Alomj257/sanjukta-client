const apis = () => {
  // const local = 'https://sanjukta-server-production.up.railway.app/'
  const local = 'http://localhost:5000/';

  const list = {
    registerUser: `${local}user/register`,
    loginUser: `${local}user/login`,
    forgetPassword: `${local}user/forget/password`,
    verifyOtp: `${local}user/otp/verify`,
    getOtpTime: `${local}user/otp/time`,
    passwordUpdate: `${local}user/password/update`,
    getAccess: `${local}user/get/access`,
    getAllUsers: `${local}user/`,
    getUserById: (id) => `${local}user/${id}`,
    getUserByEmail: (email) => `${local}user/email/${email}`,
    deleteUser: (id) => `${local}user/${id}`,

    // Supplier API 
    getAllSuppliers: `${local}suppliers`,
    addSupplier: `${local}suppliers/add-supplier`,
    deleteSupplier: (id) => `${local}suppliers/delete-supplier/${id}`,
    viewSupplier: (id) => `${local}suppliers/view-supplier/${id}`,
    updateSupplier: (id) => `${local}suppliers/update-supplier/${id}`,

    // Stock API
    getAllStock: `${local}stocks`,
    getStockById: (id) => `${local}stocks/${id}`,
    addStock: `${local}stocks/add`, // Added endpoint for adding stock
    updateStock: (id) => `${local}stocks/update/${id}`, // Added endpoint for updating stock
    deleteStock: (id) => `${local}stocks/delete/${id}`, // Added endpoint for deleting stock

    // Existing API
    getAllExistingItems: `${local}existings`,
    addExistingItem: `${local}existings/add-item`,
    deleteExistingItem: (id) => `${local}existings/delete-item/${id}`,
    getExistingItemById: (id) => `${local}existings/view-item/${id}`,
    updateExistingItem: (id) => `${local}existings/update-item/${id}`,

    // Sections API
    getAllSections: `${local}section`,
    addSections: `${local}section`,
    deleteSection: (id) => `${local}section/${id}`,
    getSectionById: (id) => `${local}section/${id}`,
    updateSection: (id) => `${local}section/${id}`,
    updateSectionDetails: (id) => `${local}section/details/${id}`,
    getSectionByUserId: (userId) => `${local}section/user/data/${userId}`,
    updateSectionStatus: (id, date, status) => `${local}section/status/${id}/${date}/${status}`,

    // Stock Distribution API
    getAllSectionsStock: (sectionId) => `${local}section/stock/${sectionId}/`,
    getAllSectionsStockByDate: (sectionId, date) => `${local}section/stock/${sectionId}/${date}`,
    addStockToSection: (sectionId) => `${local}section/stock/${sectionId}/`,
    getStocksGroupByDate: (sectionId, status) => `${local}section/stock/${sectionId}/group/date/${status}`,
    getAllStocksGroupByDate: (sectionId) => `${local}section/stock/${sectionId}/group/by/date/all`,
    deleteStockFromSection: (sectionId, stockId, date) =>
      `${local}section/stock/${sectionId}/${stockId}/${date}`,
    updateStockSection: (sectionId, stockId, date) =>
      `${local}section/stock/${sectionId}/${stockId}/${date}`,

    // Product API
    addProduct: `${local}product/`,
    updateProduct: (id) => `${local}product/${id}`,
    getAllProduct: `${local}product/`,
    getProductById: (id) => `${local}product/${id}`,
    deleteProduct: (id) => `${local}product/${id}`,
    getProductByDate: (sectionId, date) => `${local}product/date/${sectionId}/${date}`,

    // New Stock
    getAllNewStock: `${local}newStock/`,

    // Return Stock
    addReturnStock: `${local}return-stock/`,

    //Report
    getDailyStockReport: (sectionId, date) =>
      `${local}section/stock/daily-report/${sectionId}/${date}`,
    getMonthlyStockReport: (sectionId, date) =>
      `${local}section/stock/monthly-report/${sectionId}/${date}`,
    //Notification
    getNotifications: `${local}notification`
  };


  return list;
};

export default apis;
