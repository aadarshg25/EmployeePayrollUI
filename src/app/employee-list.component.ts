import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  employees: Employee[] = [];
  deletionInProgress: number | null = null; 
  displayedColumns: string[] = [
    'name',
    'gender',
    'departments',
    'salary',
    'startDate',
    'actions'
  ];

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next(); 
    this.destroy$.complete();
  }

  fetchEmployees(): void {
    this.employeeService.getAllEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.employees = data,
        error: (err) => this.showError('Failed to load employees', err)
      });
  }

  onAddUser(): void {
    this.router.navigate(['/add-employee']);
  }

  onEditUser(id?: number): void {
    if (id) this.router.navigate(['/edit-employee', id]);
  }

  onDeleteUser(id?: number): void {
    if (!id || this.deletionInProgress) return;

    if (confirm('Are you sure you want to delete this employee?')) {
      this.deletionInProgress = id;
      const originalEmployees = [...this.employees];

      // Optimistic update
      this.employees = this.employees.filter(emp => emp.id !== id);

      this.employeeService.deleteEmployee(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.showSuccess('Employee deleted successfully'),
          error: (err) => {
            this.employees = originalEmployees;
            this.showError('Failed to delete employee', err);
          },
          complete: () => this.deletionInProgress = null
        });
    }
  }

  private showError(message: string, error: any) {
    console.error(error);
    alert(`${message}: ${error.message}`);
  }

  private showSuccess(message: string) {
    alert(message);
  }
}
