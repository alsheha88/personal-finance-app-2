import { calculateTotal, formatAmount, formatDate } from "../utility.js";
import { initDropdown } from "../components/dropdowns.js";
import { getLocalStorage } from "../localStorage.js";


const data = await getLocalStorage();
const todaysDate = new Date("2024-08-19T12:00:09Z").getDate();
const currentMonth = new Date("2024-08-19T12:00:09Z").getMonth() + 1;
const billState = {
      recurringBills: [],
      currentMonthBills: [],
      paidBills: [],
      upcomingBills: [],
      dueSoonBills: [],
}

billState.recurringBills = data.transactions.filter((item) => item.recurring);
billState.paidBills = billState.recurringBills.filter((item) => todaysDate >=  new Date(item.date).getDate() && (new Date(item.date).getMonth() + 1) === currentMonth)
billState.dueSoonBills = billState.recurringBills.filter((item) => todaysDate < new Date(item.date).getDate() && new Date(item.date).getDate() - todaysDate <= 5)
billState.upcomingBills = billState.recurringBills.filter((item) => todaysDate <  new Date(item.date).getDate())
billState.recurringBills.forEach(bill => {
  if (bill.date.includes('2024-07')) {
    bill.date = bill.date.replace('2024-07', '2024-08')
  }
})

billState.currentMonthBills = Object.values(
  billState.recurringBills.reduce((acc, bill) => {
    if (!acc[bill.name] || new Date(bill.date) > new Date(acc[bill.name].date)) {
      acc[bill.name] = bill
    }
    return acc
  }, {})
)

function createBillRowMarkup(item) {
  const { color, icon } = colorCodeByDate(item.date)
  return `<div class="bills-row">
    <div class="image-title">
      <img src="${item.avatar}" alt="">
      <h4>${item.name}</h4>
    </div>
    <div class="bill-frequency">
      <small style="color: ${color}">${formatDate(item.date)}</small>
      <img src="${icon}" alt="">
    </div>
    <div class="bill-amount">
      <h4 style="color: ${color}">${formatAmount(item.amount, false)}</h4>
    </div>
  </div>`
}
function getBillsSummary(){
      const totalPaidBills =  Math.abs(calculateTotal(billState.paidBills));
      const totalUpcomingBills = parseFloat(Math.abs(calculateTotal(billState.upcomingBills)).toFixed(2));
      const totalDueBills = parseFloat(Math.abs(calculateTotal(billState.dueSoonBills)).toFixed(2))
      const totalBills = totalPaidBills + totalUpcomingBills;
      
      return `<div class="bills-summary-total card card--compact card__dark">
      <div>
      <img src="./assets/images/icon-recurring-bills.svg" alt="">
      </div>
      <div>
              <p>Total Bills</p>
              <h2>${formatAmount(totalBills, false)}</h2>
            </div>
          </div>
          <div class="card bills-summary">
            <h5>Summary</h5>
            <div>
              <div class="bill-item">
                <small>Paid Bills</small>
                <h4>${billState.paidBills.length} (${formatAmount(totalPaidBills, false)})</h4>
              </div>
              <div class="bill-item">
                <small>Total Upcoming</small>
                <h4>${billState.upcomingBills.length} (${formatAmount(totalUpcomingBills, false)})</h4>
              </div>
              <div class="bill-item">
                <small style="color: var(--color-red)">Due Soon</small>
                <h4 style="color: var(--color-red)">${billState.dueSoonBills.length} (${formatAmount(totalDueBills, false)})</h4>
              </div>
            </div>
          </div>`
}
function colorCodeByDate(date){
    if (new Date(date).getDate() > todaysDate && new Date(date).getDate() - todaysDate <= 5){
        return { color: 'var(--color-red)', icon: './assets/images/icon-bill-due.svg' }
    } else if (todaysDate >= new Date(date).getDate()){
        return { color: 'var(--color-green)', icon: './assets/images/icon-bill-paid.svg' }
    }
    return { color: '', icon: '' }
}

function searchBills(e){
  const searchResults = billState.recurringBills.filter((item) => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
  if (e.target.value !== ''){
    document.querySelector('#bills-table').innerHTML = searchResults.map((item) =>createBillRowMarkup(item) ).join('')  
  } else {
    document.querySelector('#bills-table').innerHTML = getRecurringBills();
  }
}
function renderBillRows(arr){
document.querySelector('#bills-table').innerHTML = 
      arr.map((item) => createBillRowMarkup(item)).join('')
}
function renderSortedBills(e){
  document.querySelector('[data-dropdown-menu="bills-sort"]').classList.remove('show-dropdown');
  document.querySelector('#sort-btn').innerHTML = `
                  <span>${e.target.textContent}</span>
                  <img src="./assets/images/icon-caret-down.svg" alt="">
                `
  if (e.currentTarget.dataset.sort === 'latest'){
    billState.recurringBills.sort((a,b) => new Date(b.date)  - new Date(a.date))
  } else if (e.currentTarget.dataset.sort === 'oldest'){
    billState.recurringBills.sort((a,b) => new Date(a.date)  - new Date(b.date))
  } else if (e.currentTarget.dataset.sort === 'atoz'){
    billState.recurringBills.sort((a,b) => a.name.localeCompare(b.name))
  } else if (e.currentTarget.dataset.sort === 'ztoa'){
    billState.recurringBills.sort((a,b) => b.name.localeCompare(a.name))
  } else if (e.currentTarget.dataset.sort === 'highest'){
    billState.recurringBills.sort((a,b) => a.amount - b.amount)
  } else if (e.currentTarget.dataset.sort === 'lowest'){
    billState.recurringBills.sort((a,b) => b.amount - a.amount)
  } else {
    document.querySelector('#bills-table').innerHTML = getRecurringBills();
  }
  renderBillRows(billState.recurringBills)

}
function getRecurringBills(){
      const sortBillsByDate = billState.currentMonthBills.sort((a,b) => new Date(a.date)  - new Date(b.date))
      return `
      ${sortBillsByDate.map((item) => createBillRowMarkup(item)).join('')}`
      
}
function renderRecurringBills(){
      document.querySelector('.summary-section').innerHTML = getBillsSummary();
      document.querySelector('#bills-table').innerHTML = getRecurringBills();

      document.querySelector('[data-search="search-bills"]').addEventListener('input', searchBills)
      document.querySelectorAll('[data-sort]').forEach((btn) => btn.addEventListener('click', renderSortedBills))

}
export function initRecurringBills() {
      if (!document.getElementById('bills')) return;
      renderRecurringBills()

}