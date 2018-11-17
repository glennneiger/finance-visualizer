import moment from "moment";

//handles retreiving financial transactions

export default class TransactionService {

  constructor(){
    this.cache = [{startDate: null, endDate:null, transactions: []}];
    this.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })

  }

  getTransactionsByDateRange = async (startDate,endDate) =>{
    return new Promise((resolve,reject) =>{
      if(this.cache.startDate === startDate && this.cache.endDate === endDate){
        resolve(this.cache.transactions);
      } else{
        let response = [
          { dateTime:moment().subtract(1,"day"), amount:25, category:"Car", subCategory: "Gas", description: "Quick Trip" },
          { dateTime:moment(), amount:300, category:"Car", subCategory: "Car Payment", description: "Bank of America" },
          { dateTime:moment(), amount:600, category:"Rent", subCategory: "Rent", description: "Sunny Hills Apartments" },
          { dateTime:moment(), amount:10, category:"Food/Wine/Fun/Other", subCategory: "Dining", description: "McDonalds" },
          { dateTime:moment(), amount:57, category:"Food/Wine/Fun/Other", subCategory: "Groceries", description: "Target" },
        ];
        this.cache = {startDate:startDate, endDate:endDate, transactions:response};
        setTimeout(()=>resolve(response), 2300);
        // resolve(response);
      }
    });
  }
  
  getTransactionSummaryByDateRange = async (startDate,endDate)=> {
    //get the data
    let transactions = await this.getTransactionsByDateRange(startDate,endDate).catch(
      (error)=>{
        throw("Failed to load transactions");
      });
    //arrange the data
    let sumByCategory = [];
    let total = 0;
    let maxDay = startDate;
    let minDay = endDate;
    try{
      transactions.forEach((entry)=>{
        if(!(entry.category in sumByCategory)){
          sumByCategory[entry.category] = {title:entry.category, value:0};
        }
        sumByCategory[entry.category] = {
          title:entry.category,
          value:(sumByCategory[entry.category].value + entry.amount),
        };
        total+=entry.amount;
        maxDay = entry.dateTime.isAfter(maxDay) ? entry.dateTime : maxDay;
        minDay = entry.dateTime.isBefore(minDay) ? entry.dateTime : minDay;
        
      });

      let response = [];
      for (var key in sumByCategory){
        let percentage = (sumByCategory[key].value+0.0)/total;
        sumByCategory[key].percentage = (Math.round(percentage*1000)/10) + "%";
        response.push(sumByCategory[key]);
      }

      let monthlyTotal = (total/maxDay.diff(minDay,"days")) *365/12;
      let yearlyTotal = monthlyTotal*12;

      response.formattedTotal = (isFinite(total)) ? this.formatter.format(total.toFixed(2)) : "---";
      response.formattedMonthlyTotal = (isFinite(monthlyTotal)) ? this.formatter.format(monthlyTotal.toFixed(2)) : "---";
      response.formattedYearlyTotal = (isFinite(yearlyTotal)) ? this.formatter.format(yearlyTotal.toFixed(2)) : "---";
      return response;
    } catch(error){
      console.log("Failed to categorize transactions",error);
      throw("Failed to categorize transactions");
    }
  }

  getTransactionDetailsByDateRange = (startDate,endDate)=> {
    //TODO
  }
}