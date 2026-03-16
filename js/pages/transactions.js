import { formatAmount, formatDate } from "../utility.js";
import { getLocalStorage } from "../localStorage.js";

const data = await getLocalStorage();

const transactionState = {
      transactions: [],
      currentPage: 1,
      itemsPerPage: 10,
}
transactionState.transactions = data.transactions.sort((a,b) => new Date(b.date) - new Date(a.date));
const totalPages = Math.ceil(transactionState.transactions.length / transactionState.itemsPerPage);
let startIndex = (transactionState.currentPage - 1) * transactionState.itemsPerPage;
let endIndex = startIndex + transactionState.itemsPerPage;
const firstTransactions = transactionState.transactions.slice(startIndex, endIndex)

function createTransactionRowMarkup(item) {
  return `<div class="table-row">
    <div class="image-title">
      <img src="${item.avatar}" alt="">
      <h4>${item.name}</h4>
    </div>
    <div class="transaction-category">
      <small>${item.category}</small>
    </div>
    <div class="transaction-date">
      <small>${formatDate(item.date)}</small>
    </div>
    <div class="transaction-amount">
      <h4 style="color: ${formatAmount(item.amount, true).includes('+') ? 'var(--color-green)' : ''}">
        ${formatAmount(item.amount, true)}
      </h4>
    </div>
  </div>`
}

function getInitialTransactions(){
      
      return `<div id="transaction-table">
            ${firstTransactions.map((item) => createTransactionRowMarkup(item)).join('')}
        </div>
        <div class="btn-row">
          <button data-pagination="previous" class="btn btn--light"><img src="./assets/images/icon-caret-left.svg"
              alt=""> <span>Prev</span></button>
          <div class="pagination-wrapper">
            ${createPaginationBtns(totalPages)}
          </div>
          <button data-pagination="next" class="btn btn--light"> <span>Next</span> <img
              src="./assets/images/icon-caret-right.svg" alt=""></button>
        </div>`
}

