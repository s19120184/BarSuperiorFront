export interface Expense {
    id:            string;
    description:   string;
    amount:        string;
    paymentMethod: string;
    supplier:      string;
    expenseDate:   Date;
    createdAt:     Date;
    deletedAt:     null;
}
