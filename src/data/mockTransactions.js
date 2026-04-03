// Mock transaction data spanning Jan - Mar 2025
// Categories from PRD: Food, Transport, Shopping, Rent, Salary, Entertainment, Healthcare, Utilities, Other

const mockTransactions = [
  { id: "1", date: "2025-01-05", description: "Salary Credit", category: "Salary", type: "income", amount: 55000 },
  { id: "2", date: "2025-01-07", description: "Zomato Order", category: "Food", type: "expense", amount: 320 },
  { id: "3", date: "2025-01-10", description: "Metro Card Recharge", category: "Transport", type: "expense", amount: 500 },
  { id: "4", date: "2025-01-12", description: "Swiggy Groceries", category: "Food", type: "expense", amount: 1150 },
  { id: "5", date: "2025-01-15", description: "Amazon Purchase", category: "Shopping", type: "expense", amount: 1850 },
  { id: "6", date: "2025-01-18", description: "Freelance Payment", category: "Salary", type: "income", amount: 12000 },
  { id: "7", date: "2025-01-20", description: "House Rent", category: "Rent", type: "expense", amount: 15000 },
  { id: "8", date: "2025-01-22", description: "Movie Tickets", category: "Entertainment", type: "expense", amount: 700 },
  { id: "9", date: "2025-01-25", description: "Uber Rides", category: "Transport", type: "expense", amount: 430 },
  { id: "10", date: "2025-01-28", description: "Electricity Bill", category: "Utilities", type: "expense", amount: 980 },
  { id: "11", date: "2025-02-01", description: "Salary Credit", category: "Salary", type: "income", amount: 55000 },
  { id: "12", date: "2025-02-04", description: "Grocery Store", category: "Food", type: "expense", amount: 2200 },
  { id: "13", date: "2025-02-07", description: "Netflix Subscription", category: "Entertainment", type: "expense", amount: 649 },
  { id: "14", date: "2025-02-10", description: "Electricity Bill", category: "Utilities", type: "expense", amount: 1100 },
  { id: "15", date: "2025-02-12", description: "Flipkart Order", category: "Shopping", type: "expense", amount: 2340 },
  { id: "16", date: "2025-02-14", description: "Restaurant Dinner", category: "Food", type: "expense", amount: 1400 },
  { id: "17", date: "2025-02-17", description: "Auto Rickshaw", category: "Transport", type: "expense", amount: 250 },
  { id: "18", date: "2025-02-20", description: "House Rent", category: "Rent", type: "expense", amount: 15000 },
  { id: "19", date: "2025-02-22", description: "Doctor Visit", category: "Healthcare", type: "expense", amount: 600 },
  { id: "20", date: "2025-02-25", description: "Bonus Credit", category: "Salary", type: "income", amount: 8000 },
  { id: "21", date: "2025-02-27", description: "Gym Membership", category: "Healthcare", type: "expense", amount: 1500 },
  { id: "22", date: "2025-03-01", description: "Salary Credit", category: "Salary", type: "income", amount: 55000 },
  { id: "23", date: "2025-03-03", description: "Dominos Pizza", category: "Food", type: "expense", amount: 540 },
  { id: "24", date: "2025-03-05", description: "Ola Cab", category: "Transport", type: "expense", amount: 380 },
  { id: "25", date: "2025-03-08", description: "Myntra Shopping", category: "Shopping", type: "expense", amount: 3200 },
  { id: "26", date: "2025-03-10", description: "Water Bill", category: "Utilities", type: "expense", amount: 450 },
  { id: "27", date: "2025-03-12", description: "Concert Tickets", category: "Entertainment", type: "expense", amount: 2500 },
  { id: "28", date: "2025-03-15", description: "Freelance Project", category: "Salary", type: "income", amount: 18000 },
  { id: "29", date: "2025-03-18", description: "Medicine Purchase", category: "Healthcare", type: "expense", amount: 850 },
  { id: "30", date: "2025-03-20", description: "House Rent", category: "Rent", type: "expense", amount: 15000 },
];

export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Rent",
  "Salary",
  "Entertainment",
  "Healthcare",
  "Utilities",
  "Other",
];

export const CATEGORY_ICONS = {
  Food: "restaurant",
  Transport: "directions_car",
  Shopping: "shopping_bag",
  Rent: "home_work",
  Salary: "account_balance_wallet",
  Entertainment: "theater_comedy",
  Healthcare: "local_hospital",
  Utilities: "bolt",
  Other: "more_horiz",
};

export const CATEGORY_COLORS = {
  Food: "#006c4a",
  Transport: "#565e77",
  Shopping: "#171f35",
  Rent: "#01071c",
  Salary: "#006c4a",
  Entertainment: "#fb3e38",
  Healthcare: "#7f87a2",
  Utilities: "#3e465e",
  Other: "#76777c",
};

export default mockTransactions;
