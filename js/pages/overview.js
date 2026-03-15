import { getLocalStorage } from "../localStorage.js";
import { formatAmount, formatDate, calculateTotal } from "../utility.js";
import { generatePieChart} from "../components/pieChart.js";

const data = await getLocalStorage();

const overviewState = {
	dataLength: 4,
	currentBalance: 0,
	income: 0,
	expenses: 0,
	potsOverview: [],
	budgetsOverview: [],
	transactionsOverview: [],
	recurringBillsOverview: [],
};

function getSummary() {
	overviewState.currentBalance = data.balance.current;
	overviewState.income = data.balance.income;
	overviewState.expenses = data.balance.expenses;

	return `
        <div class="card card--compact card__dark">
          <p>Current Balance</p>
          <!-- Add balance -->
          <h2>${formatAmount(overviewState.currentBalance, false)}</h2>
        </div>
        <div class="card card--compact">
          <p>Income</p>
          <!-- Add income -->
          <h2>${formatAmount(overviewState.income, false)}</h2>
        </div>
        <div class="card card--compact">
          <p>Expenses</p>
          <!-- Add expenses -->
          <h2>${formatAmount(overviewState.expenses, false)}</h2>
        </div>
      `;
}

function getPots() {
	overviewState.potsOverview = data.pots.map((item) => {
		return { name: item.name, theme: item.theme, totalSaved: item.total };
	});
	const totalPots = overviewState.potsOverview.reduce((acc, currentValue) => {return acc + currentValue.totalSaved;}, 0);

	return `<div class="pots-total">
                <svg fill="none" height="36" viewBox="0 0 28 36" width="28" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m22.4375 5.8875v-2.8875c0-.58016-.2305-1.13656-.6407-1.5468-.4102-.41023-.9666-.6407-1.5468-.6407h-12.5c-.58016 0-1.13656.23047-1.5468.6407-.41023.41024-.6407.96664-.6407 1.5468v2.8875c-1.39375.22446-2.66214.93755-3.57823 2.01165-.91608 1.07411-1.420065 2.43915-1.42177 3.85085v17.5c0 1.5747.62556 3.0849 1.73905 4.1984 1.1135 1.1135 2.62373 1.7391 4.19845 1.7391h15c1.5747 0 3.0849-.6256 4.1984-1.7391s1.7391-2.6237 1.7391-4.1984v-17.5c-.0017-1.4117-.5057-2.77674-1.4218-3.85085-.9161-1.0741-2.1845-1.78719-3.5782-2.01165zm-1.875-2.8875v2.8125h-3.125v-3.125h2.8125c.0829 0 .1624.03292.221.09153.0586.0586.0915.13809.0915.22097zm-8.125 2.8125v-3.125h3.125v3.125zm-4.6875-3.125h2.8125v3.125h-3.125v-2.8125c0-.08288.03292-.16237.09153-.22097.0586-.05861.13809-.09153.22097-.09153zm17.8125 26.5625c0 .5335-.1051 1.0618-.3092 1.5547-.2042.4928-.5034.9407-.8807 1.3179-.3772.3773-.8251.6765-1.3179.8807-.4929.2041-1.0212.3092-1.5547.3092h-15c-.53349 0-1.06177-.1051-1.55465-.3092-.49289-.2042-.94073-.5034-1.31797-.8807-.37724-.3772-.67648-.8251-.88064-1.3179-.20416-.4929-.30924-1.0212-.30924-1.5547v-17.5c0-1.0774.42801-2.11075 1.18988-2.87262s1.79518-1.18988 2.87262-1.18988h15c1.0774 0 2.1108.42801 2.8726 1.18988.7619.76187 1.1899 1.79522 1.1899 2.87262zm-6.875-6.25c0 .9117-.3622 1.786-1.0068 2.4307-.6447.6446-1.519 1.0068-2.4307 1.0068h-.3125v1.5625c0 .2486-.0988.4871-.2746.6629s-.4143.2746-.6629.2746-.4871-.0988-.6629-.2746-.2746-.4143-.2746-.6629v-1.5625h-1.5625c-.2486 0-.4871-.0988-.6629-.2746s-.2746-.4143-.2746-.6629.0988-.4871.2746-.6629.4143-.2746.6629-.2746h3.75c.4144 0 .8118-.1646 1.1049-.4576.293-.2931.4576-.6905.4576-1.1049s-.1646-.8118-.4576-1.1049c-.2931-.293-.6905-.4576-1.1049-.4576h-2.5c-.9117 0-1.786-.3622-2.4307-1.0068-.64464-.6447-1.0068-1.519-1.0068-2.4307s.36216-1.786 1.0068-2.4307c.6447-.6446 1.519-1.0068 2.4307-1.0068h.3125v-1.5625c0-.2486.0988-.4871.2746-.6629s.4143-.2746.6629-.2746.4871.0988.6629.2746.2746.4143.2746.6629v1.5625h1.5625c.2486 0 .4871.0988.6629.2746s.2746.4143.2746.6629-.0988.4871-.2746.6629-.4143.2746-.6629.2746h-3.75c-.4144 0-.8118.1646-1.1049.4576-.293.2931-.4576.6905-.4576 1.1049s.1646.8118.4576 1.1049c.2931.293.6905.4576 1.1049.4576h2.5c.9117 0 1.786.3622 2.4307 1.0068.6446.6447 1.0068 1.519 1.0068 2.4307z"
                    fill="#277c78" />
                </svg>
                <div id="total-Saved">
                  <small>Total Saved</small>
                  <h2>${formatAmount(totalPots, false)}</h2>
                </div>
              </div>
              <div class="pots-categories-wrapper">
                <div class="pots-categories">
                ${overviewState.potsOverview
									.slice(0, overviewState.dataLength)
									.map((item) => {
										return `
                    <div class="pots-category">
                        <span class="badge" style="--badge-color: ${item.theme};"></span>
                        <div>
                        <small>${item.name}</small>
                        <h4>${formatAmount(item.totalSaved, false) }</h4> 
                        </div>
                    </div>
                    `;
									})
									.join("")}             
                </div>
              </div>`;
}
function getBudgets() {
	overviewState.budgetsOverview = data.budgets.map((budget) => {
		return {
			category: budget.category,
			maximum: budget.maximum,
			theme: budget.theme,
		};
	});
	const totalBudgets = overviewState.budgetsOverview.reduce((acc, currentValue) => {return acc + currentValue.maximum;}, 0);
  const overviewBudgetCategories = overviewState.budgetsOverview.map((item) => {return item.category})
  const budgetTransactions = data.transactions.filter((item) => {return overviewBudgetCategories.includes(item.category)});
  const totalSpentArr = budgetTransactions.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item.amount);
          return acc;
  }, {})
  function getTotalForOverview(category){
    if (totalSpentArr[category]){
      return Math.abs(totalSpentArr[category].reduce((acc, amount) => acc + amount, 0))
  }
  return 0
  }
  const spentAmount = Math.abs(Object.values(totalSpentArr).flat().reduce((acc, item) => {return acc + item}, 0))

	return `<div class="test">
                <div class="pie-chart-wrapper">
                  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                    ${generatePieChart(overviewState.budgetsOverview, getTotalForOverview)}
                  </svg>
                  <div class="transparent-cricle">
                    <div class="white-cirlce">
                      <h2>${formatAmount(spentAmount, false)}</h2>
                      
                      <small>of $${totalBudgets} limit</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="budgets-badges-wrapper">
                ${overviewState.budgetsOverview
									.map((item) => {
										return `<div class="budget-badge">
                    <span style="--badge-color: ${item.theme};"  class="badge"></span>
                    <div>
                      <small>${item.category}</small>
                      <h4>${formatAmount(item.maximum, false)}</h4>
                    </div>
                    </div>`;
									})
									.join("")}         
              </div>`;
}
function getTransactions() {
	overviewState.transactionsOverview = data.transactions
		.slice(0, 5)
		.map((item) => {
			return {
				avatar: item.avatar,
				name: item.name,
				date: item.date,
				amount: item.amount,
			};
		});
	return `
    ${overviewState.transactionsOverview
			.map((item) => {
				return `<div class="transaction-item">
                    <div class="image-title">
                      <img src="${item.avatar}" alt="">
                      <h4>${item.name}</h4>
                    </div>
                    <div>
                      <h4 class="${item.amount > 0 ? 'debit': ''}">${formatAmount(item.amount, true)}</h4>
                      <small>${formatDate(item.date)}</small>
                    </div>
                  </div>`;
			})
			.join("")}`;
}
function getBills() {
  const todaysDate = new Date("2024-08-19T12:00:09Z").getDate();
  const paidBillsArr = [];
  let dueSoonBillsArr = [];
  let upcomingBillsArr = [];

	const bills = data.transactions.filter((item) => {
		return item.recurring;
	});
	overviewState.recurringBillsOverview = Object.values(
		bills.reduce((acc, bill) => {
			if (!acc[bill.name] || new Date(bill.date) > new Date(acc[bill.name].date)) {
				acc[bill.name] = bill;
			}
			return acc;
		}, {}),
	).filter((item) => {
    if (todaysDate >=  new Date(item.date).getDate()){
      paidBillsArr.push(item)
      return  paidBillsArr
    } else if (todaysDate < new Date(item.date).getDate() && new Date(item.date).getDate() - todaysDate <= 5) {
      dueSoonBillsArr.push(item) ;
      return dueSoonBillsArr
  	} else {
      upcomingBillsArr.push(item) ;
      return upcomingBillsArr
    }
  })
  let totalPaidBills = calculateTotal(paidBillsArr)
  let totalDueBills = calculateTotal(dueSoonBillsArr)
  let totalUpcomingBills = calculateTotal(upcomingBillsArr)

  return `<div class="bills-item">
                <small>Paid Bills</small>
                <h4>${formatAmount(totalPaidBills, false)}</h4>
              </div>
              <div class="bills-item">
                <small>Total Upcoming</small>
                <h4>${formatAmount(totalDueBills + totalUpcomingBills, false)}</h4>
              </div>
              <div class="bills-item">
                <small>Due Soon</small>
                <h4>${formatAmount(Math.abs(totalDueBills), false)}</h4>
              </div>`

}
function renderSummary() {
	document.querySelector(".summary-cards").innerHTML = getSummary();
}
function renderPots() {
	document.querySelector(".pots-overview").innerHTML = getPots();
}
function renderBudgets() {
	document.querySelector(".budgets-overview").innerHTML = getBudgets();
}
function renderTransactions() {
	document.querySelector("#transactions-overview").innerHTML = getTransactions();
}
function renderBills() {
  document.querySelector(".bills-overview").innerHTML = getBills()
}
function renderOverview(){
  renderSummary();
	renderPots();
	renderBudgets();
	renderTransactions();
  renderBills();
  
}
export function initOverview() {
  if (!document.getElementById('overview')) return;
	renderOverview()
}

