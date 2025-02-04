import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { Item } from './item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private items = [
    new Item('Table', 0),
    new Item('Chair', 0),
    new Item('Projector', 0),
    new Item('Speaker', 0),
    new Item('DSLR', 0),
    new Item('Video Camera', 0),
    new Item('Tripod', 0),
    new Item('Laptop', 0),
    new Item('Monitor', 0),
    new Item('TV', 0),
    new Item('Keyboard', 0),
    new Item('Mouse', 0),
  ];

  constructor() { }

  getAll(): Item[] {
    return this.items;
  } 

  getAllAsync(): Observable<Item[]> {
    return of(this.items);
  }

  resetQuantity() {
    for (let item of this.items) {
      item.quantity = 0;
    }
  }
}
