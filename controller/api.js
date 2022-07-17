const validateInput = require('../models/inputSchema');
const asyncHandler = require('express-async-handler')

const tpssAPI = asyncHandler( async function(req, res){
    try {
        //Collect Data
        let {ID, Amount, Currency, CustomerEmail, SplitInfo} = req.body;
        const inputData = {
            ID,
            Amount,
            Currency,
            CustomerEmail,
            SplitInfo
        }
        //Initialize Variables
        const splitBreakDown = [];
        let currentAmount = Amount;
        let totalRatio = 0;

        // Calculate for all FLATs
        for (let i = 0; i < SplitInfo.length; i++){
            //Deduct the spilt value amount
            if(SplitInfo[i].SplitType === "FLAT"){
                const {SplitValue, SplitEntityId} = SplitInfo[i]
                if(currentAmount - SplitValue >= 0){
                    currentAmount -= SplitValue; 
                    const data = {SplitEntityId, Amount: SplitValue}
                    splitBreakDown.push(data)
                }
                
            }
            //Get Total RATIO
            if(SplitInfo[i].SplitType === "RATIO"){
                const {SplitValue} = SplitInfo[i];
                totalRatio += SplitValue; 
            }
        }
        // Calculate for all PERCENTAGEs
        for (let i = 0; i < SplitInfo.length; i++){
            //Deduct the spilt value amount
            if(SplitInfo[i].SplitType === "PERCENTAGE" ){
                //Get split value
                const {SplitValue, SplitEntityId} = SplitInfo[i];
                const decimalValue = 0.01 * SplitValue
                const subtractor = decimalValue * currentAmount;
                if(currentAmount - subtractor >= 0 ){
                    currentAmount -= subtractor;
                    const data = {SplitEntityId, Amount: subtractor}
                    splitBreakDown.push(data)
                }
            }
        }
        //Set initial amount before RATIO 
        let totalAmountAfterRatio = currentAmount
        // Calculate for all RATIOs
        for (let i = 0; i < SplitInfo.length; i++){
            //Deduct the spilt value amount
            if(SplitInfo[i].SplitType === "RATIO"){
                //Get split value
                const {SplitValue, SplitEntityId} = SplitInfo[i];
                const deductedAmount = (SplitValue / totalRatio) * currentAmount;
                if((totalAmountAfterRatio - deductedAmount >= 0)){
                    totalAmountAfterRatio -= deductedAmount; 
                    const data = {SplitEntityId, Amount: deductedAmount}
                    splitBreakDown.push(data);
                }
            }
        }
        // Transaction Data
        Amount = totalAmountAfterRatio
        const completedTransaction = {
            ID,
            Balance: Amount,
            SplitBreakDown: splitBreakDown
        }

        res.status(200).send(JSON.stringify(completedTransaction, null, 3))
        return;
      
    } catch (error) {
        throw new Error(error)
    }
   

   
   
  
})


module.exports = tpssAPI;




