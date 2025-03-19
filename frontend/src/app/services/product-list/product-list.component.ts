import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  @Output() selectedProduct = new EventEmitter<any[]>();

  products: any[] = [];
  selectedProducts: { [key: string]: { quantity: number } } = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log("Tjänster:", data);
      },
      error: (error) => {
        console.error("Error fetching services: ", error);
      }
    });
  }

  toggleProductSelection(product: any, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      // Lägg till produkten med standardantal 1
      this.selectedProducts[product.id] = { quantity: 1 };
    } else {
      // Ta bort produkten om checkboxen avmarkeras
      delete this.selectedProducts[product.id];
    }
    console.log("isChecked: ", isChecked);
    this.emitSelectedProducts();
  }

  updateQuantity(product: any, event: Event): void {
    const quantity = +((event.target as HTMLInputElement).value);
    if (this.selectedProducts[product.id]) {
      this.selectedProducts[product.id].quantity = quantity;
    }
    console.log("Uppdaterad produkt i updateQuantity:", this.selectedProducts[product.id]);
    this.emitSelectedProducts();
  }

  emitSelectedProducts(): void {
    // Skicka markerade produkter med deras antal
    const selected = Object.keys(this.selectedProducts).map(productId => {
      const product = this.products.find(p => p.id === productId);
      console.log("Produkt hittad i emitSelectedProducts:", product);
      return { ...product, quantity: this.selectedProducts[productId].quantity };
    });
    this.selectedProduct.emit(selected);
    console.log("Valda produkter: ", selected);
  }

  resetSelectedProducts(): void {
    this.selectedProducts = {}; // Rensa alla valda produkter
    this.emitSelectedProducts(); // Skicka en tom lista för att uppdatera föräldern
    console.log("Valda produkter har återställts.");
  }
}
