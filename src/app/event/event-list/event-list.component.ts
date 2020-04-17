import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import {MyEvent} from '../event.model';
import { Subscription, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  events: MyEvent[]  = [];
  upcommingEvent: MyEvent[] = [];
  pastEvent: MyEvent[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 0;
  pageSizeOptions = [5, 10, 15, 20];
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
        this.getUpcommingEvent();
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


  getUpcommingEvent(){
    this.upcommingEvent = [];
    this.pastEvent = [];
    this.events.map(event=>{
      let dateNow = new Date();
      let eventDate = new Date(event.startDate);
      let dateNowStr = dateNow.getFullYear().toString() + dateNow.getMonth().toString() + dateNow.getDate().toString();
      let eventDateStr = eventDate.getFullYear().toString() + eventDate.getMonth().toString() + eventDate.getDate().toString();

      if (dateNowStr <= eventDateStr) {
        this.upcommingEvent.push(event);
      }else {
        this.pastEvent.push(event)
      }
    })
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
    this.authSubsLinstener.unsubscribe();
  }



}

