export interface Booking {
    date: any;
    name: any; // Bokningens namn?
    id?: string; // Databasens ID (kan vara null tills det sätts)
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    customerId?: string | null; // Kan vara null om ingen kund är inloggad
    requestedDate: string; // YYYY-MM-DD eller ISO-format
    confirmedDate?: string | null; // Null tills det godkänns
    items: BookingItem[]; // Array med produkter/tjänster
    totalDuration: number; // Totalt antal minuter
    totalPrice: number; // Totalt pris i valfri valuta
    status: 'pending' | 'confirmed' | 'canceled'; // Status kan ändras
    note?: string; // Valfria anteckningar
    createdAt: string; // Tidsstämpel när bokningen skapades
  }

  export interface BookingItem {
    serviceName: string; // Namn på tjänsten/produkten
    price?: number; // Pris
    timePerUnit: number; // Tidsåtgång i minuter
    description: string;
    quantity: number;
    quantityRange?: number;
  }