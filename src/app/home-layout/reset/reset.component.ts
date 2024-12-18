import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent {

  constructor(private route: ActivatedRoute,private router: Router, private api: ApiService, private toastr: ToastrService) { } 

  token= localStorage.getItem("token")
  passwordNew=''
  passwordNewConf=''


  ngOnInit(): void {
    if(!this.route.snapshot.queryParamMap.get('token')){
     
        this.router.navigate(["home/account"]);
    
    }
  }


  updatePwd(){

    let body = {   newPwd: this.passwordNew , token: this.token }
  
    if( this.passwordNewConf != this.passwordNew && this.passwordNew == ''){
      this.toastr.error('Incorrect new password');
  
    }else{
      this.api.updatePwd(body).subscribe((response: any) => {  
  
        if (response.success) {
          this.toastr.success(response.message);
          this.router.navigate(["home/account"]) 

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
