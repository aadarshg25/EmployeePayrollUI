import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './employee-form.component.html',
  providers: [DatePipe]
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId = 0;
  departmentsList: string[] = ['Sales', 'Finance', 'HR', 'IT'];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', Validators.required],
      departments: [[], Validators.required],
      salary: [500, [Validators.required, Validators.min(500)]],
      startDate: ['', Validators.required],
      note: ['', Validators.required],
      profilePic: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.employeeId = +id;
        this.loadEmployee(this.employeeId);
      }
    });
  }

  private loadEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => this.patchForm(employee),
      error: (err) => this.handleLoadError(err)
    });
  }

  private patchForm(employee: Employee): void {
    const parsedDate = this.parseDate(employee.startDate);
    this.employeeForm.patchValue({
      ...employee,
      startDate: parsedDate
    });
  }

  private parseDate(dateString: string): Date {
    return dateString.includes('T') 
      ? new Date(dateString)
      : new Date(dateString + 'T00:00:00');
  }

  onSubmit(): void {
    if (this.employeeForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;

    const formData = this.prepareFormData();
    const operation = this.isEditMode
      ? this.employeeService.updateEmployee(this.employeeId, formData)
      : this.employeeService.addEmployee(formData);

    operation.subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err),
      complete: () => this.isSubmitting = false
    });
  }

  private prepareFormData(): Employee {
    return {
      ...this.employeeForm.value,
      startDate: this.datePipe.transform(
        this.employeeForm.value.startDate, 
        'yyyy-MM-dd'
      ) || ''
    };
  }

  private handleSuccess(): void {
    alert(`Employee ${this.isEditMode ? 'updated' : 'added'} successfully!`);
    this.router.navigate(['/employees']);
  }

  private handleError(error: any): void {
    console.error('Operation failed:', error);
    alert(`Error: ${error.message}`);
  }

  private handleLoadError(error: any): void {
    console.error('Load error:', error);
    alert('Failed to load employee data');
    this.router.navigate(['/employees']);
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
}