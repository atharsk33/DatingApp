import { Component, OnInit } from '@angular/core';
import { empty, Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
//  loggedIn:boolean=false;
  userName:string='';
//  currentUser$ = new Observable<User>;

  constructor(public accountservice:AccountService) { }

  ngOnInit(): void {
    //this.getCurrentUser();
  //  this.currentUser$ = this.accountservice.currentUser$;
  }

  login() {
    this.accountservice.login(this.model).subscribe(response => {
      console.log(response);
//      this.loggedIn = true;
    },
    error => {
      console.log(error);
    });
    ;
  }

  logout(){
    this.accountservice.logout();
  //  this.loggedIn = false;
  }

  // getCurrentUser(){
  //   this.accountservice.currentUser$.subscribe(user => {
  //     this.loggedIn = !!user;
  //     this.userName = user.username;
  //   }, error => {
  //     console.log(error);
  //   });
  // }

}
