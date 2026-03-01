'use client';

import { Card, CardBody, CardHeader, CardFooter, Button, Chip, Avatar, Divider } from '@heroui/react';
import { Users, Wallet, Receipt, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { title: 'Total Students', value: '4', change: '+12%', trend: 'up', icon: Users, color: 'primary' },
  { title: 'Pending Fees', value: '$2,450', change: '-8%', trend: 'down', icon: Wallet, color: 'warning' },
  { title: 'Collected', value: '$8,750', change: '+24%', trend: 'up', icon: Receipt, color: 'success' },
  { title: 'This Month', value: '12', change: '+5', trend: 'up', icon: TrendingUp, color: 'secondary' },
];

const recentStudents = [
  { id: 'STU-0001', name: 'Channa Sok', grade: 'Grade 4', status: 'ACTIVE' },
  { id: 'STU-0002', name: 'Sreysros Keo', grade: 'Grade 6', status: 'ACTIVE' },
  { id: 'STU-0003', name: 'Dara Lim', grade: 'Grade 10', status: 'ACTIVE' },
];

const upcomingPayments = [
  { student: 'Channa Sok', amount: '$450', due: '2026-02-15' },
  { student: 'Sreysros Keo', amount: '$1,700', due: '2026-02-15' },
  { student: 'Dara Lim', amount: '$1,600', due: '2026-02-20' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Academic Year 2025-2026</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-white">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {stat.change}
                  </span>
                  <span className="text-gray-400 ml-1">from last month</span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Students</h2>
            <Button size="sm" variant="light" as={Link} href="/students">
              View All
            </Button>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={student.name} size="sm" />
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.grade}</p>
                    </div>
                  </div>
                  <Chip size="sm" color="success" variant="flat">
                    {student.status}
                  </Chip>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Upcoming Payments */}
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Payments</h2>
            <Button size="sm" variant="light" as={Link} href="/payments">
              View All
            </Button>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              {upcomingPayments.map((payment, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{payment.student}</p>
                    <p className="text-sm text-gray-500">Due: {payment.due}</p>
                  </div>
                  <Chip color="warning" variant="flat">
                    {payment.amount}
                  </Chip>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
