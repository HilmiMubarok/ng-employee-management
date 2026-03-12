import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employees: Employee[] = [];

  private groups: string[] = [
    'Engineering',
    'Product',
    'Design',
    'QA',
    'Data',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Legal',
  ];

  constructor() {
    this.generateDummyData();
  }

  private generateDummyData(): void {
    const statuses = ['Permanent', 'Contract', 'Probation'];

    for (let i = 1; i <= 105; i++) {
      const groupIndex = i % 10;
      const statusIndex = i % 3;

      this.employees.push({
        username: `karyawan ${i}`,
        firstName: `John`,
        lastName: `Doe ${i}`,
        email: `johndoe${i}@company.com`,
        birthDate: new Date(1990 + (i % 10), i % 12, (i % 28) + 1),
        basicSalary: 5000000 + i * 150000,
        status: statuses[statusIndex],
        group: this.groups[groupIndex],
        description: new Date(),
      });
    }
  }

  getEmployees(): Employee[] {
    return this.employees;
  }

  getGroups(): string[] {
    return this.groups;
  }

  addEmployee(employee: Employee): void {
    this.employees.unshift(employee);
  }
}
