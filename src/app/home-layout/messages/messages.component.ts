import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Socket } from 'ngx-socket-io';
import { SocketIoModule } from 'ngx-socket-io';
import Swal from 'sweetalert2'

interface User {
  id: number;  
  name: string;
  user: {
      photoProfile: string;  
      name: string;  
      id:any
      otherVu:any
      meVu:any
      otherTyping:any
      active:any
  };
  conversation: {
      lastMessage: {
          message: string;  
          senderId: any; 
          messageType: any; 
      };
  };
  
}
interface JoinRoomResponse {
  success: boolean;
  message: string;  
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(private router: Router, private api: ApiService, private toastr: ToastrService, private socket: Socket    ) { } 

  isSidebarVisible: boolean = true;
  token= localStorage.getItem("token")
  messages: any; 
   users: User[] = [];  
  selectedUser: any;
  selectedMessage: any = null;  
  filteredProblems: User[] = [];  
  formData : FormData = new FormData()
  id:any
  url:any
  Mypath=""
  numMsg=20
  hasMoreMessages:any
  messagesIA: Array<{ role: string; content: string }> = [];
  langTrans="Original"


 
   showEmojiPicker: boolean = false;
   emojis: { [key: string]: string[] } = {
    "😊": ['😊', '😂', '😍', '😭', '😎', '🥺', '😅', '😜', '😏', '🤔', '😉', '😆', '🤩', '🤗', '🤤', '🤡'],
    "👨‍👩‍👧‍👦":['👨‍👩‍👧‍👦', '🧑‍⚕️', '👩‍⚖️', '🧑‍🎨', '👩‍💻', '👨‍🏫', '🧑‍🚀', '🧑‍🍳', '👨‍💻', '👩‍🔬', '👨‍👩‍👧‍👦', '👩‍👧', '👨‍👦', '👩‍🦰', '👨‍🦳', '🧑‍🦱'],
    "🐶": ['🐶', '🐱', '🐻', '🐯', '🦁', '🐸', '🐵', '🐷', '🐹', '🐴', '🦄', '🦋', '🐢', '🐍', '🐝', '🐙'],
    "🍕": ['🍕', '🍔', '🍩', '🍫', '🍓', '🍒', '🍉', '🍇', '🍪', '🍮', '🍿', '🥗', '🍜', '🍣', '🍰', '🍪'],
    "✈️": ['🚗', '✈️', '🚢', '🚉', '🏖️', '🏙️', '⛷️', '🏞️', '⛱️', '🏕️', '🌄', '🏝️', '🏜️', '🌎', '🗺️'],
    "🏀": ['⚽', '🏀', '🎮', '🎲', '🎤', '🎧', '🎬', '🎪', '🛹', '🎯', '🎳', '🏌️‍♂️', '🎨', '🏇'],
    "🧸": ['📱', '💻', '⌚', '🎁', '💡', '📷', '🎨', '🔑', '🔒', '⚙️', '🔧', '🧳', '📦', '🖼️', '🧸', '🔮'],
    "💎": ['❤️', '💯', '✨', '🔥', '🔴', '🔵', '⚡', '🌟', '⚖️', '💎', '💡', '🌈', '♻️', '🔔', '🔊', '🛑']
  };
   
  emojiCategories: string[] = Object.keys(this.emojis);

  isLoadingIA=false
  selectedCategory: string = this.emojiCategories[0];
  
