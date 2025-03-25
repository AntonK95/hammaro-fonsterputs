export interface Booking {
  id?: string; // Databasens ID (kan vara null tills det sätts)
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  customerId?: string | null; // Kan vara null om ingen kund är inloggad
  requestedDate: string; 
  confirmedDate?: string | null; // Null tills det godkänns
  placedDate?: string;
  items: BookingItem[]; 
  totalDuration: number; 
  totalPrice?: number; 
  status: 'pending' | 'placed' | 'confirmed' | 'canceled'; // Status kan ändras
  notes?: string; 
  createdAt: string;
  }

  export interface BookingItem {
    serviceName: string; 
    price?: number; 
    timePerUnit: number; 
    description: string;
    quantity: number;
    quantityRange?: number;
  }