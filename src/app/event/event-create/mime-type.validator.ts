import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeTypeImage = (control : AbstractControl): Promise<{[key:string]: any}> | Observable<{[key:string]: any}> => {

  if ( typeof(control.value) === 'string'){
    return of(null);
  }

  const file = control.value as File;
  const fileReader = new FileReader();


  const frObs = Observable.create((observer: Observer<{[key:string]: any}>) => {
    fileReader.addEventListener("loadend", ()=> {
      let imagePreview = fileReader.result as ArrayBuffer;
      const arr = new Uint8Array(imagePreview).subarray(0.4);
      let header = "";
      let isValid = false;
      for (let i=0; i< arr.length ; i++){
        header += arr[i].toString(16);
      }
      header = header.substring(0, 8);

      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }

      if(isValid) {

        observer.next(null);
      } else {

        observer.next({invalidMineType : true});
      }
      observer.complete();

    });
    try {

      fileReader.readAsArrayBuffer(file);

    }
    catch {

    }

  });

  return frObs;
};
