import React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';

export default function (props) {
    let columns = [
        {
            Header: "Date", accessor: "date", className: "transactions-subp-date-cell", id: "date",
            sortMethod: (date, other, desc) => {
                return desc ? date.isBefore(other) : date.isAfter(other);
            },
            Cell: ({ value, row }) => { return row._original.displayDate }
        },
        { Header: "Sub Category", accessor: "subCategory" },
        { Header: "Description", accessor: "description" },
        { Header: "Amount", accessor: "displayValue", className: "transactions-subp-amount-cell" }
    ];
    let formattedTransactions = [];
    if (props && props.transactions) {
        props.transactions.forEach((transactionData) => {
            let transaction = {
                subCategory: (
                    <button type="button" onClick={props.setActiveTransaction.bind(null, transactionData)}>
                        {transactionData.subCategory}
                    </button>
                ),
                description: transactionData.description,
                displayValue: transactionData.displayValue,
                date: transactionData.date,
                displayDate: transactionData.displayDate
            };
            formattedTransactions.push(transaction);
        });
    }
    return (
        <div id="transactions-wrapper">
            <ReactTable data={formattedTransactions} columns={columns} pageSize={props.rowCount}
                showPageJump={false} showPageSizeOptions={false} />
        </div>
    );
}
