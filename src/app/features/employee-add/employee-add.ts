import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';

@Component({
  selector: 'app-employee-add',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-add.html',
  styleUrl: './employee-add.css',
})
export class EmployeeAdd implements OnInit {
  addForm!: FormGroup;

  groups: string[] = [];
  filteredGroups: string[] = [];
  showGroupDropdown: boolean = false;
  searchGroupText: string = '';

  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.groups = this.employeeService.getGroups();
    this.filteredGroups = [...this.groups];

    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];

    this.initForm();
  }

  initForm(): void {
    this.addForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required, this.dateMaxTodayValidator]],
      basicSalary: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      status: ['', Validators.required],
      group: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  dateMaxTodayValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return { maxDate: true };
    }
    return null;
  }

  toggleDropdown(): void {
    this.showGroupDropdown = !this.showGroupDropdown;
    if (this.showGroupDropdown) {
      this.filteredGroups = [...this.groups];
      this.searchGroupText = '';
    }
  }

  onSearchGroup(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchGroupText = input;
    this.filteredGroups = this.groups.filter((g) => g.toLowerCase().includes(input));
  }

  selectGroup(group: string): void {
    this.addForm.patchValue({ group: group });
    this.showGroupDropdown = false;
  }

  onCancel(): void {
    this.router.navigate(['/employee-list']);
  }

  onSave(): void {
    if (this.addForm.valid) {
      const formValue = this.addForm.value;

      const newEmployee: Employee = {
        ...formValue,
        birthDate: new Date(formValue.birthDate),
        basicSalary: Number(formValue.basicSalary),
      };

      this.employeeService.addEmployee(newEmployee);

      this.router.navigate(['/employee-list']);
    } else {
      this.addForm.markAllAsTouched();
    }
  }

  get f() {
    return this.addForm.controls;
  }
}
