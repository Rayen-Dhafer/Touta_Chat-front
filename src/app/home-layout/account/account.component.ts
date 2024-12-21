import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

  constructor(private router: Router, private api: ApiService, private toastr: ToastrService) { } 

  formData : FormData = new FormData()
  filePreview: string | ArrayBuffer | null = null; // Define the filePreview property

  token= localStorage.getItem("token")
  user = { 
    photoProfile: '', 
    name: '' ,
    phone: '' ,
    email: '' ,
    countryCode: '' 
  };
  url:any
  editPP=false
  showInfo = false;
  showpwd = false;
  showEmail = false;

  oldPhotoProfile=''
  oldName=''


  passwordOld=''
  passwordNew=''
  passwordNewConf=''
  Email=''

  ngOnInit(): void {
    this.url= this.api.url
 
    this.api.getUser({token: this.token}).subscribe(
      (response: any) => {

        this.user=response.user
        this.oldPhotoProfile=response.user.photoProfile
        this.oldName= response.user.name
        this.Email= response.user.email
      },
      (error: any) => {
      }
    );


  }


 



  ShowInfo(){
    this.showInfo= true
  }

  ShowPwd(){
    this.showpwd= true
  }

  ShowEmail(){
    this.showEmail= true
  }


  HideShowInfo(){
    this.showInfo= false
    this.user.photoProfile = this.oldPhotoProfile
    this.user.name = this.oldName
    this.editPP=false
  }

  HideShowPwd(){
    this.showpwd= false
    this.editPP=false
    this.showEmail= false
  }







  
  async onFileSelected (event: any) {

    this.formData = new FormData();
    const file: File = event.target.files[0];

    if (file) {
      this.formData.append('files', file);

      this.api.upload(this.formData).subscribe((res: any) => {
        if (res.path) {
          this.user.photoProfile=res.path
          this.editPP=true
        }
      });
    }
  
}


update_membre(){
  let body = {  name: this.user.name ,photoProfile: this.user.photoProfile , token: this.token }
  this.api.updateUser(body).subscribe((response: any) => {  
      
      if (response.success) {
        this.toastr.success('Updated successfully!', '', { positionClass: 'toast-top-right' });

        this.showInfo= false
      } 
    },
    (error: any) => {
     
      this.toastr.error('Error', '', { positionClass: 'toast-top-right' });
    }
  );
}


update_email(){
  let body = {  token: this.token, email: this.Email }
  this.api.updateEmail(body).subscribe((response: any) => {  
      
      if (response.success) {
        this.toastr.success('Updated successfully!', '', { positionClass: 'toast-top-right' });

        this.showInfo= false
      } 
    },
    (error: any) => {
     
      this.toastr.error('Error', '', { positionClass: 'toast-top-right' });
    }
  );
}






triggerFileInput(): void {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  fileInput.click();
}


updatePwd(){

  let body = {  oldPwd: this.passwordOld, newPwd: this.passwordNew , token: this.token }

  if( this.passwordNew != this.passwordNewConf || this.passwordNew == ''){
    this.toastr.error('Incorrect new password');

  }else{
    this.api.updatePwd(body).subscribe((response: any) => {  

      if (response.success) {
        this.toastr.success(response.message);
        this.passwordOld= ""
        this.passwordNew= ""
        this.passwordNewConf= ""
      } else{
        this.toastr.error(response.message);alert(response.message)
      }
    },
    (error: any) => {
     
      this.toastr.error('Incorrect old password');
  
    }
  );
  }

}
}
