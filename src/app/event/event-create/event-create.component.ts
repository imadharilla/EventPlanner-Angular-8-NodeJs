import { Component, OnInit, OnDestroy } from '@angular/core';
import {  FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';


import { MyEvent} from '../event.model' ;
import { EventsService } from '../events.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeTypeImage } from './mime-type.validator';
import { Attendee } from '../../attendee/attendee.model';
import { AttendeeService } from 'src/app/attendee/attendee.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit, OnDestroy {
  private AttendeeListener : Subscription;
  form: FormGroup;
  form2 : FormGroup;
  checkedList: string[] = []
  imagePreview : string;
  isLoading = false;
  private mode = 'create';
  private eventId : string;
  public event : MyEvent;
  public attendeeList : Attendee[];
  constructor(
    private eventsService: EventsService,
     public route: ActivatedRoute,
      private attendeeService: AttendeeService,
      private fb: FormBuilder ) { }

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

    this.checkedList =[];

    this.form2 = this.fb.group({
      name: this.fb.array([])
    });


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
                attendeelist : event.attendeeList};

              this.imagePreview = this.event.imageUrl;
              //Updating Form :
              this.form.setValue({
                'title' : this.event.title,
                'description' : this.event.description,
                'image' : this.event.imageUrl,
                'startDate' : this.event.startDate,
                'endDate' : this.event.endDate,
                'location' : this.event.location,
              });
              this.checkedList= this.event.attendeelist;



            });


      }

      else{
        this.mode = 'create';
        this.eventId = null;
      }

    });


    this.attendeeList =  this.attendeeService.getAttendeeList() ;
    this.AttendeeListener = this.attendeeService.updateAttendeeList().subscribe((list)=>{
      this.attendeeList = list;

    });
  }

  onChecked(name: string, isChecked: boolean) {
    if (isChecked) {
      if (!this.checkedList.includes(name)) {
        this.checkedList.push(name);
      }
    } else {
      let index = this.checkedList.indexOf(name);
      this.checkedList.splice(index, 1);
    }
    console.log(this.checkedList)

  }

  isChecked(id) {
    let isChecked = this.event.attendeelist.includes(id);
    return isChecked;
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
    //console.log(this.form2.value.name);

    /*let selectedList = selectedAttendee.map(element  => {
      let attendee : Attendee({
        id: element.,
          email : attendee.email,
          nom : attendee.nom,
          prenom : attendee.prenom,
          occupation : attendee.occupation,
      })
    })*/
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
          attendeelist : this.checkedList,
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
          attendeelist : this.checkedList,
          };

      this.eventsService.updateEvent(this.eventId ,event, this.form.value.image);
      this.form.reset();

    }
  }


  ngOnDestroy () {
    this.AttendeeListener.unsubscribe();
  }
}
