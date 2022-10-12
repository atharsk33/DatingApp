import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
   registerForm: FormGroup;
   maxDate: Date;
   validationErrors: string[] = [];

   constructor(private accountService: AccountService, private toastr: ToastrService, private fb:FormBuilder,
      private router:Router) { }
 
   ngOnInit(): void {
      this.initializeRegisterForm();
      this.maxDate = new Date();
      this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
   }

   initializeRegisterForm() {
      this.registerForm = this.fb.group({
         gender: ['male'],
         username: ['', Validators.required], 
         knownAs: ['', Validators.required],
         dateofBirth: ['', Validators.required],
         city: ['', Validators.required],
         country: ['', Validators.required],
         password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
         confirmPassword: ['', [Validators.required, this.matchValues('password')]]
      });

      // this.registerForm = new FormGroup({
      //    username: new FormControl('', Validators.required),
      //    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      //    confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
      // });
   }

   matchValues(matchTo: string): ValidatorFn {
      return (control: AbstractControl) => {
          return control.value === (control?.parent?.controls as { [key: string]: AbstractControl })[matchTo].value ? null : { isMatching: true };
      }
  }

   register() {

      this.accountService.register(this.registerForm.value).subscribe(
         response  => {
         this.router.navigateByUrl('/members');
      }, error => {
        this.validationErrors = error;
      });

     // console.log(this.registerForm.value);
      // this.accountService.register(this.model).subscribe(response => {
      //    //console.log(response);
      //    //this.cancel();
      // }, error => {
      //    //   console.log(error);
      //   // this.toastr.error(error.error);
      // });
      //console.log(this.model);
   }

   cancel() {
      //console.log('cancelled');
      //data send from child to parent - 2
      this.cancelRegister.emit(false);
   }

}
