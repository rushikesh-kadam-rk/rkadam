/*
* Provus Services Quoting
 * Copyright (c) 2023 Provus Inc. All rights reserved.
 */

import { LightningElement, api } from "lwc";
import ACCESS_ERROR from '@salesforce/label/c.Access_Error';

export default class EditQuotePage extends LightningElement {
  @api recordId;
  isAdjustButtonClicked = false;
  isAccessAllowed = true;

  labels = {
    ACCESS_ERROR
  }

  /**Show Adjust Quote Price Dialog */
  handleAdjustQuote(){
    this.isAdjustButtonClicked = true;
  }

  /**Hide Adjust Quote Price Dialog */
  handleCloseModal(){
    this.isAdjustButtonClicked = false;
  }

  /**Hide Component if User Access is Denied */
  handleError(){
    this.isAccessAllowed = false;
  }

  handleAmountChange(event){
    /**Update Quote Price by making Apex Call*/
    this.template.querySelector('c-edit-quote')?.updateQuoteAmount(event.detail);
    this.handleCloseModal();
  }
}
