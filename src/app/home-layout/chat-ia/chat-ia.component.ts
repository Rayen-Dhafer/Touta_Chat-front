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
  selector: 'app-chat-ia',
  templateUrl: './chat-ia.component.html',
  styleUrl: './chat-ia.component.css'
})
export class ChatIAComponent implements OnInit {

  constructor(private router: Router, private api: ApiService, private toastr: ToastrService, private socket: Socket    ) { } 

  isSidebarVisible: boolean = true;
  token= localStorage.getItem("token")
  messages: any; 
  chats: any;  
  selectedUser: any;
  selectedMessage: any = null;  
   formData : FormData = new FormData()
  id:any
  url:any
  Mypath=""
  numMsg=20
  hasMoreMessages:any
 
  newname =""

  dropdownVisible: string | null = null;

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



    
    let  id_contac= "";
    this.url= this.api.url
 

    this.api.getAllChat({ token: this.token }).subscribe(
      (response: any) => {

         this.chats = response.data;
         if(response.data){
          this.selectedUser=response.data[0]
         }
         
      },
      (error: any) => {
      }
    );

    

  }
  





  playSound(sound:any): void {
    const audio = new Audio( sound ); // Adjust the path if necessary
    audio.play() ;
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

  

  sendMessage() {

    let body = { content: this.newMessage,  sender:"user" ,id: this.selectedUser._id   }

    this.api.addmsgIA(body).subscribe(
      (response: any) => {
        this.selectedUser.messages.push({ sender: 'user', content: this.newMessage });
        this.isLoadingIA = true;
        this.newMessage = '';

        this.api.sendMessageIA(this.selectedUser.messages).subscribe(
          (response: any) => {
            const botReply = response.choices[0].message.content
            this.selectedUser.messages.push({ sender: 'assistant', content: botReply });
            this.isLoadingIA = false;

            this.api.addmsgIA({ content: botReply,  sender:"assistant" ,id: this.selectedUser._id   }).subscribe(  (response: any) => {  })

            console.log(response)
           },
           (error: any) => {
            console.log(response)
           });

      });








  }
    




  
 


 


  select(id:any) {
   

    const body = { id : id };

    this.api.getChatById(body).subscribe(
      (response: any) => {
 
        console.log(response.data)
        this.selectedUser = response.data;
 
      },
      (error: any) => {
      }
    );
   
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






async editChat(name: string, id: any) {
  await Swal.fire({
    html: `
      <style></style>
      <input id="swal-input1" class="swal2-input" rows="10" cols="31" value="${name}">
    `,
    focusConfirm: false,
    showCloseButton: true,
    confirmButtonColor: "#800080c5",
    confirmButtonText: "Save",
    showCancelButton: false, 
    preConfirm: () => {
      this.newname = (<HTMLInputElement>document.getElementById('swal-input1')).value;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      if (this.newname && this.newname !== name) {
        this.api.editChat({ chatId: id, chatname: this.newname }).subscribe(
          (response: any) => {
            this.toastr.success(response.message);
            this.api.getAllChat({ token: this.token }).subscribe(
              (response: any) => {
                this.chats = response.data;
              }
            );
          },
          (error: any) => {
            this.toastr.error('Failed to update chat name.');
          }
        );
      } else {
        this.toastr.error('Incorrect name');
      }
    }
  });
}


async confirmDelete(name: string,id: any) {
  const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${name}! This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#800080c5',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
      this.deleteChat(id);
  }
}

 
deleteChat(chatId: any) {
  this.api.deleteChat({ chatId }).subscribe(
      (response: any) => {
          this.toastr.success(response.message);  
          this.api.getAllChat({ token: this.token }).subscribe(
              (response: any) => { this.chats = response.data; }
          );
      },
      (error: any) => {
          this.toastr.error('Failed to delete chat.');
      }
  );
}










async NewChat( ){
 
  this.api.createNewChat({token:this.token}).subscribe(
    (response: any) => {
      this.toastr.success(response.message);
      this.api.getAllChat({ token: this.token }).subscribe(
        (response: any) => {
  
           this.chats = response.data;
        },
        (error: any) => {
        }
      );
    },
    (error: any) => {
    }
  );
  
}


toggleDropdown(chatId: string) {
  this.dropdownVisible = this.dropdownVisible === chatId ? null : chatId;
}

 
}
