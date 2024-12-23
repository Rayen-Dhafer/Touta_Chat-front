import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }
  url ="http://localhost:3000/";

  createUser(body :any){  return this.http.post(`${this.url}api/createUser` , body)   }
  verificationUser(body :any){  return this.http.post(`${this.url}api/verificationUser` , body)   }
  login(body :any){  return this.http.post(`${this.url}api/login` , body)   }
  getUser(body :any){  return this.http.post(`${this.url}api/getUser` , body)   }
  getId(body :any){  return this.http.post(`${this.url}api/getId` , body)   }
  sendLinkReset(body :any){  return this.http.post(`${this.url}api/sendLinkReset` , body)   }
  SendRestCode(body :any){  return this.http.post(`${this.url}api/SendRestCode` , body)   }

  updateEmail(body :any){  return this.http.post(`${this.url}api/updateEmail` , body)   }
  updateUser(body :any){  return this.http.post(`${this.url}api/updateUser` , body)   }
  updatePwd(body :any){  return this.http.post(`${this.url}api/updatePwd` , body)   }
  upload(body : any){
    return this.http.post(`${this.url}upload` ,body)
  }


  getConversation(body :any){  return this.http.post(`${this.url}api/getConversation` , body)   }
  sendMsg(body :any){  return this.http.post(`${this.url}api/sendMsg` , body)   }
  sendImg(body :any){  return this.http.post(`${this.url}api/sendImg` , body)   }
  getAllconversation(body :any){  return this.http.post(`${this.url}api/getAllconversation` , body)   }
  typing(body :any){  return this.http.post(`${this.url}api/typing` , body)   }





  private apiUrl = 'https://meta-llama-2-ai.p.rapidapi.com/'; // Replace with actual endpoint URL
  private apiUrlTrans = 'https://openl-translate.p.rapidapi.com/translate'; // URL for the translation API


 

  sendMessageIA(messages: any): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'meta-llama-2-ai.p.rapidapi.com',
      'X-RapidAPI-Key': '200a855f73mshed391d682487fd9p1ae033jsn82cfa5956ee3'
    });

    const body = {
      messages:  messages
    }

    return this.http.post(this.apiUrl, body, { headers });
  }



 


  transmsg(msg: string, tar:any):  any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-rapidapi-host': 'openl-translate.p.rapidapi.com',
      'x-rapidapi-key': '200a855f73mshed391d682487fd9p1ae033jsn82cfa5956ee3' 

    });


 
    const body = {
      target_lang: tar,
      text: msg
         }

         return this.http.post(this.apiUrlTrans, body, { headers });
     
  }


  createNewChat(body :any){  return this.http.post(`${this.url}api/createNewChat` , body)   }
  getAllChat(body :any){  return this.http.post(`${this.url}api/getAllChat` , body)   }
  getChatById(body :any){  return this.http.post(`${this.url}api/getChatById` , body)   }
  addmsgIA(body :any){  return this.http.post(`${this.url}api/addmsgIA` , body)   }
  editChat(body :any){  return this.http.post(`${this.url}api/editChat` , body)   }
  deleteChat(body :any){  return this.http.post(`${this.url}api/deleteChat` , body)   }

}
