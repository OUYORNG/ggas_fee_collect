export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dob: string;
  gradeId: string;
  grade?: Grade;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  guardianRelation: 'Father' | 'Mother' | 'Guardian';
  address?: string;
  notes?: string;
  familyId?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: string;
  name: string;
  level: number;
  description?: string;
  nextGradeId?: string;
  nextGrade?: Grade;
  programs?: Program[];
}

export interface Program {
  id: string;
  name: string;
  code: string;
  curriculum: string;
  type: string;
  language: string;
  gradeId: string;
  grade?: Grade;
}

export interface Period {
  id: string;
  name: string;
  code: string;
  durationMonths: number;
  academicYear: string;
  startDate: string;
  endDate: string;
}

export interface FeeItem {
  id: string;
  code: string;
  name: string;
  category: 'TUITION' | 'REGISTRATION' | 'MATERIALS' | 'UNIFORM' | 'TRANSPORTATION' | 'MEALS' | 'ENROLLMENT' | 'OTHER';
  amount: number;
  periodType: 'TERM' | 'SEMESTER' | 'YEAR' | 'ONETIME';
  gradeId?: string;
  grade?: Grade;
  programId?: string;
  program?: Program;
  isRequired: boolean;
  isRecurring: boolean;
}

export interface StudentFee {
  id: string;
  studentId: string;
  enrollmentId?: string;
  feeItemId: string;
  periodId: string;
  feeItem?: FeeItem;
  period?: Period;
  baseAmount: number;
  discountAmount: number;
  voucherAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'WAIVED';
  dueDate?: string;
  paidAt?: string;
  payments?: Payment[];
}

export interface DiscountType {
  id: string;
  name: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  category: 'FAMILY' | 'PAYMENT' | 'SPECIAL';
  priority: number;
  stackable: boolean;
  isActive: boolean;
}

export interface Voucher {
  id: string;
  code: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  targetCategory?: string;
  usageLimit?: number;
  usedCount: number;
  validFrom?: string;
  validTo?: string;
  isActive: boolean;
}

export interface Payment {
  id: string;
  studentId: string;
  studentFeeId?: string;
  student?: Student;
  studentFee?: StudentFee;
  amount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'WING' | 'ABA' | 'CHEQUE' | 'OTHER';
  transactionRef?: string;
  receiptNumber: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  collectedBy?: string;
  notes?: string;
  paymentDate: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  programId: string;
  periodId: string;
  academicYear: string;
  student?: Student;
  program?: Program;
  period?: Period;
  status: 'ENROLLED' | 'PROMOTED' | 'WITHDRAWN' | 'GRADUATED';
  enrolledAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
