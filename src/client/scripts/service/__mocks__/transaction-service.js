import moment from "moment";

//handles retreiving financial transactions

export default class TransactionService {
 
  constructor(){
    this.mocks = {
      getTransactionSummaryByDateRange:jest.fn(()=>({
        categories:[],
        formattedTotal:"",
        formattedMonthlyTotal:"",
        formattedYearlyTotal:"",
        currencySymbol:""
      }))
    };
  }

  getTransactionSummaryByDateRange = async (startDate,endDate) =>{
    return this.mocks.getTransactionSummaryByDateRange(startDate,endDate);
  }

  getTransactionDetailsByDateRange = (startDate,endDate)=> {
    //TODO
  }
}