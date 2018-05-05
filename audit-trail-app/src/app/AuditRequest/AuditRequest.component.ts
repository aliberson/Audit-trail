/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuditRequestService } from './AuditRequest.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-AuditRequest',
	templateUrl: './AuditRequest.component.html',
	styleUrls: ['./AuditRequest.component.css'],
  providers: [AuditRequestService]
})
export class AuditRequestComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          audit_id = new FormControl("", Validators.required);
        
  
      
          timestamp = new FormControl("", Validators.required);
        
  
      
          request_state = new FormControl("", Validators.required);
        
  
      
          sender = new FormControl("", Validators.required);
        
  
      
          auditor = new FormControl("", Validators.required);
        
  
      
          log_to_review = new FormControl("", Validators.required);
        
  


  constructor(private serviceAuditRequest:AuditRequestService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          audit_id:this.audit_id,
        
    
        
          timestamp:this.timestamp,
        
    
        
          request_state:this.request_state,
        
    
        
          sender:this.sender,
        
    
        
          auditor:this.auditor,
        
    
        
          log_to_review:this.log_to_review
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceAuditRequest.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: "be.vlaanderen.audittrail.AuditRequest",
      
        
          "audit_id":this.audit_id.value,
        
      
        
          "timestamp":this.timestamp.value,
        
      
        
          "request_state":this.request_state.value,
        
      
        
          "sender":this.sender.value,
        
      
        
          "auditor":this.auditor.value,
        
      
        
          "log_to_review":this.log_to_review.value
        
      
    };

    this.myForm.setValue({
      
        
          "audit_id":null,
        
      
        
          "timestamp":null,
        
      
        
          "request_state":null,
        
      
        
          "sender":null,
        
      
        
          "auditor":null,
        
      
        
          "log_to_review":null
        
      
    });

    return this.serviceAuditRequest.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "audit_id":null,
        
      
        
          "timestamp":null,
        
      
        
          "request_state":null,
        
      
        
          "sender":null,
        
      
        
          "auditor":null,
        
      
        
          "log_to_review":null 
        
      
      });
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "be.vlaanderen.audittrail.AuditRequest",
      
        
          
        
    
        
          
            "timestamp":this.timestamp.value,
          
        
    
        
          
            "request_state":this.request_state.value,
          
        
    
        
          
            "sender":this.sender.value,
          
        
    
        
          
            "auditor":this.auditor.value,
          
        
    
        
          
            "log_to_review":this.log_to_review.value
          
        
    
    };

    return this.serviceAuditRequest.updateAsset(form.get("audit_id").value,this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceAuditRequest.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.serviceAuditRequest.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "audit_id":null,
          
        
          
            "timestamp":null,
          
        
          
            "request_state":null,
          
        
          
            "sender":null,
          
        
          
            "auditor":null,
          
        
          
            "log_to_review":null 
          
        
      };



      
        if(result.audit_id){
          
            formObject.audit_id = result.audit_id;
          
        }else{
          formObject.audit_id = null;
        }
      
        if(result.timestamp){
          
            formObject.timestamp = result.timestamp;
          
        }else{
          formObject.timestamp = null;
        }
      
        if(result.request_state){
          
            formObject.request_state = result.request_state;
          
        }else{
          formObject.request_state = null;
        }
      
        if(result.sender){
          
            formObject.sender = result.sender;
          
        }else{
          formObject.sender = null;
        }
      
        if(result.auditor){
          
            formObject.auditor = result.auditor;
          
        }else{
          formObject.auditor = null;
        }
      
        if(result.log_to_review){
          
            formObject.log_to_review = result.log_to_review;
          
        }else{
          formObject.log_to_review = null;
        }
      

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  resetForm(): void{
    this.myForm.setValue({
      
        
          "audit_id":null,
        
      
        
          "timestamp":null,
        
      
        
          "request_state":null,
        
      
        
          "sender":null,
        
      
        
          "auditor":null,
        
      
        
          "log_to_review":null 
        
      
      });
  }

}