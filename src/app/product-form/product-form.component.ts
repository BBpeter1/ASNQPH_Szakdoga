import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BookService } from '../services/book.service';
import { BookDTO, UserDTO } from 'models';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class BookFormComponent implements OnInit {

  isNewProduct = true;
  users: UserDTO[] = [];

  bookForm = this.formBuilder.group({
    id: this.formBuilder.control(0),
    title: this.formBuilder.control(''),
    description: this.formBuilder.control(''),
    Author: this.formBuilder.control(''),
    status: this.formBuilder.control('szabad'),
    category: this.formBuilder.control(''),
    price: this.formBuilder.control(0),
    date: this.formBuilder.control(new Date().toISOString().split('T')[0])
  });
  
  toastrService: any;

  constructor(private formBuilder: FormBuilder,
    private bookService: BookService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,

    private userService: UserService) {}

    
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];

    if(id)
    {
      this.isNewProduct = false;

      this.bookService.getOne(id).subscribe({
        next: (book) =>  this.bookForm.setValue(book),
          error: (err) => { 
            console.error(err);
            this.toastrService.error('A könyv adatok betöltése sikertelen','Hiba');
          }
      });
    }

    this.userService.getAll().subscribe({
      next: (users) => this.users = users,
      error: (err) => {
        console.error(err);
        this.toastrService.error('A felhasználók betöltése sikertelen','Hiba');
      }
    });

  }

    saveProduct()
    {
      const book = this.bookForm.value as BookDTO;

      if (this.isNewProduct)
      {
      this.bookService.create(book).subscribe({
        next: (book) => {this.toastr.success('Suiiii , id:' + book.id, 'Product created')},
        error: (err) => {this.toastr.error('Gatya', 'Hiba')}
      });
    }
    else{
      this.bookService.update(book).subscribe({
        next: (book) => {this.toastr.success('Suiiii , id:' + book.id, 'Product updated')},
        error: (err) => {this.toastr.error('Gatya', 'Hiba')}
    });
  }
  }

  compareObjects(obj1: any, obj2: any)
  {
    return obj1 && obj2 && obj1.id == obj2.id;
  }

}