"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    const grades = await Promise.all([
        prisma.grade.create({ data: { name: 'Nursery', level: 0, description: 'Pre-school for 2-3 year olds' } }),
        prisma.grade.create({ data: { name: 'Kindergarten', level: 1, description: 'Pre-school for 3-5 year olds' } }),
        prisma.grade.create({ data: { name: 'Grade 1', level: 2, description: 'Primary Grade 1' } }),
        prisma.grade.create({ data: { name: 'Grade 2', level: 3, description: 'Primary Grade 2' } }),
        prisma.grade.create({ data: { name: 'Grade 3', level: 4, description: 'Primary Grade 3' } }),
        prisma.grade.create({ data: { name: 'Grade 4', level: 5, description: 'Primary Grade 4' } }),
        prisma.grade.create({ data: { name: 'Grade 5', level: 6, description: 'Primary Grade 5' } }),
        prisma.grade.create({ data: { name: 'Grade 6', level: 7, description: 'Primary Grade 6' } }),
        prisma.grade.create({ data: { name: 'Grade 7', level: 8, description: 'Secondary Grade 7' } }),
        prisma.grade.create({ data: { name: 'Grade 8', level: 9, description: 'Secondary Grade 8' } }),
        prisma.grade.create({ data: { name: 'Grade 9', level: 10, description: 'High School Grade 9' } }),
        prisma.grade.create({ data: { name: 'Grade 10', level: 11, description: 'High School Grade 10' } }),
        prisma.grade.create({ data: { name: 'Grade 11', level: 12, description: 'High School Grade 11' } }),
        prisma.grade.create({ data: { name: 'Grade 12', level: 13, description: 'High School Grade 12 (Graduate)' } }),
    ]);
    console.log(`✅ Created ${grades.length} grades`);
    for (let i = 0; i < grades.length - 1; i++) {
        await prisma.grade.update({
            where: { id: grades[i].id },
            data: { nextGradeId: grades[i + 1].id }
        });
    }
    console.log('✅ Set up grade promotions');
    const programs = await Promise.all([
        prisma.program.create({ data: { name: 'Nursery (Half-Day) English', code: 'NUR-HD-ENG', curriculum: 'English', type: 'Half-Day', language: 'English', gradeId: grades[0].id } }),
        prisma.program.create({ data: { name: 'Nursery (Full-Day) English', code: 'NUR-FD-ENG', curriculum: 'English', type: 'Full-Day', language: 'English', gradeId: grades[0].id } }),
        prisma.program.create({ data: { name: 'Kindergarten (Half-Day) English', code: 'KG-HD-ENG', curriculum: 'English', type: 'Half-Day', language: 'English', gradeId: grades[1].id } }),
        prisma.program.create({ data: { name: 'Kindergarten (Full-Day) English', code: 'KG-FD-ENG', curriculum: 'English', type: 'Full-Day', language: 'English', gradeId: grades[1].id } }),
        prisma.program.create({ data: { name: 'Kindergarten (Full-Day) English+Khmer', code: 'KG-FD-EK', curriculum: 'English+Khmer', type: 'Full-Day', language: 'English+Khmer', gradeId: grades[1].id } }),
        prisma.program.create({ data: { name: 'Grade 1-3 (Half-Day) English', code: 'G1-3-HD-ENG', curriculum: 'English', type: 'Half-Day', language: 'English', gradeId: grades[2].id } }),
        prisma.program.create({ data: { name: 'Grade 1-3 (Full-Day) English+Khmer', code: 'G1-3-FD-EK', curriculum: 'English+Khmer', type: 'Full-Day', language: 'English+Khmer', gradeId: grades[2].id } }),
        prisma.program.create({ data: { name: 'Grade 1-3 (Full-Day) English+Chinese', code: 'G1-3-FD-EC', curriculum: 'English+Chinese', type: 'Full-Day', language: 'English+Chinese', gradeId: grades[2].id } }),
        prisma.program.create({ data: { name: 'Grade 4-6 (Half-Day) English', code: 'G4-6-HD-ENG', curriculum: 'English', type: 'Half-Day', language: 'English', gradeId: grades[5].id } }),
        prisma.program.create({ data: { name: 'Grade 4-6 (Full-Day) English+Khmer', code: 'G4-6-FD-EK', curriculum: 'English+Khmer', type: 'Full-Day', language: 'English+Khmer', gradeId: grades[5].id } }),
        prisma.program.create({ data: { name: 'Grade 7-8 (Half-Day) English', code: 'G7-8-HD-ENG', curriculum: 'English', type: 'Half-Day', language: 'English', gradeId: grades[8].id } }),
        prisma.program.create({ data: { name: 'Grade 9-12 (Half-Day) English', code: 'G9-12-HD-ENG', curriculum: 'English', type: 'Half-Day', language: 'English', gradeId: grades[10].id } }),
    ]);
    console.log(`✅ Created ${programs.length} programs`);
    const now = new Date();
    const periods = await Promise.all([
        prisma.period.create({ data: { name: 'Term 1', code: 'TERM1', durationMonths: 2.5, academicYear: '2025-2026', startDate: new Date('2025-11-01'), endDate: new Date('2026-02-15') } }),
        prisma.period.create({ data: { name: 'Term 2', code: 'TERM2', durationMonths: 2.5, academicYear: '2025-2026', startDate: new Date('2026-02-16'), endDate: new Date('2026-05-31') } }),
        prisma.period.create({ data: { name: 'Semester 1', code: 'SEM1', durationMonths: 5, academicYear: '2025-2026', startDate: new Date('2025-11-01'), endDate: new Date('2026-03-31') } }),
        prisma.period.create({ data: { name: 'Semester 2', code: 'SEM2', durationMonths: 5, academicYear: '2025-2026', startDate: new Date('2026-04-01'), endDate: new Date('2026-08-31') } }),
        prisma.period.create({ data: { name: 'School Year 2025-2026', code: 'YEAR', durationMonths: 10, academicYear: '2025-2026', startDate: new Date('2025-11-01'), endDate: new Date('2026-08-31') } }),
    ]);
    console.log(`✅ Created ${periods.length} periods`);
    const feeItems = await Promise.all([
        prisma.feeItem.create({ data: { code: 'TUIT-NUR-HD-TERM', name: 'Nursery (Half-Day) - Term', category: 'TUITION', amount: 1050, periodType: 'TERM', gradeId: grades[0].id, isRequired: true, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'TUIT-NUR-FD-TERM', name: 'Nursery (Full-Day) - Term', category: 'TUITION', amount: 1400, periodType: 'TERM', gradeId: grades[0].id, isRequired: true, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'TUIT-KG-HD-TERM', name: 'Kindergarten (Half-Day) - Term', category: 'TUITION', amount: 1100, periodType: 'TERM', gradeId: grades[1].id, isRequired: true, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'TUIT-KG-FD-TERM', name: 'Kindergarten (Full-Day) - Term', category: 'TUITION', amount: 1500, periodType: 'TERM', gradeId: grades[1].id, isRequired: true, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'TUIT-G1-3-HD-TERM', name: 'Grade 1-3 (Half-Day) - Term', category: 'TUITION', amount: 450, periodType: 'TERM', gradeId: grades[2].id, isRequired: true, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'TUIT-G9-12-HD-TERM', name: 'Grade 9-12 (Half-Day) - Term', category: 'TUITION', amount: 1600, periodType: 'TERM', gradeId: grades[10].id, isRequired: true, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'REG-ANNUAL', name: 'Registration (Annual)', category: 'REGISTRATION', amount: 100, periodType: 'YEAR', isRequired: true, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'MAT-ANNUAL', name: 'Study Materials + ID + Insurance', category: 'MATERIALS', amount: 300, periodType: 'YEAR', isRequired: true, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'UNI-3SET', name: 'Uniform (3 Sets)', category: 'UNIFORM', amount: 300, periodType: 'ONETIME', isRequired: false, isRecurring: false } }),
        prisma.feeItem.create({ data: { code: 'UNI-1SET', name: 'Uniform (1 Set)', category: 'UNIFORM', amount: 15, periodType: 'ONETIME', isRequired: false, isRecurring: false } }),
        prisma.feeItem.create({ data: { code: 'TRANS-Z1-TERM', name: 'Transportation Zone 1 - Term', category: 'TRANSPORTATION', amount: 120, periodType: 'TERM', isRequired: false, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'TRANS-Z3-TERM', name: 'Transportation Zone 3 - Term', category: 'TRANSPORTATION', amount: 160, periodType: 'TERM', isRequired: false, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'TRANS-Z5-TERM', name: 'Transportation Zone 5 - Term', category: 'TRANSPORTATION', amount: 220, periodType: 'TERM', isRequired: false, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'MEAL-BRK-TERM', name: 'Breakfast - Term', category: 'MEALS', amount: 90, periodType: 'TERM', isRequired: false, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'MEAL-LUNCH-TERM', name: 'Lunch - Term', category: 'MEALS', amount: 170, periodType: 'TERM', isRequired: false, isRecurring: true } }),
        prisma.feeItem.create({ data: { code: 'ENR-NEW', name: 'Enrollment Fee (New Student)', category: 'ENROLLMENT', amount: 200, periodType: 'ONETIME', isRequired: true, isRecurring: false } }),
        prisma.feeItem.create({ data: { code: 'ENR-SEC', name: 'Enrollment Fee (Secondary)', category: 'ENROLLMENT', amount: 500, periodType: 'ONETIME', isRequired: true, isRecurring: false } }),
    ]);
    console.log(`✅ Created ${feeItems.length} fee items`);
    const discounts = await Promise.all([
        prisma.discountType.create({ data: { name: 'Sibling Discount (2nd child)', code: 'SIBLING_2', type: 'PERCENTAGE', value: 5, category: 'FAMILY', priority: 1, stackable: true } }),
        prisma.discountType.create({ data: { name: 'Sibling Discount (3rd child)', code: 'SIBLING_3', type: 'PERCENTAGE', value: 10, category: 'FAMILY', priority: 1, stackable: true } }),
        prisma.discountType.create({ data: { name: 'Early Payment Discount', code: 'EARLY_PAY', type: 'PERCENTAGE', value: 3, category: 'PAYMENT', priority: 2, stackable: true } }),
        prisma.discountType.create({ data: { name: 'Full Year Payment Discount', code: 'FULL_YEAR', type: 'PERCENTAGE', value: 5, category: 'PAYMENT', priority: 2, stackable: true } }),
        prisma.discountType.create({ data: { name: 'Outstanding Student Discount', code: 'OUTSTANDING', type: 'PERCENTAGE', value: 10, category: 'SPECIAL', priority: 3, stackable: true } }),
        prisma.discountType.create({ data: { name: 'Staff Child Discount', code: 'STAFF', type: 'PERCENTAGE', value: 20, category: 'SPECIAL', priority: 3, stackable: true } }),
        prisma.discountType.create({ data: { name: 'Scholarship', code: 'SCHOLARSHIP', type: 'PERCENTAGE', value: 50, category: 'SPECIAL', priority: 3, stackable: true } }),
    ]);
    console.log(`✅ Created ${discounts.length} discount types`);
    const vouchers = await Promise.all([
        prisma.voucher.create({ data: { code: 'WELCOME50', name: 'Welcome Discount $50', type: 'FIXED', value: 50, usageLimit: 100, validFrom: new Date('2025-01-01'), validTo: new Date('2026-12-31'), isActive: true } }),
        prisma.voucher.create({ data: { code: 'SAVE10', name: 'Save 10%', type: 'PERCENTAGE', value: 10, targetCategory: 'TUITION', usageLimit: 50, validFrom: new Date('2025-01-01'), validTo: new Date('2026-12-31'), isActive: true } }),
        prisma.voucher.create({ data: { code: 'NEWSTUDENT', name: 'New Student $100', type: 'FIXED', value: 100, usageLimit: 200, validFrom: new Date('2025-01-01'), validTo: new Date('2026-12-31'), isActive: true } }),
    ]);
    console.log(`✅ Created ${vouchers.length} vouchers`);
    const familyId = 'FAM-001';
    const students = await Promise.all([
        prisma.student.create({ data: { studentId: 'STU-0001', firstName: 'Channa', lastName: 'Sok', fullName: 'Channa Sok', gender: 'Male', dob: new Date('2015-03-15'), gradeId: grades[4].id, guardianName: 'Sokha', guardianPhone: '012 345 678', guardianEmail: 'sokha@email.com', guardianRelation: 'Father', familyId, status: 'ACTIVE' } }),
        prisma.student.create({ data: { studentId: 'STU-0002', firstName: 'Sreysros', lastName: 'Keo', fullName: 'Sreysros Keo', gender: 'Male', dob: new Date('2014-08-20'), gradeId: grades[6].id, guardianName: 'Keo', guardianPhone: '012 345 678', guardianEmail: 'keo@email.com', guardianRelation: 'Father', familyId, status: 'ACTIVE' } }),
        prisma.student.create({ data: { studentId: 'STU-0003', firstName: 'Dara', lastName: 'Lim', fullName: 'Dara Lim', gender: 'Female', dob: new Date('2013-01-10'), gradeId: grades[10].id, guardianName: 'Lim', guardianPhone: '012 987 654', guardianEmail: 'lim@email.com', guardianRelation: 'Mother', status: 'ACTIVE' } }),
        prisma.student.create({ data: { studentId: 'STU-0004', firstName: 'Vichea', lastName: 'Chhay', fullName: 'Vichea Chhay', gender: 'Male', dob: new Date('2012-05-25'), gradeId: grades[11].id, guardianName: 'Chhay', guardianPhone: '012 111 222', guardianEmail: 'chhay@email.com', guardianRelation: 'Father', status: 'ACTIVE' } }),
    ]);
    console.log(`✅ Created ${students.length} students`);
    const enrollments = await Promise.all([
        prisma.enrollment.create({ data: { studentId: students[0].id, programId: programs[6].id, periodId: periods[0].id, academicYear: '2025-2026', status: 'ENROLLED' } }),
        prisma.enrollment.create({ data: { studentId: students[1].id, programId: programs[8].id, periodId: periods[0].id, academicYear: '2025-2026', status: 'ENROLLED' } }),
        prisma.enrollment.create({ data: { studentId: students[2].id, programId: programs[11].id, periodId: periods[0].id, academicYear: '2025-2026', status: 'ENROLLED' } }),
        prisma.enrollment.create({ data: { studentId: students[3].id, programId: programs[11].id, periodId: periods[0].id, academicYear: '2025-2026', status: 'ENROLLED' } }),
    ]);
    console.log(`✅ Created ${enrollments.length} enrollments`);
    const student1Fees = await Promise.all([
        prisma.studentFee.create({ data: { studentId: students[0].id, enrollmentId: enrollments[0].id, feeItemId: feeItems[4].id, periodId: periods[0].id, baseAmount: 450, totalAmount: 450, status: 'PENDING' } }),
        prisma.studentFee.create({ data: { studentId: students[0].id, enrollmentId: enrollments[0].id, feeItemId: feeItems[6].id, periodId: periods[0].id, baseAmount: 100, totalAmount: 100, status: 'PENDING' } }),
        prisma.studentFee.create({ data: { studentId: students[0].id, enrollmentId: enrollments[0].id, feeItemId: feeItems[7].id, periodId: periods[0].id, baseAmount: 300, totalAmount: 300, status: 'PENDING' } }),
    ]);
    const student2Fees = await Promise.all([
        prisma.studentFee.create({ data: { studentId: students[1].id, enrollmentId: enrollments[1].id, feeItemId: feeItems[8].id, periodId: periods[0].id, baseAmount: 1600, totalAmount: 1600, status: 'PENDING' } }),
        prisma.studentFee.create({ data: { studentId: students[1].id, enrollmentId: enrollments[1].id, feeItemId: feeItems[6].id, periodId: periods[0].id, baseAmount: 100, totalAmount: 100, status: 'PENDING' } }),
    ]);
    console.log(`✅ Created student fees`);
    await Promise.all([
        prisma.payment.create({ data: { studentId: students[0].id, studentFeeId: student1Fees[0].id, amount: 450, paymentMethod: 'CASH', status: 'COMPLETED', receiptNumber: 'RCP-2026-00001' } }),
    ]);
    await prisma.studentFee.update({ where: { id: student1Fees[0].id }, data: { status: 'PAID', paidAt: new Date() } });
    console.log(`✅ Created sample payments`);
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`  - ${grades.length} Grades (with promotions)`);
    console.log(`  - ${programs.length} Programs`);
    console.log(`  - ${periods.length} Periods`);
    console.log(`  - ${feeItems.length} Fee Items`);
    console.log(`  - ${discounts.length} Discount Types`);
    console.log(`  - ${vouchers.length} Vouchers`);
    console.log(`  - ${students.length} Students`);
    console.log(`  - ${enrollments.length} Enrollments`);
    console.log('\n🔑 Test Credentials:');
    console.log('  - Student IDs: STU-0001, STU-0002, STU-0003, STU-0004');
    console.log('  - Siblings: STU-0001 & STU-0002 (same family)');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map