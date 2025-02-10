import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '../shared/item';
import { ItemService } from '../shared/item.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.page.html',
  styleUrls: ['./add-items.page.scss'],
})
export class AddItemsPage {
  items: Item[];
  searchControl = new FormControl('');

  constructor(private router: Router, private itemService: ItemService) {
    this.items = this.itemService.getAll();
  }

  save() {
    this.router.navigate(['/tabs/new-loan']);
  }

  search(event) {
    const text = event.target.value;
    const allItems = this.itemService.getAll();
    if (text && text.trim() !== '') {
      this.items = allItems.filter((item) =>
        item.id.toLowerCase().includes(text.toLowerCase())
      );
    } else {
      this.items = allItems;
    }
  }

  refresh($event) {
    this.searchControl.setValue('');
    $event.target.complete();
    this.items = this.itemService.getAll();
  }
}
