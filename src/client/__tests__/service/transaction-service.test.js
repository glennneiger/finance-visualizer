import TransactionService from "../../scripts/service/transaction-service.js";
import moment from "moment";

describe("Transaction Service",()=>{
  
  let transactionService;
  let mockTransactions;

  beforeEach(()=>{
    transactionService = new TransactionService();
    mockTransactions = [
      { dateTime:moment(), amount:25, category:"Car", subCategory: "Gas", description: "Quick Trip" },
      { dateTime:moment(), amount:300, category:"Car", subCategory: "Car Payment", description: "Bank of America" },
      { dateTime:moment(), amount:600, category:"Rent", subCategory: "Rent", description: "Sunny Hills Apartments" },
      { dateTime:moment(), amount:10, category:"Food", subCategory: "Dining", description: "McDonalds" },
      { dateTime:moment(), amount:57, category:"Food", subCategory: "Groceries", description: "Target" },
      { dateTime:moment(), amount:50, category:"Utilities", subCategory: "Water", description: "Water Payment" },
      { dateTime:moment(), amount:120, category:"Utilities", subCategory: "Electricity", description: "OGPL" },
      { dateTime:moment(), amount:245, category:"Church", subCategory: "Church of the Water Lake", description: "Tithes" }
    ];
  });

  describe("getTransactionsByDateRange",()=>{

    beforeEach(()=>{
      transactionService = new TransactionService();
      transactionService.rawGetTransactions = async ()=>{return mockTransactions;}
    });

    it("Should return an empty response if no data is retrieved",async ()=>{
      transactionService.rawGetTransactions = async ()=>[];
      let response = await transactionService.getTransactionsByDateRange(moment(),moment());
      expect(response).toEqual({
        transactions:[],
        currencySymbol:"$"
      });
    });

    it("Should return response retrieved from rawGetTransactions",async ()=>{
      let response = await transactionService.getTransactionsByDateRange(moment(),moment());
      expect(response).toEqual({
        transactions:mockTransactions,
        currencySymbol:"$"
      });
    });

    it("Should use a cached response if the search criteria is identical to the last",async ()=>{
      let startTime = moment();
      let endTime = moment();
      let secondaryMockTransactions = ["secondary mock Transactions value"];
      //initial load
      await transactionService.getTransactionsByDateRange(startTime,endTime);
      transactionService.rawGetTransactions = async ()=>secondaryMockTransactions; //if it's not using cache, now it will return secondaryMocktransactions.
      //same as previous
      let response = await transactionService.getTransactionsByDateRange(startTime.clone(),endTime.clone());
      expect(response).toEqual({
        transactions:mockTransactions,
        currencySymbol:"$"
      });
      //different end date
      response = await transactionService.getTransactionsByDateRange(startTime.clone(),endTime.clone().add(1,'day'));
      expect(response).toEqual({
        transactions:secondaryMockTransactions,
        currencySymbol:"$"
      });
      //same as previous
      transactionService.rawGetTransactions = async ()=>{return mockTransactions;}
      response = await transactionService.getTransactionsByDateRange(startTime.clone(),endTime.clone().add(1,'day'));
      expect(response).toEqual({
        transactions:secondaryMockTransactions,
        currencySymbol:"$"
      });
      //different start date
      response = await transactionService.getTransactionsByDateRange(startTime.clone().add(1,'day'),endTime.clone().add(1,'day'));
      expect(response).toEqual({
        transactions:mockTransactions,
        currencySymbol:"$"
      });
    });

  });

  describe("getTransactionSummaryByDateRange",()=>{

    beforeEach(()=>{
      transactionService = new TransactionService();
      transactionService.getTransactionsByDateRange = async ()=>{
          return {transactions:mockTransactions,currencySymbol:"$"};
        };
      
    });

    it("Should return an empty response when no data is retrieved",async ()=>{
      let startDate = moment();
      let endDate = moment();
      transactionService.getTransactionsByDateRange = jest.fn(async ()=>{
        return {transactions:[],currencySymbol:"ABCD"};
      });
      let response = await transactionService.getTransactionSummaryByDateRange(startDate,endDate);

      expect(transactionService.getTransactionsByDateRange).toHaveBeenCalledWith(startDate,endDate);
      expect(response).toEqual({
        categories:[],
        formattedMonthlyTotal: "---",
        formattedTotal: "0.00",
        formattedYearlyTotal: "---",
        currencySymbol: "ABCD"
      });
    });

    it("Should sum all transactions in a category",async ()=>{
      let response = await transactionService.getTransactionSummaryByDateRange(moment(),moment());
      let categoryToSum = [];

      response.categories.forEach((element)=>{
        categoryToSum[element.title] = {value:element.value, percentage:element.percentage};
      });

      expect(categoryToSum.Car).toEqual({value:325,percentage:"23.1%"});
      expect(categoryToSum.Rent).toEqual({value:600,percentage:"42.6%"});
      expect(categoryToSum.Food).toEqual({value:67,percentage:"4.8%"});
      expect(categoryToSum.Utilities).toEqual({value:170,percentage:"12.1%"});
      expect(categoryToSum.Church).toEqual({value:245,percentage:"17.4%"});
    });

    it("Should correctly calculate monthly and yearly totals",async ()=>{
      mockTransactions[0].dateTime = moment().add(15,'days'); //remember this will be a few milliseconds ahead of the times set in beforeEach();
      let response = await transactionService.getTransactionSummaryByDateRange(moment(),moment().add(15,'days'));
      expect(response.formattedTotal).toEqual("1,407.00");
      expect(response.formattedMonthlyTotal).toEqual("2,853");//{total}/{day range} * {days in a year} / 12 == 1,407 / 15 * 365 / 12
      expect(response.formattedYearlyTotal).toEqual("34,237"); //{total}/{day range} * {days in a year} == 1,407 / 15 * 365
    });

    it("Should throw an error when an error occurs",async ()=>{
      transactionService.getTransactionsByDateRange = jest.fn(()=>{
        throw new Error("Test Error");
      });
      let threwError = false;
      await transactionService.getTransactionSummaryByDateRange(moment().subtract(15,"d"),moment())
      .catch((error)=>{
        threwError = true;
      });
      expect(threwError).toEqual(true);
    });

    it("Should return '---' when it's not possible to calculate the monthly or yearly totals",async ()=>{
      let response = await transactionService.getTransactionSummaryByDateRange(moment(),moment());
      expect(response.formattedTotal).toEqual("1,407.00");
      expect(response.formattedMonthlyTotal).toEqual("---");
      expect(response.formattedYearlyTotal).toEqual("---");
    });

  });
});