function createPaginationBtns(pages){
    let buttons = ''
    for (let i = 1; i <= pages; i++){
        buttons += `<button class="btn btn--light" data-page="${i}"><span>${i}</span></button>`
    }
    return buttons
}
function handlePagination(e){
      transactionState.currentPage = parseInt(e.target.closest('[data-page]').dataset.page);
      startIndex = (transactionState.currentPage - 1) * transactionState.itemsPerPage;
      endIndex = startIndex + transactionState.itemsPerPage;
      
      renderTransactionsPages(startIndex, endIndex)
      
}
function renderTransactionsPages(start,end){
      const transactions = transactionState.transactions.slice(start, end)
      document.querySelector('#transaction-table').innerHTML = 
            transactions.map((item) => createTransactionRowMarkup(item)).join('')
}
function handleNextAndPreviousPages(e){
      if (e.target.closest('[data-pagination]').dataset.pagination === 'next' && transactionState.currentPage < totalPages){
            transactionState.currentPage = transactionState.currentPage + 1;
      } else if (e.target.closest('[data-pagination]').dataset.pagination === 'previous' && transactionState.currentPage > 1) {
            transactionState.currentPage = transactionState.currentPage - 1;
      }
      if (transactionState.currentPage <= 1){
            document.querySelector('[data-pagination="previous"]').disabled = true
            document.querySelector('[data-pagination="next"]').disabled = false

      } else if (transactionState.currentPage >= totalPages){
            document.querySelector('[data-pagination="previous"]').disabled = false;
            document.querySelector('[data-pagination="next"]').disabled = true;
      } else {
            document.querySelector('[data-pagination="previous"]').disabled = false;
            document.querySelector('[data-pagination="next"]').disabled = false;
      }
      
      
      startIndex = (transactionState.currentPage - 1) * transactionState.itemsPerPage;
      endIndex = startIndex + transactionState.itemsPerPage;
      renderTransactionsPages(startIndex, endIndex)
}
function sortTransactions(e){
      document.querySelector('[data-dropdown-menu="transactions-sort"]').classList.remove('show-dropdown');
      document.querySelector('#sort-btn').innerHTML = `
                  <span>${e.target.innerText}</span>
                  <img src="./assets/images/icon-caret-down.svg" alt="">
          `
      if (e.currentTarget.dataset.sort === 'latest'){
            transactionState.transactions.sort((a,b) => new Date(b.date)  - new Date(a.date))
      } else if (e.currentTarget.dataset.sort === 'oldest'){
            transactionState.transactions.sort((a,b) => new Date(a.date)  - new Date(b.date))
      } else if (e.currentTarget.dataset.sort === 'atoz'){
            transactionState.transactions.sort((a,b) => a.name.localeCompare(b.name))
      } else if (e.currentTarget.dataset.sort === 'ztoa'){
            transactionState.transactions.sort((a,b) => b.name.localeCompare(a.name))
      } else if (e.currentTarget.dataset.sort === 'highest'){
            transactionState.transactions.sort((a,b) => Math.abs(b.amount) - Math.abs(a.amount))
      } else if (e.currentTarget.dataset.sort === 'lowest'){
            transactionState.transactions.sort((a,b) => Math.abs(a.amount) - Math.abs(b.amount))
      }      
      renderTransactionsPages(startIndex, endIndex)
}
function filterTransactions(e){
    const filterValue = e.currentTarget.dataset.filter
    const filterText = e.currentTarget.textContent.trim()
    
    document.querySelector('[data-dropdown-menu="transactions-category"]').classList.remove('show-dropdown')
    document.querySelector('#dropdown-btn span').textContent = filterText

    transactionState.currentPage = 1
    startIndex = 0
    endIndex = transactionState.itemsPerPage

    if (filterValue === 'all'){
        renderTransactionsPages(startIndex, endIndex)
        document.querySelector('.pagination-wrapper').innerHTML = createPaginationBtns(totalPages)
    } else {
        const filtered = transactionState.transactions.filter(item => item.category.toLowerCase().replace(' ', '-') === filterValue)
        const pages = Math.ceil(filtered.length / transactionState.itemsPerPage)
        document.querySelector('#transaction-table').innerHTML = filtered.slice(startIndex, endIndex).map((item) => createTransactionRowMarkup(item)).join('')
        document.querySelector('.pagination-wrapper').innerHTML = createPaginationBtns(pages)
    }

    reattachPaginationListeners()
}
function searchTransactions(e){
      const searchResults = transactionState.transactions.filter((item) => item.name.toLowerCase().includes(e.target.value))
      let pages = Math.ceil(searchResults.length / transactionState.itemsPerPage);
      transactionState.currentPage = 1;
      if (e.target.value !== ''){
      document.querySelector('#transaction-table').innerHTML = `
      ${searchResults.slice(startIndex, endIndex).map((item) => createTransactionRowMarkup(item)).join('')}`
      document.querySelector('.btn-row').innerHTML = `
      <button data-pagination="previous" class="btn btn--light"><img src="./assets/images/icon-caret-left.svg"
            alt=""> <span>Prev</span></button>
      <div class="pagination-wrapper">
      ${createPaginationBtns(pages)}
      </div>
      <button data-pagination="next" class="btn btn--light"> <span>Next</span> <img
            src="./assets/images/icon-caret-right.svg" alt=""></button>
       `
      } else {
            renderTransactionsPages(startIndex, endIndex)
            document.querySelector('.pagination-wrapper').innerHTML = createPaginationBtns(totalPages)
      }
      reattachPaginationListeners()
}
function reattachPaginationListeners() {
  document.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', handlePagination))
  document.querySelectorAll('[data-pagination]').forEach(btn => btn.addEventListener('click', handleNextAndPreviousPages))
}
function renderTransactions(){
      document.querySelector('.transactions-content').insertAdjacentHTML('beforeend', getInitialTransactions())
      document.querySelector('[data-search="search-transaction"]').addEventListener('input', searchTransactions)
      reattachPaginationListeners()
      document.querySelectorAll('[data-sort]').forEach((btn) => btn.addEventListener('click', sortTransactions))
      document.querySelectorAll('[data-filter]').forEach((btn) => btn.addEventListener('click', filterTransactions))

      const params = new URLSearchParams(window.location.search)
      const category = params.get('category')

      if (category) {
            const matchingFilter = document.querySelector(`[data-filter="${category.toLowerCase().replace(/\s+/g, '-')}"]`)
            if (matchingFilter) matchingFilter.click()
      }

}
export function initTransactions() {
      if (!document.getElementById('transactions')) return;
      renderTransactions()

}
