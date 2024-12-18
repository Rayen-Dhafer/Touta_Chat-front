import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {

  verificationMethod:any
  phoneNumber: string = '';
  password: string = '';
  name: string = '';
  regPassword: string = '';
  verificationCode: string = ''; 
  selectedCountryCode: string = '+216'; 
  showLoginForm: boolean = true;
  showRegisterForm: boolean = false;
  showVerificationCode: boolean = false;
  showForgot: boolean = false;

  reset=false
  token= localStorage.getItem("token")
  
  constructor(private router: Router, private api: ApiService,private toastr: ToastrService ) { } 
  
  ngOnInit(): void { 
 
    if(this.token){
      this.router.navigate(["/home"]) 
    }
  }


  onLoginSubmit() {
    // Handle login logic here
  }


  getTokenFromCookies(): string | null {
    if (typeof document !== 'undefined') {
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');

         for (let cookie of cookies) {
            const [name, value] = cookie.split('=').map(c => c.trim());
            if (name === 'token') {
                return value;  
            }
        }
    }
    return null;  
  }

  showForgotform(){
    this.showLoginForm = false;
    this.showRegisterForm = false;
    this.showForgot= true;
    this.name=""
  }

  showRegistrationForm() {
    this.showRegisterForm = true;
    this.showLoginForm = false;
  }

  sendVerificationCode() {
    this.showVerificationCode = true;
    this.showLoginForm = false;
    this.showRegisterForm = false;

    const body = { name: this.name, password: this.regPassword , phone: this.phoneNumber, countryCode: this.selectedCountryCode  };

    this.api.createUser(body).subscribe(
      (response: any) => {
        this.toastr.info('send Verification Code ');
      },
      (error: any) => {
        this.toastr.error('Error'); 
      }
    );
  }


  verificationUser(){
    this.phoneNumber = this.name
    const body = { verificationCode: this.verificationCode,   phone: this.phoneNumber  };
    this.api.verificationUser(body).subscribe(
      (response: any) => {
        if(response.success){
          this.toastr.success(response.title);
          if(this.reset){
            this.router.navigate(['home/reset'], {
              queryParams: { token: response.token }
            });

          }else{
            this.router.navigate(["home"]) 
          }
        }else{
          this.toastr.error('Invalid code'); 
        }
      }
    );
  }


  ResetPwd(){
    if( this.verificationMethod == "email" ){
      const body = { email: this.name  };

      this.api.sendLinkReset(body).subscribe(
        (response: any) => {
          if(response.success){
            this.toastr.success("Check your email");
            //this.router.navigate(["home"]) 
          } 
          
        },
        (error: any) => {
          this.toastr.error('Invalid email'); 

        }
      );
    }
    else{
      if( this.verificationMethod == "phone" ){
        //
        this.api.SendRestCode({phone: this.name }).subscribe(
          (response: any) => {
            if(response.success){
              this.toastr.success("Check your phone");
              this.showForgot=false
              this.showVerificationCode=true
              this.reset=true
             } 
            
          },
          (error: any) => {
            this.toastr.error('Invalid phone'); 
          }
        );

      }
    }
  }

 

  returnToLogin() {
    this.showRegisterForm = false;
    this.showLoginForm = true;
    this.showVerificationCode = false;
    this.phoneNumber=''
    this.selectedCountryCode='+216'
  }

  showSuccess() {

    const body = { password: this.password,   phone: this.phoneNumber, countryCode: this.selectedCountryCode  };
    this.api.login(body).subscribe(
      (response: any) => {
        this.clearAllCookies()

        localStorage.setItem("token", response.token);
        //document.cookie = `token=${response.token}; path=/;`;
        this.toastr.success(response.title);
        this.router.navigate(["/home"]) ;window.location.reload();
        
      },
      (error: any) => {
        if(error.error.title != "User is not verified" ){
          this.toastr.info(error.error.title);
        }else{
          this.toastr.warning(error.error.title);
          this.showVerificationCode = true;
          this.showLoginForm = false;
          this.showRegisterForm = false;
        }       
      }
    );
  }

  clearAllCookies(): void {
    if (typeof document !== 'undefined') {
        const cookies = document.cookie;

        document.cookie = `${cookies}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

        for (const cookie of cookies.split(';')) {
            document.cookie = `${cookie.trim()}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }

    }
}


}
