
const apis = () => {
  const local = 'https://sanjukta-server-production.up.railway.app/'

  const list = {
    registerUser:`${local}user/register`,
    loginUser: `${local}user/login`,
    forgetPassword: `${local}user/forget/password`,
    verifyOtp: `${local}user/otp/verify`,
    getOtpTime:`${local}user/otp/time`,
    passwordUpdate: `${local}user/password/update`,
    getAccess: `${local}user/get/access`,
    getAllUsers: `${local}user/`,
    getUserById:(id)=> `${local}user/${id}`,
    getUserByEmail:(email)=> `${local}user/email/${email}`,
    deleteUser: (id) => `${local}user/${id}`,

    // Supplier api 
    getAllSuppliers: `${local}suppliers`,
    addSupplier: `${local}suppliers/add-supplier`,
    deleteSupplier: (id) => `${local}suppliers/delete-supplier/${id}`,
    viewSupplier : (id) => `${local}suppliers/view-supplier/${id}`,
    updateSupplier : (id) => `${local}suppliers/update-supplier/${id}`,

    // Stock api
    getAllStock : `${local}stocks`,
    getStockById :(id)=> `${local}stocks/${id}`,

    // Existing api
    getAllExistingItems:`${local}existings`,
    addExistingItem: `${local}existings/add-item`,
    deleteExistingItem: (id) => `${local}existings/delete-item/${id}`,
    getExistingItemById: (id) => `${local}existings/view-item/${id}`,
    updateExistingItem: (id) => `${local}existings/update-item/${id}`,

    // sections API
    getAllSections:`${local}section`,
    addSections: `${local}section`,
    deleteSection: (id) => `${local}section/${id}`,
    getSectionById: (id) => `${local}section/${id}`,
    updateSection: (id) => `${local}section/${id}`,
    getSectionByUserId: (userId) => `${local}section/user/data/${userId}`,
    updateSectionStatus: (id,date,status) => `${local}section/status/${id}/${date}/${status}`,
    // stock distribution API
    getAllSectionsStock:(sectionId)=>`${local}section/stock/${sectionId}/`,
    getAllSectionsStockByDate:(sectionId,date)=>`${local}section/stock/${sectionId}/${date}`,
    addStockToSection:(sectionId)=> `${local}section/stock/${sectionId}/`,
    getStocksGroupByDate:(sectionId,status)=> `${local}section/stock/${sectionId}/group/date/${status}`,
    getAllStocksGroupByDate: (sectionId) => `${local}section/stock/${sectionId}/group/by/date/all`,
    deleteStockFromSection: (sectionId,stockId,date) => `${local}section/stock/${sectionId}/${stockId}/${date}`,
    updateStockSection: (sectionId,stockId,date) => `${local}section/stock/${sectionId}/${stockId}/${date}`,

    // product
    addProduct:`${local}product/`,
    updateProduct:(id)=>`${local}product/${id}`,
    getAllProduct:`${local}product/`,
    getProductById:(id)=>`${local}product/${id}`,
    deleteProduct:(id)=>`${local}product/${id}`,
    getProductByDate:(sectionId,date)=>`${local}product/date/${sectionId}/${date}`,
    // new Stock
    getAllNewStock:`${local}newStock/`,
    // return stock
    addReturnStock:`${local}return-stock/`
  }

  return list;
};

export default apis;
