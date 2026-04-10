export interface AddressResponse {
  addressId: number;
  userId: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
}

export interface CreateAddressRequest {
  userId?: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface UpdateAddressRequest {
  userId?: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
}
