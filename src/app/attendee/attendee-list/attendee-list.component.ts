import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AttendeeService } from '../attendee.service';
import { Observable, Subscription } from 'rxjs';
import { Attendee } from '../attendee.model';




@Component({
  selector: 'app-attendee-list',
  templateUrl: './attendee-list.component.html',
  styleUrls: ['./attendee-list.component.scss'],
})
export class AttendeeListComponent implements OnInit, OnDestroy {

  attendeeList : Attendee[] = [];
  attendeeListListener : Subscription;

  formAttendee : FormGroup;
  private modal : NgbModalRef;
  constructor(private modalService: NgbModal, private attendeeService: AttendeeService) {
  }


  ngOnInit(): void {

    this.formAttendee = new FormGroup({
      'email': new FormControl(null, {validators:[ Validators.required, Validators.email]}),
      'nom': new FormControl(null, {validators:[ Validators.required, ]}),
      'prenom': new FormControl(null, {validators:[ Validators.required, ]}),
      'occupation': new FormControl(null, {validators:[ ]}),
    });

    this.attendeeList = this.attendeeService.getAttendeeList();
   this.attendeeListListener =
      this.attendeeService.updateAttendeeList()
        .subscribe(attendeeList => {
          this.attendeeList = attendeeList;
    });
  }

  open(content) {
    this.modal = this.modalService.open(content);
  }

  onSave(){
    if (this.formAttendee.invalid){
      return;
    }

    this.modal.close();
    let attendee = {
      id :null,
      email: this.formAttendee.value.email,
      nom: this.formAttendee.value.nom,
      prenom: this.formAttendee.value.prenom,
      occupation: this.formAttendee.value.occupation,
    }
    this.attendeeService.addAttendee(attendee);

  }

  onDelete(id) {
    console.log(this.attendeeList)
    this.attendeeService.deleteAttendee(id);
  }

  ngOnDestroy(): void {
    this.attendeeListListener.unsubscribe();
  }

}

