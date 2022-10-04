import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users:any;
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    //this.getUsers();
  }

  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  // send data from parent to child component
  getUsers()
  {
    this.http.get('https://localhost:5001/api/users').subscribe(response => this.users = response);
  }

  cancelRegisterMode(event: boolean)
  {
    this.registerMode = event;
  }
}