import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Socket } from 'ngx-socket-io';

interface LeaveRoomResponse {
  success: boolean;
  message: string; // Adjust this according to your server's response structure
}
@Component({
  selector: 'app-touta-home',
  templateUrl: './touta-home.component.html',
  styleUrl: './touta-home.component.css'
})
export class ToutaHomeComponent {

  constructor(private route: ActivatedRoute,private router: Router, private api: ApiService,private toastr: ToastrService,private socket: Socket ) { } 

  token= localStorage.getItem("token")
  messages(){ this.router.navigate(["home/messages"]) }
  account(){ this.router.navigate(["home/account"]) }
  about(){ this.router.navigate(["home/aboutUs"]) }
  chatia(){this.router.navigate(["home/chatIA"]) }
  id:any

  ngOnInit(): void {


    if(!this.token){
      this.token = this.route.snapshot.queryParamMap.get('token');
      if(!this.token){
        this.router.navigate(["login"]);
      }else{
        localStorage.setItem("token", this.token);
      }
    }
    this.api.getId({token: this.token}).subscribe(
      (response: any) => {

        this.id= response.myId;
      },
      (error: any) => {           
        localStorage.removeItem('token');
        this.router.navigate(["login"]);
      }
    );

  }
  
  ngOnDestroy(): void {

    this.socket.emit('leaveRoom', this.id, (response: LeaveRoomResponse) => {});
  }

 

  Logout() {

    Swal.fire({
        title: 'Logout ?',
        text: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: '#695377',
        cancelButtonColor: '#800080',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.isConfirmed) {

          this.socket.emit('leaveRoom', this.id, (response: LeaveRoomResponse) => {});
          localStorage.removeItem('token');

          this.clearAllCookies()
          this.router.navigate(["login"]);
        }
    });
}


clearAllCookies(): void {
  if (typeof document !== 'undefined') {
      const cookies = document.cookie;

      // Create a temporary cookie to help delete
      document.cookie = `${cookies}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

      // Clear each cookie
      for (const cookie of cookies.split(';')) {
          document.cookie = `${cookie.trim()}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }

      // Log to verify that cookies have been deleted
      console.log("Cookies after deletion:", document.cookie);
  }
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

}