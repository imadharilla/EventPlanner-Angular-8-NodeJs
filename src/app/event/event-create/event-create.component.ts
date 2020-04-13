import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormControl, Validators } from '@angular/forms';


import { MyEvent} from '../event.model' ;
import { EventsService } from '../events.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeTypeImage } from './mime-type.validator';
import { Attendee } from '../../attendee/attendee.model';
import { AttendeeService } from 'src/app/attendee/attendee.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {

  form: FormGroup;
  form2 : FormGroup;
  imagePreview : string;
  isLoading = false;
  private mode = 'create';
  private eventId : string;
  public event : MyEvent;
  public attendeeList : Attendee[];
  constructor(private eventsService: EventsService, public route: ActivatedRoute, private attendeeService: AttendeeService ) {

  }

  ngOnInit(): void {

    this.form = new FormGroup({
      'title' : new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'image' : new FormControl(null,
        {validators:[],
        asyncValidators: [mimeTypeImage]}),
      'description' : new FormControl(null, {validators: []}),
      'startDate' : new FormControl(null, {validators: [Validators.required]}),
      'endDate' : new FormControl(null, {validators: [Validators.required]}),
      'location' : new FormControl(null, {validators: [Validators.required]}),
    });

    this.form2 = new FormGroup({});


    this.attendeeList =  this.attendeeService.getAttendeeList() ;
    console.log(this.attendeeList);
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('eventId')){
        this.mode = 'edit';
        this.eventId = paramMap.get('eventId');
        this.isLoading = true;
        this.eventsService
          .getEvent(this.eventId)
            .subscribe((event)=> {
              this.isLoading = false;
              this.event = {
                id : event._id,
                title : event.title,
                imageUrl: event.imagePath,
                description : event.description,
                startDate : event.startDate,
                endDate : event.endDate,
                location : event.location,
              };

              this.imagePreview = this.event.imageUrl;
              this.form.setValue({
                'title' : this.event.title,
                'description' : this.event.description,
                'image' : this.event.imageUrl,
                'startDate' : this.event.startDate,
                'endDate' : this.event.endDate,
                'location' : this.event.location,
              })
            });

      }

      else{
        this.mode = 'create';
        this.eventId = null;
      }

    });
  }

  addAttendee(nom, prenom, email){
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image' : file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  onSaveEvent(){
    if( this.form.invalid  ){
      return;
    }
    this.isLoading = true;

    if( this.mode === 'create' ){
      const event : MyEvent=
          {
            id : null,
          title : this.form.value.title,
          imageUrl: null,
          description : this.form.value.description,
          startDate : this.form.value.startDate,
          endDate : this.form.value.endDate,
          location : this.form.value.location,
          };

      this.eventsService.addPost(event , this.form.value.image);
      this.form.reset();
    }
    else {
      const event : MyEvent=
          {
            id : this.eventId,
          title : this.form.value.title,
          imageUrl: this.event.imageUrl,
          description : this.form.value.description,
          startDate : this.form.value.startDate,
          endDate : this.form.value.endDate,
          location : this.form.value.location,
          };

      this.eventsService.updateEvent(this.eventId ,event, this.form.value.image);
      this.form.reset();

    }
  }
}
