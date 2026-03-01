'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Chip, Card, CardBody, CardHeader, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Form, Input } from '@heroui/react';
import { Plus, GraduationCap, ArrowRight, Users } from 'lucide-react';
import { gradesApi } from '@/lib/api';
import { Grade } from '@/lib/types';

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const res = await gradesApi.getAll();
      setGrades(res.data);
    } catch (error) {
      console.error('Failed to fetch grades:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grades & Classes</h1>
          <p className="text-gray-500">Manage grade levels and promotions</p>
        </div>
        <Button color="primary" startContent={<Plus size={18} />} onPress={onOpen}>
          Add Grade
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Grades</p>
                <p className="text-2xl font-bold">{grades.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Students</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Grades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grades.map((grade) => (
          <Card key={grade.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <h3 className="text-lg font-semibold">{grade.name}</h3>
                <p className="text-sm text-gray-500">Level {grade.level}</p>
              </div>
              <Chip color="primary" variant="flat">{grade.description || 'N/A'}</Chip>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Next Grade</span>
                  <div className="flex items-center gap-1">
                    {grade.nextGrade ? (
                      <>
                        <span className="font-medium">{grade.nextGrade.name}</span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </>
                    ) : (
                      <span className="text-gray-400">None (Graduated)</span>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Add Grade</ModalHeader>
          <ModalBody>
            <Form className="space-y-4">
              <Input label="Name" name="name" placeholder="e.g., Grade 1" />
              <Input label="Level" name="level" type="number" placeholder="e.g., 1" />
              <Input label="Description" name="description" placeholder="e.g., Primary Grade 1" />
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancel</Button>
            <Button color="primary" onPress={onClose}>Add Grade</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
