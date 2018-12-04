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
    return [
      { dateTime:moment().subtract(7,"day"), amount:25, category:"Car", subCategory: "Gas", description: "Quick Trip" },
      { dateTime:moment(), amount:300, category:"Car", subCategory: "Car Payment", description: "Bank of America" },
      { dateTime:moment(), amount:1200, category:"Rent", subCategory: "Rent", description: "Sunny Hills Apartments" },
      { dateTime:moment(), amount:10, category:"Food", subCategory: "Dining", description: "McDonalds" },
      { dateTime:moment(), amount:57, category:"Food", subCategory: "Groceries", description: "Target" },
      { dateTime:moment(), amount:50, category:"Utilities", subCategory: "Water", description: "Water Payment" },
      { dateTime:moment(), amount:120, category:"Utilities", subCategory: "Electricity", description: "OGPL" },
      { dateTime:moment(), amount:245, category:"Church", subCategory: "Church of the Water Lake", description: "Debit payment water lake" }
    ];
  }
  getTransactionsByDateRange = async (startDate,endDate) =>{
    if( (!startDate || !endDate) || (startDate.isSame(this.cache.startDate) && endDate.isSame(this.cache.endDate))){
      return this.cache.transactionData;
    } else{
      let transactions = await this.rawGetTransactions(startDate,endDate);
      let response = {transactions:transactions,currencySymbol:"$"};
      this.cache = {startDate:startDate, endDate:endDate, transactionData:response};
      //setTimeout(()=>resolve(response), 2300); //just here to visualize loading time.
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
      console.debug("Failed to categorize transactions",error);
      throw("Failed to categorize transactions");
    }
  }

  getTransactionDetailsByDateRange = (startDate,endDate)=> {
    //TODO
  }
}