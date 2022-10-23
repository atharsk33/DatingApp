import { ChangeDetectionStrategy } from '@angular/core';
import { Component, Input, OnInit, ViewChild,  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm: NgForm;
  @Input() username: string;
  //messages: Message[] = [];
  @Input() messages:Message[];
  messageContent: string;
  loading = false;
  

  constructor(public messageService:MessageService, private toastr: ToastrService) { }

  ngOnInit(): void {
    //this.loadMessages();
  }

  sendMessage() {
    this.loading = true;
    this.messageService.sendMessage(this.username, this.messageContent)
        .then(() => {
          this.messageForm.reset();
        //  this.toastr.success('Message sent successfully!');
        } )
        .finally(() => this.loading = false);
  }

  // sendMessage() {
  //   this.messageService.sendMessage(this.username, this.messageContent)
  //       .subscribe((message:any) => {
  //         this.messages.push(message);
  //         this.messageForm.reset();
  //         this.toastr.success('Message sent successfully!');
  //       } );
  // }

  // loadMessages() {
  //   this.messageService.getMessageThread(this.username).subscribe(messages => {
  //     this.messages = messages;
  //   });
  // }

}