  // Flag to toggle emoji picker visibility
  isEmojiPickerVisible: boolean = false;
  ngOnInit(): void {




      
      
      

    
     this.url= this.api.url
    const body = { token: this.token };

    this.api.getAllconversation(body).subscribe(
      (response: any) => {

        this.id = response.senderId
        
        this.socket.on('connect', () => {
          this.socket.emit('joinRoom', response.senderId, (response: { success: boolean, message: string }) => {
            console.log(response.success);
            // If not successful, keep trying
            if (response.success !== true) {
              this.tryJoinRoom(this.id); // Recursively call the function
            }
          });
        });
        
        // Recursive function to handle room joining


         this.filteredProblems = response.conversations;
        this.users = response.conversations;


       
        if (this.selectedUser.id == null || this.selectedUser.id == undefined || this.selectedUser.id == '') {
          
        }else {
          this.select(this.selectedUser.id)
        }
      },
      (error: any) => {
      }
    );

    




    
    this.socket.on('you_send_new_message', (data: any) => {
 
      this.api.getAllconversation(body).subscribe(
        (response: any) => {
  
          this.id = response.senderId
          this.filteredProblems = response.conversations;
          this.users = response.conversations;
  
 
            
            this.playSound('send_msg.mp3');
  

 
        },
        (error: any) => {
        }
      );});


      
      this.socket.on('new_user_active', (data: any) => {
        this.api.getAllconversation(body).subscribe(
          (response: any) => {
    
            this.filteredProblems = response.conversations;
            this.users = response.conversations;
            if(this.selectedUser.id == data.id ){
              this.select(this.selectedUser.id)
            }
          },
          (error: any) => {
          }
        );});

      this.socket.on('new_message_to_you', (data: any) => {
        
        this.api.getAllconversation(body).subscribe(
          (response: any) => {
    
            this.id = response.senderId
            this.filteredProblems = response.conversations;
            this.users = response.conversations;
    

            if (this.selectedUser.id == null || this.selectedUser.id == undefined || this.selectedUser.id == '') {
              
            }else {
              this.select(this.selectedUser.id)
              this.playSound('new_msg.mp3');
            }
          },
          (error: any) => {
          }
        );});

        this.socket.on('you_vu_conversation', (data: any) => {
          this.api.getAllconversation(body).subscribe(
            (response: any) => {
      
              this.id = response.senderId
              this.filteredProblems = response.conversations;
              this.users = response.conversations;
      
               if (this.selectedUser.id == null || this.selectedUser.id == undefined || this.selectedUser.id == '') {
                
              }else {
                this.select(this.selectedUser.id)
              }
            },
            (error: any) => {
            }
          );});

          this.socket.on('new_vu_conversation', (data: any) => {
            this.api.getAllconversation(body).subscribe(
              (response: any) => {
        
                this.id = response.senderId
                this.filteredProblems = response.conversations;
                this.users = response.conversations;
        
                 if (this.selectedUser.id == null || this.selectedUser.id == undefined || this.selectedUser.id == '') {
                  
                }else {
                  this.select(this.selectedUser.id)
                }
              },
              (error: any) => {
              }
            );});

            this.socket.on('new_typing', (data: any) => {
              this.api.getAllconversation(body).subscribe(
                (response: any) => {
          
                  this.id = response.senderId
                  this.filteredProblems = response.conversations;
                  this.users = response.conversations;
          
                   if (this.selectedUser.id == null || this.selectedUser.id == undefined || this.selectedUser.id == '') {
                    
                  }else {
                    this.select(this.selectedUser.id)
                    if(!this.selectedUser.typing){
                      this.playSound('typing.mp3');

                    } 

                  }
                },
                (error: any) => {
                }
              );});



    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }
  


   tryJoinRoom(id:any) {
    this.socket.emit('joinRoom', id, (response: { success: boolean, message: string }) => {
      console.log(response.success);
      if (response.success !== true) {
        // If not successful, retry after a short delay
        setTimeout(() => this.tryJoinRoom(id), 1000); // Retry after 1 second
      } else {
        console.log('Successfully joined the room');
      }
    });
  }


  playSound(sound:any): void {
    const audio = new Audio( sound ); // Adjust the path if necessary
    audio.play() ;
  }





 
  getselectedUserFromCookies(): string | null {
    if (typeof document !== 'undefined') {
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');

         
        for (let cookie of cookies) {
            const [name, value] = cookie.split('=').map(c => c.trim());
            if (name === 'selectedUser') {
                return value;  
            }
        }
    }
    return null;  
  }

  searchTerm: string = '';
  showIcon: boolean = false;

  newMessage: string = '';
  mediaRecorder?: MediaRecorder;  
  audioChunks: Blob[] = [];

  onAttachClick() {
    (document.getElementById('file-input') as HTMLElement).click();
  }


  removeImage(){
    this.formData = new FormData();
    this.Mypath=""
  }

  async onFileSelected (event: any) {

    this.formData = new FormData();
    const file: File = event.target.files[0];

    if (file) {
      this.formData.append('files', file);

      this.api.upload(this.formData).subscribe((res: any) => {
        if (res.path) {
          this.Mypath= res.path
        }
      });
    }
  
}

