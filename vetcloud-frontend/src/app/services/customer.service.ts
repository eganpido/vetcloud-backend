import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    // Siguraduha nga mao ni ang port sa imong Node.js backend
    private apiUrl = 'http://localhost:5000/api/customers';

    constructor(private http: HttpClient) { }

    // 1. Makuha ang tanang customers
    getCustomers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/all`);
    }

    // 2. Pag-add og bag-ong customer
    createCustomer(customer: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/add`, customer);
    }

    // 3. Pag-update sa existing customer
    // Gigamit nato ang 'code' isip unique identifier
    updateCustomer(code: string, customer: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update/${code}`, customer);
    }

    // 4. Pag-delete sa customer
    deleteCustomer(code: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/delete/${code}`);
    }
}