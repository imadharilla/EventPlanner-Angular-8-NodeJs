import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import {MyEvent} from '../event.model';
import { Subscription, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  events: MyEvent[]  = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 0;
  pageSizeOptions = [1, 2, 3, 5];
  isAuthenticated : boolean = false;
  private authSubsLinstener : Subscription;
  private eventsSub : Subscription;


  constructor(private eventService : EventsService, private authService : AuthService) {

  }



  ngOnInit(): void {
    this.isLoading = true;
    this.events = this.eventService.getPosts(this.postsPerPage, 0 );
    this.eventsSub =  this.eventService.getPostUpdateListener()
    .subscribe(( eventData : {events:MyEvent[],maxEvents : number}) =>{
        this.isLoading = false;
        this.totalPosts = eventData.maxEvents;
        this.events = eventData.events;
    } );

    this.isAuthenticated = this.authService.getIsAuth();
    this.authSubsLinstener =
      this.authService
      .getAuthStatusListener()
      .subscribe( isAuthenticated =>{
        this.isAuthenticated = isAuthenticated;
      })


  }


  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex;
    this.events = this.eventService.getPosts(pageData.pageSize, pageData.pageIndex );

  }

  onDelete(eventId : string){
    this.isLoading = true;
    this.eventService.deletePost(eventId).subscribe(()=>{
      this.eventService.getPosts(this.postsPerPage , this.currentPage===0?this.currentPage:this.currentPage-1 );
    });
  }


  ngOnDestroy() {
    this.eventsSub.unsubscribe();
    this.authSubsLinstener.unsubscribe();
  }



}

