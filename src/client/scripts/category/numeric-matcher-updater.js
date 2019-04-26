import $ from "jquery";

export default class NumericMatcherUpdater {

    constructor(sliderSelector, minAmount, maxAmount, referenceAmount, notificationListener) {
        console.log("Started with (" + minAmount + ", " + maxAmount + ")");
        //TODO this is getting constructed 1) with wrong min/max and 2) every second.  Fix it.
        this.sliderSelector = sliderSelector;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
        this.referenceAmount = referenceAmount;
        this.isStarted = false;
        this.startX = 0;
        this.maxRange = 100;
        this.notificationListener = notificationListener;
        this.lowHigh = null; //'low' if the minAmount is being updated.  'high' if the maxAmount is being updated.
        this.suggestedMinAmount = this.minAmount;
        this.suggestedMaxAmount = this.maxAmount;
    }

    update(event) {
        if (!this.isStarted) {
            return;
        }
        let boundingBox = $(this.sliderSelector)[0].getBoundingClientRect();
        let minX = boundingBox.x;
        let maxX = boundingBox.right;

        //update amount
        let percentDifference = (event.clientX - minX) / (maxX - minX);
        if (event.clientX < minX && this.lowHigh == "low") {
            this.minAmount = this.referenceAmount - (this.maxRange / 2);
        } else if (event.clientX > maxX && this.lowHigh == "high") {
            this.maxAmount = this.referenceAmount + (this.maxRange / 2);
        } else {
            let updatedAmount = ((percentDifference - 0.5) * this.maxRange) + this.referenceAmount;
            if (this.lowHigh == "high") {
                if (percentDifference >= .5) {
                    this.maxAmount = updatedAmount;
                } else {
                    this.maxAmount = this.referenceAmount;
                }
            } else if (this.lowHigh == "low") {
                if (percentDifference <= .5) {
                    this.minAmount = updatedAmount;
                } else {
                    this.minAmount = this.referenceAmount;
                }
            }
        }
        this.minAmount = Math.round(this.minAmount * 100) / 100;
        this.maxAmount = Math.round(this.maxAmount * 100) / 100;
        this.suggestedMinAmount = this.minAmount;
        this.suggestedMaxAmount = this.maxAmount;
        this.notificationListener.onUpdateAmount();
    }

    startUpdate(event, lowHigh) {
        this.isStarted = true;
        if (this.lowHigh != null) {
            return;
        }
        if ((lowHigh == "low" || lowHigh == "high")) {
            this.lowHigh = lowHigh;
            return;
        }
        let boundingBox = $(this.sliderSelector)[0].getBoundingClientRect();
        let minX = boundingBox.x;
        let maxX = boundingBox.right;

        //update amount
        let percentDifference = (event.clientX - minX) / (maxX - minX);
        if (percentDifference > 0.5) {
            this.lowHigh = "high";
        } else {
            this.lowHigh = "low";
        }
        this.update(event);
    }

    endUpdate() {
        this.isStarted = false;
        this.lowHigh = null;
    }

    suggestMinValue(strValue) {
        if (!strValue) {
            this.suggestedMinAmount = 0;
        } else if (!isNaN(strValue)) {
            this.suggestedMinAmount = parseInt(strValue)
        } else {
            //do nothing, they gave us invalid input, we will ignore it and keep our current values.
        }
        this.notificationListener.onUpdateAmount();
    }

    suggestMaxValue(strValue) {
        if (!strValue) {
            this.suggestedMaxAmount = 0;
        } else if (!isNaN(strValue)) {
            this.suggestedMaxAmount = parseInt(strValue)
        } else {
            //do nothing, they gave us invalid input, we will ignore it and keep our current values.
        }
        this.notificationListener.onUpdateAmount();
    }

    validateSuggestedValues() {
        if (this.suggestedMinAmount && !isNaN(this.suggestedMinAmount)) {
            if (this.suggestedMinAmount < (this.referenceAmount - (this.maxRange / 2))) {
                this.minAmount = this.referenceAmount - (this.maxRange / 2);
            } else if (this.suggestedMinAmount > this.referenceAmount) {
                this.minAmount = this.referenceAmount;
            } else {
                this.minAmount = this.suggestedMinAmount;
            }
        }

        if (this.suggestedMaxAmount && !isNaN(this.suggestedMaxAmount)) {
            if (this.suggestedMaxAmount < this.referenceAmount) {
                this.maxAmount = this.referenceAmount;
            } else if (this.suggestedMaxAmount > (this.referenceAmount + (this.maxRange / 2))) {
                this.maxAmount = this.referenceAmount + (this.maxRange / 2);
            } else {
                this.maxAmount = this.suggestedMaxAmount;
            }
        }

        this.suggestedMinAmount = this.minAmount;
        this.suggestedMaxAmount = this.maxAmount;
        this.notificationListener.onUpdateAmount();
    }
    /**
     * Gets the percentage of the current maximum display range that the low end of the range is at.
     * If 100%, then it is at the minimum displayable amount (furthest from the reference amount).  If 0%, 
     * it is the same as the reference amount.
     */
    getLowPercentage() {
        return ((this.referenceAmount - this.minAmount) / (this.maxRange / 2)) * 100;
    }

    /**
     * Gets the percentage of the current maximum display range that the high end of the range is at.
     * If 100%, then it is at the maximum displayable amount (furthest from the reference amount).  If 0%, 
     * it is the same as the reference amount.
     */
    getHighPercentage() {
        return ((this.maxAmount - this.referenceAmount) / (this.maxRange / 2)) * 100;
    }

    toString() {
        return "(" + this.minAmount + ", " + this.maxAmount + ") based on " + this.referenceAmount;
    }
}