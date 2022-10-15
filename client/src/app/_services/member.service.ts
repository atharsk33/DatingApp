import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginationHeader, getPaginatedResult } from './paginationhelper';

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
  memberCache = new Map();
  userParams: UserParams;
  user: User;
  

  constructor(private http:HttpClient, private accountService:AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  getUserParam() {
    return this.userParams;
  }

  setUserParam(params: UserParams) {
    this.userParams = params;
  }

  resetUserParam() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    //console.log(Object.values(userParams).join('-'));

    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response) {
      return of(response);
    }

    let params = getPaginationHeader(userParams.pageNumber, userParams.pageSize);
    params =params.append('minAge', userParams.minAge.toString());
    params =params.append('maxAge', userParams.maxAge.toString());
    params =params.append('gender', userParams.gender );
    params =params.append('orderBy', userParams.orderBy );

    return getPaginatedResult<Member[]>(this.baseUrl + "users", params, this.http)
    .pipe(map(response => {
      this.memberCache.set(Object.values(userParams).join('-'), response);
      return response;
    }));  
}

  getMember(username: string){
   // console.log(this.memberCache);
    //const member = this.members.find(x => x.username === username);   
    //if(member !== undefined) return of(member);
    //this.http.get(this.baseUrl + 'users/' + username, httpOption);
    let member = [...this.memberCache.values()]
    .reduce((arr, elem) => arr.concat(elem.result), [])
    .find((member: Member) => member.username === username);

    if(member) {
      return of(member);
    }

    console.log(member);
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

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeader(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
    
    //return this.http.get<Partial<Member[]>>(this.baseUrl + 'likes?predicate=' + predicate);
  }

}



  // getMembers(page?: number, itemsPerPage?: number) {
  //   let params = new HttpParams();

  //   if(page !== null && itemsPerPage !== null) {
  //     params = params.append('pageNumber', page?.toString() || 1);
  //     params = params.append('pageSize', itemsPerPage?.toString() || 10);
  //   }

  //   return this.http.get<Member[]>(this.baseUrl + 'Users', {observe: 'response', params}).pipe(
  //     map(response => {
  //         this.paginatedResult.result = response.body || this.paginatedResult.result;
  //         if(response.headers.get('Pagination') !== null)
  //         {
  //           this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination') || '');
  //         }
  //         return this.paginatedResult;
  //     })
  //   );  
  // }

  // getMembers() {
  //   if(this.members.length > 0) return of(this.members);
  //   //return this.http.get<Member[]>(this.baseUrl + 'Users', httpOption);
  //   return this.http.get<Member[]>(this.baseUrl + 'Users').pipe(
  //     map((members: Member[]) => {
  //       this.members = members
  //       return members;
  //     } )
  //   );
  // }