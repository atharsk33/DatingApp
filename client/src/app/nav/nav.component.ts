import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(public accountservice:AccountService, private router:Router, 
    private toastr:ToastrService) { }

  ngOnInit(): void {
    //this.getCurrentUser();
  //  this.currentUser$ = this.accountservice.currentUser$;
  }

  login() {
    this.accountservice.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/members');
      this.toastr.success('Login Succussfully!');
      //console.log(response);
//      this.loggedIn = true;
    },
    error => {
      console.log(error);
      this.toastr.error(error.error);
    });
    ;
  }

  logout(){
    this.accountservice.logout();
    this.router.navigateByUrl('/');
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
