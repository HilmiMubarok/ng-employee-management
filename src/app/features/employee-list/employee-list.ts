import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList {
  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  displayedEmployees: Employee[] = [];

  searchUsername: string = '';
  searchGroup: string = '';

  sortColumn: keyof Employee | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';


  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSizes: number[] = [10, 20, 50, 100];

  notifMessage: string = '';
  notifType: 'edit' | 'delete' | '' = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.allEmployees = this.employeeService.getEmployees();

    this.searchUsername = this.employeeService.listState.searchUsername;
    this.searchGroup = this.employeeService.listState.searchGroup;
    this.sortColumn = this.employeeService.listState.sortColumn as keyof Employee | '';
    this.sortDirection = this.employeeService.listState.sortDirection;
    this.pageSize = this.employeeService.listState.pageSize;
    this.currentPage = this.employeeService.listState.currentPage;
    
    this.processData();
  }

  processData(): void {
    this.employeeService.listState = {
      searchUsername: this.searchUsername,
      searchGroup: this.searchGroup,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    };

    this.filteredEmployees = this.allEmployees.filter((emp) => {
      const matchUsername = emp.username.toLowerCase().includes(this.searchUsername.toLowerCase());
      const matchGroup = emp.group.toLowerCase().includes(this.searchGroup.toLowerCase());
      return matchUsername && matchGroup;
    });

    if (this.sortColumn) {
      this.filteredEmployees.sort((a, b) => {
        const valA = a[this.sortColumn as keyof Employee];
        const valB = b[this.sortColumn as keyof Employee];

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.processData();
  }

  onSort(column: keyof Employee): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.processData();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.processData();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.processData();
  }

  navigateToAdd(): void {
    this.router.navigate(['/employee-add']);
  }

  navigateToDetail(employee: Employee): void {
    this.router.navigate(['/employee-detail', employee.username]);
  }
  
  onEdit(employee: Employee): void {
    this.notifType = 'edit';
    this.notifMessage = `Data ${employee.username} sedang di-edit.`;
    this.clearNotification();
  }

  onDelete(employee: Employee): void {
    this.notifType = 'delete';
    this.notifMessage = `Data ${employee.username} berhasil dihapus.`;
    this.clearNotification();
  }

  private clearNotification(): void {
    setTimeout(() => {
      this.notifMessage = '';
      this.notifType = '';
    }, 3000);
  }
}
