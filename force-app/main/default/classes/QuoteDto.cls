public with sharing class QuoteDto extends BaseDto {
  public Date endDate;

  public QuoteDto() {
  }

  public QuoteDto(Quote__c quote) {
    super(quote);
    this.endDate = quote.EndDate__c;
  }

  /**This method will return Quote Details oof respective QuoteId */
  @AuraEnabled
  public static QuoteWrapper getQuoteDetails(Id quoteId){
    QuoteWrapper quoteWrapperData = new QuoteWrapper();
    try{
      List<Quote__c> quoteList = [SELECT Id, Name, Start_Date__c, EndDate__c, TotalQuotedAmount__c FROM Quote__c WHERE Id =: quoteId WITH SECURITY_ENFORCED];

      if(quoteList != NULL && !quoteList.isEmpty()){
        quoteWrapperData.quoteId = quoteList[0].Id;
        quoteWrapperData.quoteName = quoteList[0].Name;
        quoteWrapperData.startDate = quoteList[0].Start_Date__c;
        quoteWrapperData.endDate = quoteList[0].EndDate__c;
        quoteWrapperData.quoteAmount = quoteList[0].TotalQuotedAmount__c;
      }
    } catch(Exception exp) {
        throw exp;
    }
    return quoteWrapperData;
  }

  /**This method will update Quote Details Entered by User */
  @AuraEnabled
  public static Boolean saveQuoteDetails(String wrapper){
    try{
      QuoteWrapper quoteWrapperData = (QuoteWrapper)JSON.deserialize(wrapper, QuoteWrapper.class);

      Quote__c quoteToUpdate = new Quote__c(Id = quoteWrapperData.quoteId);
      quoteToUpdate.Start_Date__c = quoteWrapperData.startDate;
      quoteToUpdate.EndDate__c = quoteWrapperData.endDate;
      quoteToUpdate.TotalQuotedAmount__c = quoteWrapperData.quoteAmount;
      update quoteToUpdate;
      return true;
    }catch(Exception e){
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<String> getConfiguredCurrencies(){
    try {
      List<CurrencyType> currencyTypeList = [SELECT Id, IsoCode FROM CurrencyType];
      List<String> currecyCodesList = new List<String>();
      if(currencyTypeList != NULL && !currencyTypeList.isEmpty()){
        for(CurrencyType currType : currencyTypeList ){
          currecyCodesList.add(currType.IsoCode);
        }
      }
      return currecyCodesList;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  /**Wrapper Class to store Quote Details */
  public class QuoteWrapper{
    @AuraEnabled
    public Id quoteId;
    @AuraEnabled
    public String quoteName;
    @AuraEnabled
    public Date startDate;
    @AuraEnabled
    public Date endDate;
    @AuraEnabled
    public Decimal quoteAmount;

    public QuoteWrapper(){

    }

  }

  public override SObject refreshSo() {
    return null;
  }
}
