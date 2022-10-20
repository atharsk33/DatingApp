import { group } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Group } from '../_models/group';
import { Message } from '../_models/message';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeader } from './paginationhelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) { }

  createHubConnection(user: User, otherUser: string ) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + "message?user=" + otherUser, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

      this.hubConnection.start().catch(error => console.log(error))

      this.hubConnection.on("ReceiveMessageThread", messages => {
        this.messageThreadSource.next(messages);
        console.log(messages);
      })

      this.hubConnection.on("NewMessage", message => {
        this.messageThread$.pipe(take(1)).subscribe(messges => {
          this.messageThreadSource.next([...messges, message]);
        });
      })

      this.hubConnection.on("UpdatedGroup",(group:Group) => {
        if(group.Connections.some(x => x.username === otherUser)) {
          this.messageThread$.pipe(take(1)).subscribe(messages => {
            messages.forEach(message => {
              if(!message.dateRead) {
                message.dateRead = new Date(Date.now())
              }
            })
            this.messageThreadSource.next([...messages])
          })
        }
      })
  }

  stopHubConnection() {
    if(this.hubConnection) {
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeader(pageNumber, pageSize);
    params = params.append('container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  getMessageThread(username:string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  async sendMessage(username: string, content: string) {
   // return this.http.post(this.baseUrl + 'messages', {recipientUsername: username, content});
   return this.hubConnection.invoke('SendMessage',{recipientUsername: username, content})
          .catch(error => console.log(error));
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id );
  }

}
