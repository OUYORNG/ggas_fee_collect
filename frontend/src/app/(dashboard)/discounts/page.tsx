'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Chip, Card, CardBody, CardHeader, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Form, Input, Select, SelectItem } from '@heroui/react';
import { Plus, Percent, CheckCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { discountsApi } from '@/lib/api';
import { DiscountType } from '@/lib/types';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const res = await discountsApi.getAll();
      setDiscounts(res.data);
    } catch (error) {
      console.error('Failed to fetch discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'FAMILY': return 'primary';
      case 'PAYMENT': return 'success';
      case 'SPECIAL': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discounts</h1>
          <p className="text-gray-500">Manage discount types and policies</p>
        </div>
        <Button color="primary" startContent={<Plus size={18} />} onPress={onOpen}>
          Add Discount
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-purple-100">
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Discounts</p>
                <p className="text-2xl font-bold">{discounts.filter(d => d.isActive).length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Stackable</p>
                <p className="text-2xl font-bold">{discounts.filter(d => d.stackable).length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-100">
                <Percent className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Discount Types</h2>
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
              <TableColumn>PRIORITY</TableColumn>
              <TableColumn>STACKABLE</TableColumn>
              <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-medium">{discount.name}</TableCell>
                  <TableCell><code className="text-sm bg-gray-100 px-2 py-1 rounded">{discount.code}</code></TableCell>
                  <TableCell>{discount.type}</TableCell>
                  <TableCell className="font-medium">
                    {discount.type === 'PERCENTAGE' ? `${discount.value}%` : `$${discount.value}`}
                  </TableCell>
                  <TableCell>
                    <Chip color={getCategoryColor(discount.category)} size="sm" variant="flat">
                      {discount.category}
                    </Chip>
                  </TableCell>
                  <TableCell>{discount.priority}</TableCell>
                  <TableCell>
                    {discount.stackable ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip color={discount.isActive ? 'success' : 'default'} size="sm" variant="flat">
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Add Discount Type</ModalHeader>
          <ModalBody>
            <Form className="space-y-4">
              <Input label="Name" name="name" placeholder="e.g., Sibling Discount" isRequired />
              <Input label="Code" name="code" placeholder="e.g., SIBLING" isRequired />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Type" name="type" isRequired>
                  <SelectItem key="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem key="FIXED">Fixed Amount ($)</SelectItem>
                </Select>
                <Input label="Value" name="value" type="number" isRequired />
              </div>
              <Select label="Category" name="category" isRequired>
                <SelectItem key="FAMILY">Family</SelectItem>
                <SelectItem key="PAYMENT">Payment</SelectItem>
                <SelectItem key="SPECIAL">Special</SelectItem>
              </Select>
              <Input label="Priority" name="priority" type="number" />
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancel</Button>
            <Button color="primary" onPress={onClose}>Add Discount</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
