import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  //members: Member[] = [];
  members$: Observable<Member[]>;
  members: Member[] = [];
  pagination: Pagination;
  // pagenumber = 1;
  // pageSize = 5;
  userParams: UserParams;
  user: User;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]


  constructor(private memberService:MemberService, private accountService:AccountService) { 
    // this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
    //   this.user = user;
    //   this.userParams = new UserParams(user);
    // });
    this.userParams = this.memberService.getUserParam();
  }

  ngOnInit(): void {
    //this.loadMembers();
   // this.members$ = this.memberService.getMembers();
   this.loadMembers();
  }

  loadMembers() {
    this.memberService.setUserParam(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  resetFilters() {
   // this.userParams = new UserParams(this.user);
    this.userParams = this.memberService.resetUserParam();
    this.loadMembers();
  }

  // loadMembers() {
  //   this.memberService.getMembers(this.pagenumber, this.pageSize).subscribe(response => {
  //     this.members = response.result;
  //     this.pagination = response.pagination;
  //   });
  // }

  pageChanged(event:any) {
   //this.pagenumber = event.page;
   this.userParams.pageNumber = event.page;
   this.memberService.setUserParam(this.userParams);
   this.loadMembers();
  }

  // loadMembers() {
  //   this.memberService.getMembers().subscribe(members => {
  //     this.members = members;
  //   });
  // }

}
