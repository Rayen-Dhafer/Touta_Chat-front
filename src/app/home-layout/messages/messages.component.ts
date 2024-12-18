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

    this.messagesIA.push({ role: 'user', content: 'hi' });
    this.messagesIA.push({ role: '"assistant"', content: 'Hello! How can I assist you today?' });
    this.messagesIA.push({ role: 'user', content: 'give me code html login simple' });
    this.messagesIA.push({ role: '"assistant"', content:  `
      Sure! Here is a simple HTML login form:

<!DOCTYPE html>
<html>
<head>
	<title>Login</title>
</head>
<body>
	<form action="login.php" method="post">
		<label for="username">Username:</label>
		<input type="text" id="username" name="username"><br><br>
		<label for="password">Password:</label>
		<input type="password" id="password" name="password"><br><br>
		<input type="submit" value="Login">
	</form>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
	<title>Login</title>
	<style>
		body {
			background-color: #f2f2f2;
		}
		.login-form {
			width: 300px;
			margin: 50px auto;
			padding: 20px;
			background-color: #fff;
			border: 1px solid #ddd;
			border-radius: 10px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		}
		.login-form label {
			display: block;
			margin-bottom: 10px;
		}
		.login-form input[type="text"], .login-form input[type="password"] {
			width: 100%;
			height: 40px;
			margin-bottom: 20px;
			padding: 10px;
			border: 1px solid #ccc;
			border-radius: 5px;
		}
		.login-form input[type="submit"] {
			width: 100%;
			height: 40px;
			background-color: #4CAF50;
			color: #fff;
			padding: 10px;
			border: none;
			border-radius: 5px;
			cursor: pointer;
		}
		.login-form input[type="submit"]:hover {
			background-color: #3e8e41;
		}
	</style>
</head>
<body>
	<div class="login-form">
		<form action="login.php" method="post">
			<label for="username">Username:</label>
			<input type="text" id="username" name="username"><br><br>
			<label for="password">Password:</label>
			<input type="password" id="password" name="password"><br><br>
			<input type="submit" value="Login">
		</form>
	</div>
</body>
</html>

      
      
      `});

    
    let  id_contac= this.getselectedUserFromCookies();
    this.url= this.api.url
    const body = { token: this.token };

    this.api.getAllconversation(body).subscribe(
      (response: any) => {

        this.id = response.senderId
        this.filteredProblems = response.conversations;
        this.users = response.conversations;


       
        if (id_contac == null || id_contac == undefined || id_contac == '') {
          
        }else {
          this.select(this.selectedUser.id)
        }
      },
      (error: any) => {
      }
    );

    

    this.socket.on('connect', () => {
      this.socket.emit('joinRoom', this.id, (response: JoinRoomResponse) => {
 
      });
    });


    
    this.socket.on('you_send_new_message', (data: any) => {
      this.api.getAllconversation(body).subscribe(
        (response: any) => {
  
          this.id = response.senderId
          this.filteredProblems = response.conversations;
          this.users = response.conversations;
  
           if (id_contac == null || id_contac == undefined || id_contac == '') {
            
          }else {
            this.select(this.selectedUser.id)
            this.playSound('send_msg.mp3');
  

          }
        },
        (error: any) => {
        }
      );});


      
      this.socket.on('new_user_active', (data: any) => {
        this.api.getAllconversation(body).subscribe(
          (response: any) => {
    
            this.filteredProblems = response.conversations;
            this.users = response.conversations;
            if(id_contac == data.id ){
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
    
             if (id_contac == null || id_contac == undefined || id_contac == '') {
              
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
      
               if (id_contac == null || id_contac == undefined || id_contac == '') {
                
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
        
                 if (id_contac == null || id_contac == undefined || id_contac == '') {
                  
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
          
                   if (id_contac == null || id_contac == undefined || id_contac == '') {
                    
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

 if(this.selectedUser.id!= 'ToutBot'){
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
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
    }else{
    
      this.messagesIA.push({ role: 'user', content: this.newMessage });
      this.isLoadingIA = true;
      this.newMessage = '';
      this.api.sendMessageIA(this.messagesIA).subscribe(
        (response: any) => {
          const botReply = response.choices[0].message.content
          this.messagesIA.push({ role: 'assistant', content: botReply });
          this.isLoadingIA = false;
            
            console.log(this.messagesIA)
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
        console.log("rr",response)
        this.selectedUser = response.user;
        this.messages = response.messages;
        this.hasMoreMessages = response.hasMoreMessages;

        this.searchTerm = '';
        this.showIcon = false;
        this.filteredProblems = this.users
        document.cookie = `selectedUser=${response.user.id}; path=/;`;

      },
      (error: any) => {
      }
    );
  }



  select(id:any) {
    if(id!="ToutBot"){

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
    }else{
      const user= {
        id: "ToutBot",
        name: "ToutBot",
        phone: null,
        countryCode: null,
        photoProfile: "Tchatter.jpg",
        typing: false  
      }
      document.cookie = `selectedUser=${id}; path=/;`;
      this.messages = null;

      this.selectedUser = user;
    }
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













  ConvView() {
      this.isSidebarVisible = true;
  }
  ActivView() {
    this.isSidebarVisible = false;
}
}
