/*
 * Provus Services Quoting
 * Copyright (c) 2023 Provus Inc. All rights reserved.
 */

import { LightningElement, api, track } from "lwc";
import getQuoteDetails from '@salesforce/apex/QuoteDto.getQuoteDetails';
import saveQuoteDetails from '@salesforce/apex/QuoteDto.saveQuoteDetails';
import QUOTE_GREETING from '@salesforce/label/c.Quote_Greeting'
import SAVE from '@salesforce/label/c.Save_Button';
import START_DATE from '@salesforce/label/c.Start_Date';
import END_DATE from '@salesforce/label/c.End_Date';
import SUCCESS from '@salesforce/label/c.Success';
import ERROR from '@salesforce/label/c.Error';
import SUCCESS_MESSAGE from '@salesforce/label/c.Success_Message';
import ERROR_MESSAGE from '@salesforce/label/c.Error_Message';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class EditQuote extends LightningElement {
  @api recordId;
  @track quoteData;

  labels = {
    QUOTE_GREETING,
    SAVE,
    START_DATE,
    END_DATE,
    SUCCESS,
    ERROR,
    SUCCESS_MESSAGE,
    ERROR_MESSAGE
  }

  isInitialized = false;

  quoteStartDate;
  quoteEndDate;

  renderedCallback() {}

  connectedCallback(){
    if(this.recordId){
      this.initiazeData();
    }
  }

  /**Retuns Greeting of with Quote Name*/
  get quoteName(){
    return this.labels.QUOTE_GREETING.replace('##QUOTENAME', this.quoteData.quoteName);
  }

  /**Disables Save Button by checking if there is any change in start date or end date */
  get saveButtonDisabled(){
    const inputFieldsValidity = [
      ...this.template.querySelectorAll('lightning-input'),
      ].reduce((validSoFar, inputField) => {
        inputField.reportValidity();
          return validSoFar && inputField.checkValidity();
      }, true);
    if(!inputFieldsValidity || (this.quoteStartDate == this.quoteData.startDate && this.quoteEndDate == this.quoteData.endDate)){
      return true;
    }else{
      return false;
    }
  }

  /**Gets Quote Details*/
  initiazeData(){
    getQuoteDetails({quoteId: this.recordId}).then(response=>{
      if(response){
        this.quoteData = response;
        this.quoteStartDate = this.quoteData.startDate;
        this.quoteEndDate = this.quoteData.endDate;
      }
      this.isInitialized = true;
    }).catch(error=>{
      console.error(error);
      this.dispatchEvent(new CustomEvent('error'));
      this.showToastMessage(this.labels.ERROR, error.body.message, 'error');
      this.isInitialized = true;
    })
  }

  /**Updates Quote Start and End Date*/
  handleDateChange(event){
    let fieldValue = event.target.dataset.field;
    if(fieldValue == 'startdate'){
      this.quoteData.startDate = event.target.value;
    }else if(fieldValue == 'enddate'){
      this.quoteData.endDate = event.target.value;
    }
  }

  /**This method will be called by Parent to update Quote Amount in Database */
  @api
  updateQuoteAmount(quoteAmount){
    this.quoteData.quoteAmount = quoteAmount;
    this.handleQuoteSave();
  }

  /**Updates Quote Start and End Date in Database */
  handleQuoteSave(){
    saveQuoteDetails({wrapper: JSON.stringify(this.quoteData)}).then(response=>{
      if(response){
        this.showToastMessage(this.labels.SUCCESS, this.labels.SUCCESS_MESSAGE, 'success')
        this.quoteStartDate = this.quoteData.startDate;
        this.quoteEndDate = this.quoteData.endDate;
      }else{
        this.showToastMessage(this.labels.ERROR, this.labels.ERROR_MESSAGE, 'error');
      }
      this.isInitialized = true;
    }).catch(error=>{
      console.error(error);
      this.showToastMessage(this.labels.ERROR, error.getMessage(), 'error');
    })
  }

  /**Common method to show Toast Message */
  showToastMessage(titleText, messageText, variantType){
    this.dispatchEvent(
      new ShowToastEvent({
        title: titleText,
        message: messageText,
        variant: variantType
      })
    )
  }
}
