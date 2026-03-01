'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Chip, Card, CardBody, CardHeader, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Form, Input, Select, SelectItem, Avatar, Tabs, Tab } from '@heroui/react';
import { Search, Plus, Receipt, DollarSign, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { paymentsApi, studentsApi, feesApi } from '@/lib/api';
import { Payment, Student, StudentFee } from '@/lib/types';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await paymentsApi.getAll();
      setPayments(res.data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await studentsApi.getAll({ limit: 100 });
      setStudents(res.data.data || res.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchStudentFees = async (studentId: string) => {
    try {
      const res = await feesApi.getStudentFees(studentId);
      setStudentFees(res.data);
    } catch (error) {
      console.error('Failed to fetch student fees:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'danger';
      case 'REFUNDED': return 'default';
      default: return 'default';
    }
  };

  const filteredPayments = payments.filter(p => 
    p.student?.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.receiptNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">Record and manage student payments</p>
        </div>
        <Button color="primary" startContent={<Plus size={18} />} onPress={onOpen}>
          New Payment
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Collected</p>
                <p className="text-2xl font-bold">$8,750</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">$2,450</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Transactions</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Input
            className="max-w-md"
            placeholder="Search by name or receipt..."
            startContent={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardHeader>
        <Divider />
        <CardBody>
          <Table aria-label="Payments table">
            <TableHeader>
              <TableColumn>RECEIPT</TableColumn>
              <TableColumn>STUDENT</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>METHOD</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{payment.receiptNumber}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={payment.student?.fullName} size="sm" />
                      <span>{payment.student?.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip color={getStatusColor(payment.status)} size="sm" variant="flat">
                      {payment.status}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* New Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader>Record New Payment</ModalHeader>
          <ModalBody>
            <Form className="space-y-4">
              <Select label="Student" placeholder="Select student" onSelectionChange={(keys) => {
                const studentId = Array.from(keys)[0] as string;
                if (studentId) fetchStudentFees(studentId);
              }}>
                {students.map((student) => (
                  <SelectItem key={student.id}>{student.fullName} ({student.studentId})</SelectItem>
                ))}
              </Select>
              <Select label="Fee to Pay" placeholder="Select fee">
                {studentFees.filter(f => f.status !== 'PAID').map((fee) => (
                  <SelectItem key={fee.id}>
                    {fee.feeItem?.name} - ${fee.totalAmount - fee.paidAmount} due
                  </SelectItem>
                ))}
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Amount" name="amount" type="number" startContent="$" />
                <Select label="Payment Method" name="method">
                  <SelectItem key="CASH">Cash</SelectItem>
                  <SelectItem key="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem key="WING">Wing</SelectItem>
                  <SelectItem key="ABA">ABA</SelectItem>
                  <SelectItem key="CHEQUE">Cheque</SelectItem>
                </Select>
              </div>
              <Input label="Transaction Ref" name="ref" />
              <Input label="Notes" name="notes" />
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancel</Button>
            <Button color="primary" onPress={onClose}>Record Payment</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
