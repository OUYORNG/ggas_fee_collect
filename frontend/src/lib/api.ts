import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Students
export const studentsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string; gradeId?: string }) =>
    api.get('/students', { params }),
  getById: (id: string) => api.get(`/students/${id}`),
  getByStudentId: (studentId: string) => api.get(`/students/student-id/${studentId}`),
  create: (data: any) => api.post('/students', data),
  update: (id: string, data: any) => api.put(`/students/${id}`, data),
  delete: (id: string) => api.delete(`/students/${id}`),
  getSiblings: (id: string) => api.get(`/students/${id}/siblings`),
};

// Grades
export const gradesApi = {
  getAll: () => api.get('/grades'),
  getById: (id: string) => api.get(`/grades/${id}`),
  create: (data: any) => api.post('/grades', data),
  update: (id: string, data: any) => api.put(`/grades/${id}`, data),
  delete: (id: string) => api.delete(`/grades/${id}`),
  getNextGrade: (id: string) => api.get(`/grades/${id}/next`),
  promoteStudent: (studentId: string) => api.post(`/grades/${studentId}/promote`),
  setPromotion: (fromGradeId: string, toGradeId: string) => 
    api.post('/grades/promotion/set', { fromGradeId, toGradeId }),
};

// Programs
export const programsApi = {
  getAll: (gradeId?: string) => api.get('/programs', { params: { gradeId } }),
  getById: (id: string) => api.get(`/programs/${id}`),
  create: (data: any) => api.post('/programs', data),
  update: (id: string, data: any) => api.put(`/programs/${id}`, data),
  delete: (id: string) => api.delete(`/programs/${id}`),
};

// Fees
export const feesApi = {
  getFeeItems: (category?: string) => api.get('/fees/items', { params: { category } }),
  getStudentFees: (studentId: string, status?: string) => 
    api.get(`/fees/student/${studentId}`, { params: { status } }),
  generateFees: (studentId: string, periodId: string) => 
    api.post('/fees/generate', { studentId, periodId }),
  calculateFee: (studentFeeId: string, options: any) => 
    api.post('/fees/calculate', { studentFeeId, ...options }),
  applyDiscount: (studentFeeId: string, discountTypeId: string, notes?: string) =>
    api.post('/fees/apply-discount', { studentFeeId, discountTypeId, notes }),
};

// Discounts
export const discountsApi = {
  getAll: (category?: string) => api.get('/discounts', { params: { category } }),
  getStackable: () => api.get('/discounts/stackable'),
  getById: (id: string) => api.get(`/discounts/${id}`),
  create: (data: any) => api.post('/discounts', data),
  update: (id: string, data: any) => api.put(`/discounts/${id}`, data),
  delete: (id: string) => api.delete(`/discounts/${id}`),
};

// Vouchers
export const vouchersApi = {
  getAll: (active?: boolean) => api.get('/vouchers', { params: { active } }),
  validate: (code: string) => api.get(`/vouchers/validate/${code}`),
  getById: (id: string) => api.get(`/vouchers/${id}`),
  create: (data: any) => api.post('/vouchers', data),
  update: (id: string, data: any) => api.put(`/vouchers/${id}`, data),
  delete: (id: string) => api.delete(`/vouchers/${id}`),
};

// Payments
export const paymentsApi = {
  getAll: (studentId?: string) => api.get('/payments', { params: { studentId } }),
  getById: (id: string) => api.get(`/payments/${id}`),
  getByReceipt: (receiptNumber: string) => api.get(`/payments/receipt/${receiptNumber}`),
  getStudentHistory: (studentId: string) => api.get(`/payments/student/${studentId}`),
  getTotal: (startDate?: string, endDate?: string) => 
    api.get('/payments/total', { params: { startDate, endDate } }),
  create: (data: any) => api.post('/payments', data),
};

// Enrollments
export const enrollmentsApi = {
  getAll: (studentId?: string, periodId?: string) => 
    api.get('/enrollments', { params: { studentId, periodId } }),
  getById: (id: string) => api.get(`/enrollments/${id}`),
  getStudentEnrollments: (studentId: string) => api.get(`/enrollments/student/${studentId}`),
  checkPromotion: (studentId: string) => api.get(`/enrollments/promotion/check/${studentId}`),
  promoteStudent: (studentId: string) => api.post(`/enrollments/promote/${studentId}`),
  create: (data: any) => api.post('/enrollments', data),
  updateStatus: (id: string, status: string) => api.put(`/enrollments/${id}/status`, { status }),
};

export default api;
