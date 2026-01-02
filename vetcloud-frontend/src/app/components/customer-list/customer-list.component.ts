import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    RouterLink
  ],
  providers: [ConfirmationService],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
  customers: any[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;

  newCustomer: any = {
    code: '',
    customerName: '',
    customerAdress: '',
    contactNumber: ''
  };

  constructor(
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (data: any) => {
        this.customers = data;
      },
      error: (err: any) => console.error('Error loading data:', err)
    });
  }

  showDialog() {
    this.isEditMode = false;
    this.newCustomer = { code: '', customerName: '', customerAdress: '', contactNumber: '' };
    this.displayDialog = true;
  }

  editCustomer(customer: any) {
    this.isEditMode = true;
    this.newCustomer = { ...customer };
    this.displayDialog = true;
  }

  saveCustomer() {
    // 1. Basic Validation: Check kon naay sulod ang gikinahanglan nga fields
    if (!this.newCustomer.code || !this.newCustomer.customerName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in Customer code and name.'
      });
      return;
    }

    // 2. Duplicate Validation: Check kon ang code gigamit na sa uban
    // Atong i-check sa local array 'this.customers' para paspas
    const isDuplicate = this.customers.some(c =>
      c.code.toLowerCase() === this.newCustomer.code.toLowerCase() &&
      c._id !== this.newCustomer._id // Ayaw i-check ang kaugalingon kon Edit mode
    );

    if (isDuplicate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Duplicate Code',
        detail: `The code "${this.newCustomer.code}" has already been used. Please use another code.`
      });
      return; // Hunongon ang save process
    }

    // 3. API CALLS
    if (this.isEditMode) {
      this.customerService.updateCustomer(this.newCustomer._id || this.newCustomer.code, this.newCustomer).subscribe({
        next: (res: any) => {
          this.loadCustomers();
          this.displayDialog = false;
          // TOAST: SUCCESS UPDATE
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Customer details updated successfully!'
          });
        },
        error: (err: any) => {
          console.error('Update failed:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed.' });
        }
      });
    } else {
      this.customerService.createCustomer(this.newCustomer).subscribe({
        next: (res: any) => {
          this.loadCustomers();
          this.displayDialog = false;
          // TOAST: SUCCESS CREATE
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'New customer added successfully!'
          });
        },
        error: (err: any) => {
          console.error('Save failed:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Save failed.' });
        }
      });
    }
  }

  deleteCustomer(customer: any) {
    this.confirmationService.confirm({
      message: `Confirm delete for ${customer.customerName}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',

      // Labels
      acceptLabel: 'Yes, Confirm',
      rejectLabel: 'No',

      // KINI ANG ATONG USBON NGA COLORS:
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.customerService.deleteCustomer(customer._id || customer.code).subscribe({
          next: () => {
            this.customers = this.customers.filter(c => c.code !== customer.code);
            this.displayDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Customer deleted successfully!'
            });
          },
          error: (err: any) => console.error('Delete failed:', err)
        });
      }
    });
  }

  exportToExcel() {
    // 1. Siguraduhon nga naay data aron dili mo-error ang exportData[0]
    if (!this.customers || this.customers.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'No record(s) to export.'
      });
      return;
    }

    // 2. I-prepare ang data (Friendly Headers + Data Cleaning)
    const exportData = this.customers.map(c => ({
      'Customer Code': c.code || '',
      'Customer Name': c.customerName || '',
      'Address': c.customerAdress || '',
      'Contact Number': c.contactNumber || ''
    }));

    // 3. I-convert ngadto sa CSV format
    const header = Object.keys(exportData[0]);
    const csvRows = exportData.map(row =>
      header.map(fieldName => {
        const value = (row as any)[fieldName];
        // I-escape ang double quotes ug i-wrap sa quotes para dili maguba ang columns kon naay comma (,)
        const escaped = ('' + value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    );

    // I-add ang header sa pinakataas
    csvRows.unshift(header.join(','));
    const csvString = csvRows.join('\r\n');

    // 4. I-download ang file (Gi-handle ang UTF-8 para sa special characters)
    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Customer_List_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 5. Feedback sa user
    this.messageService.add({
      severity: 'success',
      summary: 'Export Success',
      detail: 'Exported successfully.'
    });
  }
}