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
  selectProduct(product: any): void {
    this.selectedProduct.emit(product);
    console.log("Vald produkt: ", product);
  }
}