  onRecordClick() {
    const recordBtn = document.querySelector('.record-btn') as HTMLElement;

    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      recordBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.start();
          recordBtn.innerHTML = '<i class="fas fa-stop"></i>';

          this.mediaRecorder.ondataavailable = event => {
            this.audioChunks.push(event.data);
          };

          this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/mpeg' });
            this.audioChunks = [];
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log("Audio recorded:", audioUrl);
           };
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
        });
    }
  }

  sendMessage() {


    if( this.Mypath!="" ){
      let body = { token: this.token, message: null, messageType: "media", mediaUrl: this.Mypath, userId: this.selectedUser.id }

      this.api.sendMsg(body).subscribe(
        (response: any) => {
                this.formData = new FormData();
                this.Mypath=""
        },
        (error: any) => {
          
        }
      );
    }else{
    let body = { token: this.token, message: this.newMessage, messageType: "text", mediaUrl: null, userId: this.selectedUser.id }

    this.api.sendMsg(body).subscribe(
      (response: any) => {
          this.newMessage = '';
          this.select(this.selectedUser.id)
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
    

}


  
  typing() {
    const isTyping = this.newMessage.length > 0; 

    const body = { 
        token: this.token, 
        isTyping, 
        userId: this.selectedUser.id 
    };

    this.api.typing(body).subscribe(
        response => {
            console.log("Typing response:", response);
        },
        error => {
            console.error("Typing error:", error); 
        }
    );
}
  onInputChange() {
    if (this.searchTerm.length > 0) {
      this.showIcon = true;

      this.filteredProblems = this.users.filter(user => 
        user.user.name && user.user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      
    } else {
      this.filteredProblems = this.users
      this.showIcon = false;
    }
  }

  hideIcon() {
    this.searchTerm = '';
    this.showIcon = false;
    this.filteredProblems = this.users

  }

  onEnterPressed() {
    const body = { numphone: this.searchTerm, token: this.token , numMsg:this.numMsg };

    this.api.getConversation(body).subscribe(
      (response: any) => {

        this.select(response.user.id)
        console.log("rr",response.user.id)
 
        this.searchTerm = '';
        this.showIcon = false;
        this.filteredProblems = this.users
        this.messages = null


      },
      (error: any) => {
      }
    );
  }



  select(id:any) {
 
    const body = { token: this.token, userId : id , numMsg:this.numMsg};

    this.api.getConversation(body).subscribe(
      (response: any) => {
 
        this.selectedUser = response.user;
        this.messages = response.messages;
 
         this.hasMoreMessages = response.hasMoreMessages;
        document.cookie = `selectedUser=${response.user.id}; path=/;`;

      },
      (error: any) => {
      }
    );
    
  }

 MoreMessages( ) {
    this.numMsg = this.numMsg+10
    const body = { token: this.token, userId : this.selectedUser.id , numMsg:this.numMsg};

    this.api.getConversation(body).subscribe(
      (response: any) => {
        console.log(response)
       // this.selectedUser = response.user;
        this.messages = response.messages;
        this.hasMoreMessages = response.hasMoreMessages;
        //document.cookie = `selectedUser=${response.user.id}; path=/;`;

      },
      (error: any) => {
      }
    );
  }



   truncateMessage(message: string, maxLength: number = 45): string {
      if (!message) return ''; // Handle cases where the message is empty
      return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  }



  async showimg(img:string ){

   
  Swal.fire({
    imageUrl:  img,
    showCancelButton: false,
    showConfirmButton: false,
    showCloseButton: true,
    color:" #800080",
    backdrop: `     rgba()  `
  })
 }


 copyToClipboard(content: string) {
  const textarea = document.createElement('textarea');
  textarea.value = content;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
   this.toastr.success('Message copied to clipboard!');

}












// Message input
 
// Show or hide the emoji picker
toggleEmojiPicker() {
  this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
}

// Select an emoji category
selectCategory(category: string) {
  this.selectedCategory = category;
}

// Add emoji to the message
addEmoji(emoji: string) {
  this.newMessage += emoji;
  this.isEmojiPickerVisible = false; // Close the picker after selecting
}





changeLanguage(id:any): void {
   const selectElement = document.getElementById('language') as HTMLSelectElement;

    if(selectElement.value != "Original"){

          for (let i = 0; i < this.messages.length; i++) {
        
            if( this.messages[i].messageType ==  "text"){
      
      
              this.api.transmsg(this.messages[i].message,  selectElement.value).subscribe(
                (response: any) => {
                  this.messages[i].message= response.translatedText     }
              );
            }
          }
  
    }else{
 
 this.select(id)

    }
 


 


}


 



  ConvView() {
      this.isSidebarVisible = true;
  }
  ActivView() {
    this.isSidebarVisible = false;
}
}
