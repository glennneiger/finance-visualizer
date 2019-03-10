import moment from "moment";

//handles retreiving financial transactions

export default class TransactionService {

  constructor(){
    this.cache = {startDate: moment.unix(-100000), endDate:moment.unix(100000), transactionData: []};
    this.shortFormatter = new Intl.NumberFormat('en-US');
    this.longFormatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2
    });
  }

  rawGetTransactions = async (startDate,endDate)=>{
    return new Promise((resolve,reject)=>{
      fetch("api/transactions")
      .then(
        async (json) => {
          let response = await json.json();
          for (let transIndex = 0; transIndex < response.length; transIndex++) {
            response[transIndex].dateTime = moment(response[transIndex].dateTime);
          }
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      )
    });
  }
  getTransactionsByDateRange = async (startDate,endDate) =>{
    if( (!startDate || !endDate) || (startDate.isSame(this.cache.startDate) && endDate.isSame(this.cache.endDate))){
      return this.cache.transactionData;
    } else{
      let transactions = await this.rawGetTransactions(startDate,endDate);
      let response = {transactions:transactions,currencySymbol:"$"};
      this.cache = {startDate:startDate, endDate:endDate, transactionData:response};
      await new Promise((resolve)=>{setTimeout(()=>resolve(response), 1000);}); //just here to visualize loading time.
      return response;
    }
  }
  
  getTransactionSummaryByDateRange = async (startDate,endDate)=> {
    //get the data
    let transactionData = await this.getTransactionsByDateRange(startDate,endDate).catch(
      (error)=>{
      throw("Failed to load transactions");
    });
    let transactions = transactionData.transactions;
    let currencySymbol = transactionData.currencySymbol;

    //arrange the data
    let summaryData = [];
    let total = 0;
    let maxDay = startDate;
    let minDay = endDate;
    try{
      transactions.forEach((entry)=>{
        if(!(entry.category in summaryData)){
          summaryData[entry.category] = {title:entry.category, value:0};
        }
        summaryData[entry.category] = {
          title:entry.category,
          value:(summaryData[entry.category].value + entry.amount),
        };
        total+=entry.amount;
        maxDay = entry.dateTime.isAfter(maxDay) ? entry.dateTime : maxDay;
        minDay = entry.dateTime.isBefore(minDay) ? entry.dateTime : minDay;
        
      });

      let categories = []; 
      for (var key in summaryData){
        let percentage = (summaryData[key].value+0.0)/total;
        summaryData[key].percentage = (Math.round(percentage*1000)/10) + "%";
        categories.push(summaryData[key]);
      }

      let response = {};
      let monthlyTotal = (total/maxDay.diff(minDay,"days")) *365/12;
      let yearlyTotal = monthlyTotal*12;

      response.categories = categories;
      response.formattedTotal = (isFinite(total)) ? this.longFormatter.format(total.toFixed(2)) : "---";
      response.formattedMonthlyTotal = (isFinite(monthlyTotal)) ? this.shortFormatter.format(monthlyTotal.toFixed(0)) : "---";
      response.formattedYearlyTotal = (isFinite(yearlyTotal)) ? this.shortFormatter.format(yearlyTotal.toFixed(0)) : "---";
      response.currencySymbol = currencySymbol;
      return response; //{categories:             [{title,value,percentage}],
                       // formattedMonthlyTotal:  6,144
                       // formattedTotal:         1,407.00
                       // formattedYearlyTotal:   73,365 }
    } catch(error){
      console.debug("Failed to categorize transactions");
      console.log(error);
      throw("Failed to categorize transactions");
    }
  }

  getTransactionDetailsForCategory = async (category)=> {
    let response = [];
    let transactions = this.cache.transactionData.transactions;
    if(transactions.length > 0){
      transactions.forEach((entry)=>{
        if(entry.category == category){
          response.push({
            date:entry.dateTime,
            displayDate:entry.dateTime.format("MM/DD/YYYY"),
            value:entry.amount,
            displayValue: this.cache.transactionData.currencySymbol + this.longFormatter.format(entry.amount.toFixed(2)),
            subCategory:entry.subCategory,
            description:entry.description
          });
        }
      });
    }
    return {currencySymbol: this.cache.transactionData.currencySymbol, transactions: response};
  }
}