import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

// const httpOption = {
//   headers: new HttpHeaders({
//     Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}')?.token
//   })
// }

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;
  members:Member[] = [];

  constructor(private http:HttpClient) { }

  getMembers() {
    if(this.members.length > 0) return of(this.members);
    //return this.http.get<Member[]>(this.baseUrl + 'Users', httpOption);
    return this.http.get<Member[]>(this.baseUrl + 'Users').pipe(
      map((members: Member[]) => {
        this.members = members
        return members;
      } )
    );
  }

  getMember(username: string){
    const member = this.members.find(x => x.username === username);
    if(member !== undefined) return of(member);
    //this.http.get(this.baseUrl + 'users/' + username, httpOption);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMembers(member:Member) {
    return this.http.put(this.baseUrl + "users", member).pipe(
      map(() => {
          const index = this.members.indexOf(member);
          this.members[index] = member;
      })
    );
  }
}
