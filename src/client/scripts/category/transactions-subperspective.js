import React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'

export default function(props){
    let columns = [
        {Header:"Date", accessor:"date", className: "transactions-subp-date-cell", id: "date", 
            sortMethod: (date,other,desc)=>{
                return desc ? date.isBefore(other) : date.isAfter(other);
            },
            Cell: ({value, row}) => {return row._original.displayDate}
        },
        {Header:"Sub Category", accessor:"subCategory"},
        {Header:"Description", accessor:"description"},
        {Header:"Amount", accessor: "displayValue", className: "transactions-subp-amount-cell"}
    ];
    return (
        <div id="transactions-wrapper">
            <ReactTable data={props.transactions} columns={columns} pageSize={props.rowCount} 
            showPageJump={false} showPageSizeOptions={false}/>
        </div>
    );
}
