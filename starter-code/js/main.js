import { initTransactions } from "./pages/transactions.js";
import { initBudgets } from "./pages/budgets.js";
import { initRecurringBills } from "./pages/bills.js";
import { initPots } from "./pages/pots.js";
import { initOverview } from "./pages/overview.js";
import { initNavBar } from "./components/navbar.js";
import { initDropdown } from "./components/dropdowns.js";
import { initModal } from "./components/modals.js";


initNavBar();
initModal();
initDropdown()

initOverview()
initPots()
initBudgets()
initRecurringBills()
initTransactions()
