import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { ConfirmService } from '../_services/confirm.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  pagination: Pagination;
  container = 'Unread';
  pagenumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService: MessageService, private toastr: ToastrService,
    private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.pagenumber, this.pageSize, this.container).subscribe(response => {
      this.messages = response.result;
      this.pagination = response.pagination;
      this.loading = false;
    });
  }

  deleteMessage(id: number) {
    this.confirmService.confirm('Confirm delete message',
      'Are you sure you want to delete this',
      'Delete').subscribe(result => {
        if (result) {
          this.messageService.deleteMessage(id).subscribe(() => {
            this.messages.splice(this.messages.findIndex(m => m.id == id), 1);
          });
        }
      });

  }

}
