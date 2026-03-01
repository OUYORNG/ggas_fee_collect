'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Input, Button, Chip, Card, CardBody, CardHeader, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Form, Select, SelectItem, Tabs, Tab, Badge } from '@heroui/react';
import { Search, Plus, Calculator, Tag, Percent, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { feesApi, discountsApi, studentsApi } from '@/lib/api';
import { FeeItem, StudentFee, DiscountType, Student } from '@/lib/types';

export default function FeesPage() {
  const [feeItems, setFeeItems] = useState<FeeItem[]>([]);
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('fee-items');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchFeeItems();
    fetchDiscounts();
    fetchStudents();
  }, []);

  const fetchFeeItems = async () => {
    try {
      const res = await feesApi.getFeeItems();
      setFeeItems(res.data);
    } catch (error) {
      console.error('Failed to fetch fee items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const res = await discountsApi.getAll();
      setDiscounts(res.data);
    } catch (error) {
      console.error('Failed to fetch discounts:', error);
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'TUITION': return 'primary';
      case 'REGISTRATION': return 'secondary';
      case 'MATERIALS': return 'success';
      case 'UNIFORM': return 'warning';
      case 'TRANSPORTATION': return 'danger';
      case 'MEALS': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'PARTIAL': return 'primary';
      case 'OVERDUE': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fees Management</h1>
          <p className="text-gray-500">Configure fees, discounts, and calculate student fees</p>
        </div>
      </div>

      <Tabs aria-label="Fees options" selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as string)}>
        <Tab key="fee-items" title={
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Fee Items
          </div>
        }>
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Fee Items</h2>
              <Button color="primary" size="sm" startContent={<Plus size={16} />} onPress={onOpen}>
                Add Fee Item
              </Button>
            </CardHeader>
            <Divider />
            <CardBody>
              <Table aria-label="Fee items table">
                <TableHeader>
                  <TableColumn>CODE</TableColumn>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>CATEGORY</TableColumn>
                  <TableColumn>AMOUNT</TableColumn>
                  <TableColumn>PERIOD</TableColumn>
                  <TableColumn>TYPE</TableColumn>
                </TableHeader>
                <TableBody>
                  {feeItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell><code className="text-sm bg-gray-100 px-2 py-1 rounded">{item.code}</code></TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Chip color={getCategoryColor(item.category)} size="sm" variant="flat">
                          {item.category}
                        </Chip>
                      </TableCell>
                      <TableCell className="font-medium">${item.amount}</TableCell>
                      <TableCell>{item.periodType}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {item.isRequired && <Chip size="sm" color="primary" variant="flat">Required</Chip>}
                          {item.isRecurring && <Chip size="sm" color="secondary" variant="flat">Recurring</Chip>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="discounts" title={
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Discounts
          </div>
        }>
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Discount Types</h2>
              <Button color="primary" size="sm" startContent={<Plus size={16} />}>
                Add Discount
              </Button>
            </CardHeader>
            <Divider />
            <CardBody>
              <Table aria-label="Discounts table">
                <TableHeader>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>CODE</TableColumn>
                  <TableColumn>TYPE</TableColumn>
                  <TableColumn>VALUE</TableColumn>
                  <TableColumn>CATEGORY</TableColumn>
                  <TableColumn>STACKABLE</TableColumn>
                </TableHeader>
                <TableBody>
                  {discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>{discount.name}</TableCell>
                      <TableCell><code className="text-sm bg-gray-100 px-2 py-1 rounded">{discount.code}</code></TableCell>
                      <TableCell>{discount.type}</TableCell>
                      <TableCell className="font-medium">
                        {discount.type === 'PERCENTAGE' ? `${discount.value}%` : `$${discount.value}`}
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat">{discount.category}</Chip>
                      </TableCell>
                      <TableCell>
                        {discount.stackable ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-gray-400" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="vouchers" title={
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Vouchers
          </div>
        }>
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Vouchers</h2>
              <Button color="primary" size="sm" startContent={<Plus size={16} />}>
                Create Voucher
              </Button>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-gray-500 text-center py-8">No vouchers yet</p>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="calculate" title={
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculator
          </div>
        }>
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Fee Calculator</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <Form className="space-y-4 max-w-xl">
                <Select label="Select Student" placeholder="Choose a student">
                  {students.map((student) => (
                    <SelectItem key={student.id}>{student.fullName} ({student.studentId})</SelectItem>
                  ))}
                </Select>
                <div className="flex gap-4">
                  <Button color="primary">Calculate Fees</Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
