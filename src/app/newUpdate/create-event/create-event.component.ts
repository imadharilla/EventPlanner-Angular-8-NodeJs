import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {


  createEventForm: any;
  name: any;
  eventType: any;
  host: any;
  start: any;
  end: any;
  guests: any;
  location: any;
  message: any;
  guestsTouched: boolean = false; // Workaround to create <tag-input> component validation...


  currentUser: any;
  events: Event[];

  constructor() { }

  ngOnInit(): void {
  }


  buildForm() {

  }

  checkGuestList(item) {
  }

  getCurrentUser() {

  }

  geolocate() {
  }

  updateEndTime() {
  }

  getEvents() {
  }

  updateLocationValue() {

  }

  onSubmit() {

  }


}
