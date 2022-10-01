import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //data send from parent to child
//   @Input() userFromHomeComponent : any;
  //data send from child to parent - 1
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private accountService:AccountService) { }

  ngOnInit(): void {
  }

   register()
   {
      this.accountService.register(this.model).subscribe(response => {
         console.log(response);
         this.cancel();
      }, error => {
         console.log(error);
      });
      //console.log(this.model);
   }

   cancel()
   {
      //console.log('cancelled');
      //data send from child to parent - 2
      this.cancelRegister.emit(false);
   }

}
