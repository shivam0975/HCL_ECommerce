import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddressResponse, CreateAddressRequest, UpdateAddressRequest } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private http = inject(HttpClient);
  private apiPath = '/Address';

  getAllAddresses(): Observable<AddressResponse[]> {
    return this.http.get<AddressResponse[]>(this.apiPath);
  }

  getAddressById(id: number): Observable<AddressResponse> {
    return this.http.get<AddressResponse>(`${this.apiPath}/${id}`);
  }

  getAddressesByUserId(userId: number): Observable<AddressResponse[]> {
    return this.http.get<AddressResponse[]>(`${this.apiPath}/user/${userId}`);
  }

  createAddress(request: CreateAddressRequest): Observable<AddressResponse> {
    return this.http.post<AddressResponse>(this.apiPath, request);
  }

  updateAddress(id: number, request: UpdateAddressRequest): Observable<AddressResponse> {
    return this.http.put<AddressResponse>(`${this.apiPath}/${id}`, request);
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }
}
