import { LightningElement, track, wire } from 'lwc';
import getConfiguredCurrencies from '@salesforce/apex/QuoteDto.getConfiguredCurrencies';
import ENTER_AMOUNT from '@salesforce/label/c.Enter_Amount';
import SELECT_CURRENCY from '@salesforce/label/c.Select_Currency';
import CURRENCY_COMPONENT from '@salesforce/label/c.Currency_Component';

export default class CurrencyInput extends LightningElement {

    @track currencyOptions = [];
    selectedCurrencyCode;
    amount;

    labels = {
        ENTER_AMOUNT,
        SELECT_CURRENCY,
        CURRENCY_COMPONENT
    }

    /**Returns configured Currency Codes from Org */
    @wire(getConfiguredCurrencies)
    configuredCurrencies({ data, error }) {
        if (data) {
            this.currencyOptions = data.map((currencyCode)=>{
                return {label:currencyCode, value:currencyCode}
            })
        } else if (error) {
            this.contacts = undefined;
        }
    }

    handleCurrencyOptionsChange(event){
        this.selectedCurrencyCode = event.target.value;
    }

    handleAmountChange(event){
        this.amount = event.target.value;
    }
}