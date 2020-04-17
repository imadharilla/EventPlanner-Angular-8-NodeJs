import { MyEvent} from './event.model'
import { Subject } from 'rxjs';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment"

const BACKEND_URL = environment.apiUrl + '/events/'

@Injectable()
export class EventsService {

  private events : MyEvent[] = [];

  private eventsUpdated = new Subject<{events :MyEvent[] ,  maxEvents:number}>();


  constructor(private http : HttpClient, private router : Router){

  }
  getPosts(eventsPerPage:number, currentPage: number) {

    const queryParams = `?pagesize=${eventsPerPage} &page=${currentPage}`;
    this.http.get<{message, events: any[] , maxEvents:number} >(  BACKEND_URL + queryParams)
    .pipe(map((eventData) => {
      return {events : eventData.events.map(event => {
        return {
          id : event._id,
          title: event.title,
          imageUrl : event.imagePath,
          description : event.description,
          startDate : event.startDate,
          endDate : event.endDate,
          location : event.location,
          attendeelist : event.attendeeList,
        };
      })
      , maxEvents : eventData.maxEvents
      };
    }))
    .subscribe((transformedEvent) => {
      try {
        this.events = transformedEvent.events;
        this.eventsUpdated.next({events : [...this.events] , maxEvents: transformedEvent.maxEvents});
      } catch (error) {
        alert("Hona Error" + error);
      }

    }, error=> {
      this.router.navigate(['/login']);
    });

    return [...this.events];
  }

  addPost(event: MyEvent , image: File){

    const postData = new FormData();
    postData.append("image", image, event.title);
    const jsonEvent = JSON.stringify(event);
    postData.append("jsonEvent", jsonEvent );
    this.http.post<{message : string, eventId: string, url:string}>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });

  }

   getEvent(id: string){
     return this.http.get<{_id:string, title:string, imagePath:string ,description: string, startDate:Date, endDate:Date, location:string, attendeeList:any}>(BACKEND_URL+id);
   }


   updateEvent(id : string, event: MyEvent, image: any){

      if (typeof(image) ==='string'){
        this.http.put<{message:string , imagePath:string}>(BACKEND_URL+ id, event)
        .subscribe((response)=> {

          this.router.navigate(['/']);
        });
      }
      else {
        const postData = new FormData();
        postData.append("image", image, event.title);
        postData.append("jsonEvent", JSON.stringify(event));

        this.http.put<{message:string , imagePath:string}>(BACKEND_URL+id, postData)
          .subscribe((response)=> {

            this.router.navigate(['/']);
          });
      }

   }


  deletePost(eventId : string) {
    return this.http
    .delete(BACKEND_URL + eventId);

  }

  getPostUpdateListener() {
    return this.eventsUpdated.asObservable();
  }
}
