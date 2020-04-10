import { Component, OnInit } from '@angular/core';



interface Attendee {
  nom: string;
  email: string;
  occupation: string;
}

@Component({
  selector: 'app-attendee-list',
  templateUrl: './attendee-list.component.html',
  styleUrls: ['./attendee-list.component.scss'],
})
export class AttendeeListComponent implements OnInit {
  attendeeList = [{nom:"hehe", email:"iaia@gmail.com ", occupation:"Doctor"},
  {nom:"hehe", email:"iaia@gmail.com ", occupation:"Doctor"},
  {nom:"hehe", email:"iaia@gmail.com ", occupation:"Doctor"},
  {nom:"hehe", email:"iaia@gmail.com ", occupation:"Doctor"},]

  constructor() { }

  ngOnInit(): void {
  }

}
