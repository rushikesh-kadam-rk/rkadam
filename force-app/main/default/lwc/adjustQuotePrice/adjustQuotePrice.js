/*
 * Provus Services Quoting
 * Copyright (c) 2023 Provus Inc. All rights reserved.
 */

import { LightningElement } from "lwc";
import SAVE from '@salesforce/label/c.Save_Button';
import CANCEL from '@salesforce/label/c.Cancel_Button';
import ADJUST_QUOTE_PRICE from '@salesforce/label/c.Adjust_Quote_Price';
import ADJUSTED_AMOUNT from '@salesforce/label/c.Adjusted_Amount';
import MISMATCH_ERROR from '@salesforce/label/c.Mismatch_Error';

export default class AdjustQuotePrice extends LightningElement {
  adjustedAmount;

  labels = {
    SAVE,
    CANCEL,
    ADJUST_QUOTE_PRICE,
    ADJUSTED_AMOUNT,
    MISMATCH_ERROR
  }

  /**Disables Save Button by checking validity of Amount Entered by User */
  get isSaveDisabled(){
    let amountInput = this.template.querySelector(".amountInput");
    if(amountInput && amountInput.validity.valid && this.adjustedAmount){
      return false;
    }else{
      return true;
    }
  }

  /**Fires the event to Close the Modal */
  closeModal(){
    this.modalCustomEvent('close', false)
  }

  /**Updating Adjusted Amount Entered by User */
  handleAmountChange(event){
    this.adjustedAmount = event.target.value;
  }

  /**Fires the event to update Adjusted Amount Entered by User in Database*/
  handleAdjustedAmount(){
    this.modalCustomEvent('amountchange', this.adjustedAmount)
  }

  /**Common Method to fire Custom Event */
  modalCustomEvent(eventName, eventData){
    const modalEvent = new CustomEvent(eventName, {
      detail : eventData
    });
    this.dispatchEvent(modalEvent);
  }
}
