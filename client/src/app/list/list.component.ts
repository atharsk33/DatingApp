import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { MemberService } from '../_services/member.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  members: Partial<Member[]>;
  predicate = 'liked';
  pNumber = 1;
  pageSize = 2;
  pagination: Pagination;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.loadLikes();
  }
  

  loadLikes() {
    this.memberService.getLikes(this.predicate,this.pNumber, this.pageSize).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  pageChanged(event: any) {
      this.pNumber = event.page;
      this.loadLikes();
  }

}
