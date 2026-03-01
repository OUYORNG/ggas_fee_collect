'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Input, Button, Chip, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Form, Select, SelectItem } from '@heroui/react';
import { Search, Plus, MoreVertical, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react';
import { studentsApi, gradesApi } from '@/lib/api';
import { Student, Grade } from '@/lib/types';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
    fetchGrades();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentsApi.getAll({ limit: 100 });
      setStudents(res.data.data || res.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const res = await gradesApi.getAll();
      setGrades(res.data);
    } catch (error) {
      console.error('Failed to fetch grades:', error);
    }
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase()) ||
    s.guardianName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'GRADUATED': return 'secondary';
      case 'TRANSFERRED': return 'warning';
      case 'SUSPENDED': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500">Manage student records</p>
        </div>
        <Button color="primary" startContent={<Plus size={18} />} onPress={onOpen}>
          Add Student
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          className="max-w-md"
          placeholder="Search students..."
          startContent={<Search className="h-4 w-4 text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table aria-label="Students table">
        <TableHeader>
          <TableColumn>STUDENT</TableColumn>
          <TableColumn>GRADE</TableColumn>
          <TableColumn>GUARDIAN</TableColumn>
          <TableColumn>PHONE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={student.fullName} size="sm" />
                  <div>
                    <p className="font-medium">{student.fullName}</p>
                    <p className="text-sm text-gray-500">{student.studentId}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{student.grade?.name || '-'}</TableCell>
              <TableCell>
                <p>{student.guardianName}</p>
                <p className="text-sm text-gray-500">{student.guardianRelation}</p>
              </TableCell>
              <TableCell>{student.guardianPhone}</TableCell>
              <TableCell>
                <Chip color={getStatusColor(student.status)} size="sm" variant="flat">
                  {student.status}
                </Chip>
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="view" startContent={<Eye size={16} />}>View</DropdownItem>
                    <DropdownItem key="edit" startContent={<Edit size={16} />}>Edit</DropdownItem>
                    <DropdownItem key="delete" startContent={<Trash2 size={16} />} className="text-danger" color="danger">
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Student Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Add New Student</ModalHeader>
          <ModalBody>
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" name="firstName" isRequired />
                <Input label="Last Name" name="lastName" isRequired />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Gender" name="gender" isRequired>
                  <SelectItem key="Male">Male</SelectItem>
                  <SelectItem key="Female">Female</SelectItem>
                </Select>
                <Input label="Date of Birth" name="dob" type="date" isRequired />
              </div>
              <Select label="Grade" name="gradeId" isRequired>
                {grades.map((grade) => (
                  <SelectItem key={grade.id}>{grade.name}</SelectItem>
                ))}
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Guardian Name" name="guardianName" isRequired />
                <Input label="Guardian Phone" name="guardianPhone" isRequired />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Guardian Email" name="guardianEmail" />
                <Select label="Relation" name="guardianRelation" isRequired>
                  <SelectItem key="Father">Father</SelectItem>
                  <SelectItem key="Mother">Mother</SelectItem>
                  <SelectItem key="Guardian">Guardian</SelectItem>
                </Select>
              </div>
              <Input label="Address" name="address" />
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancel</Button>
            <Button color="primary" onPress={onClose}>Add Student</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
