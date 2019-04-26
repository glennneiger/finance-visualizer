import React from "react";
export default function (props) {
    let height = 15;
    let fillPercentage = (props.updater.getHighPercentage() / 2) + (props.updater.getLowPercentage() / 2);
    //TODO make classes for all these styles.
    return (
        <div style={{ width: "100%" }}>
            <div id="categorizeTransactionAmountSlider" className="no-select" style={{
                width: "100%",
                height: height + "px",
                background: "#AAAAAA",
                borderRadius: (height / 2) + "px"
            }}
                onMouseDown={(event) => { props.updater.startUpdate(event) }}
                onMouseUp={(event) => { props.updater.endUpdate(event) }}>
                <div id="categorizeTransactionAmountSlider_minPadding" className="no-select" style={{
                    width: ((100 - props.updater.getLowPercentage()) / 2) + "%",
                    height: height + "px",
                    background: "#AAAAAA",
                    borderRadius: (height / 2) + "px",
                    display: "inline-block"
                }}>&nbsp;</div>
                <div id="categorizeTransactionAmountSlider_minHandle" className="no-select"
                    style={{
                        position: "absolute",
                        marginLeft: "-" + (height / 2) + "px",
                        marginTop: "-" + (height / 5) + "px",
                        height: height * 1.5 + "px",
                        width: height * 1.5 + "px",
                        background: "limegreen",
                        borderRadius: (height * 1.5 / 2) + "px",
                        display: "inline-block"
                    }}
                    onMouseDown={(event) => { props.updater.startUpdate(event, "low") }}
                >&nbsp;</div>
                <div id="categorizeTransactionAmountSlider_maxPadding" className="no-select" style={{
                    width: fillPercentage + "%",
                    height: height + "px",
                    background: "green",
                    borderRadius: (height / 2) + "px",
                    display: "inline-block"
                }}>&nbsp;</div>

                <div id="categorizeTransactionAmountSlider_maxHandle" className="no-select"
                    style={{
                        position: "absolute",
                        marginLeft: "-" + (height / 2) + "px",
                        marginTop: "-" + (height / 5) + "px",
                        height: height * 1.5 + "px",
                        width: height * 1.5 + "px",
                        background: "limegreen",
                        borderRadius: (height * 1.5 / 2) + "px",
                        display: "inline-block"
                    }}
                    onMouseDown={(event) => { props.updater.startUpdate(event, "high") }}
                >&nbsp;</div>
            </div>
            <div style={{ textAlign: "center", margin: "auto" }}>
                <span>($</span>
                <input
                    type="text"
                    size={1}
                    style={{ display: "inline", maxWidth: "30%", border: "none" }}
                    value={props.updater.suggestedMinAmount.toFixed(2)}
                    onChange={(event) => { props.updater.suggestMinValue(event.target.value) }}
                    onBlur={() => { props.updater.validateSuggestedValues() }}></input>
                <span>,&nbsp;$</span>
                <input
                    type="text"
                    size={1}
                    style={{ display: "inline", maxWidth: "30%", border: "none" }}
                    value={props.updater.suggestedMaxAmount.toFixed(2)}
                    onChange={(event) => { props.updater.suggestMaxValue(event.target.value) }}
                    onBlur={() => { props.updater.validateSuggestedValues() }}></input>
                <span>)</span>
            </div>
        </div>
    );
}