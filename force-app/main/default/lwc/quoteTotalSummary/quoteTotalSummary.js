/*
 * Provus Services Quoting
 * Copyright (c) 2023 Provus Inc. All rights reserved.
 */

import { LightningElement } from "lwc";
import ADJUST_QUOTE from '@salesforce/label/c.Adjust_Quote';
import QUOTE_ADJUSTED_AMOUNT from '@salesforce/label/c.Quote_Adjusted_Amount';

export default class QuoteTotalSummary extends LightningElement {
    
    labels = {
        ADJUST_QUOTE,
        QUOTE_ADJUSTED_AMOUNT
    }
    /**OPEN MODAL IN PARENT COMPONENT ONCE USER CLICKS ON ADJUST QUOTE BUTTON */
    handleAdjustQuote(){
        const adjustQuoteEvent = new CustomEvent('adjustquote');
        this.dispatchEvent(adjustQuoteEvent);
    }
}
