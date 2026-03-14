import { fetchData } from "../data/fetch.js";
import { formatAmount, formatDate } from "../utility.js";
import { getLocalStorage } from "../localStorage.js";



const data = await getLocalStorage();

const transactionState = {
      transactions: [],
      currentPage: 1,
      itemsPerPage: 10,

}

transactionState.transactions = data.transactions.sort((a,b) => new Date(b.date).getMonth() - new Date(a.date).getMonth());
const totalPages = Math.ceil(transactionState.transactions.length / transactionState.itemsPerPage);


function getInitialTransactions(){
      const startIndex = (transactionState.currentPage - 1) * transactionState.itemsPerPage;
      const endIndex = startIndex + transactionState.itemsPerPage;
      const firstTransactions = transactionState.transactions.slice(startIndex, endIndex)
      
      return `<div id="transaction-table">
            ${firstTransactions.map((item) => {
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
                      <h4 style="color: ${formatAmount(item.amount, true).includes('+') ?  'var(--color-green)' : ''} ">${formatAmount(item.amount, true)}</h4>
                    </div>
                  </div>`

            }).join('')}
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
      const startIndex = (transactionState.currentPage - 1) * transactionState.itemsPerPage;
      const endIndex = startIndex + transactionState.itemsPerPage;
      
      renderTransactionsPages(startIndex, endIndex)
      
}
function renderTransactionsPages(start,end){
      const transactions = transactionState.transactions.slice(start, end)
      document.querySelector('#transaction-table').innerHTML = 
            transactions.map((item) => {
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
                      <h4 style="color: ${formatAmount(item.amount, true).includes('+') ?  'var(--color-green)' : ''} ">${formatAmount(item.amount, true)}</h4>
                    </div>
                    </div>
            `}).join('')
}
function handleNextandPreviuosPages(e){
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
      
      
      const startIndex = (transactionState.currentPage - 1) * transactionState.itemsPerPage;
      const endIndex = startIndex + transactionState.itemsPerPage;
      renderTransactionsPages(startIndex, endIndex)
}
function sortTransactions(e){
      const startIndex = (transactionState.currentPage - 1) * transactionState.itemsPerPage;
      const endIndex = startIndex + transactionState.itemsPerPage;
      document.querySelector('[data-dropdown-menu="transactions-sort"]').classList.remove('show-dropdown');
      document.querySelector('#sort-btn').innerHTML = `
                  <span>${e.target.innerText}</span>
                  <img src="./assets/images/icon-caret-down.svg" alt="">
                `
      if (e.currentTarget.dataset.sort === 'latest'){
      transactionState.transactions.sort((a,b) => new Date(b.date)  - new Date(a.date))
      renderTransactionsPages(startIndex, endIndex)
      } else if (e.currentTarget.dataset.sort === 'oldest'){
      transactionState.transactions.sort((a,b) => new Date(a.date)  - new Date(b.date))
      renderTransactionsPages(startIndex, endIndex)

      } else if (e.currentTarget.dataset.sort === 'atoz'){
      transactionState.transactions.sort((a,b) => a.name.localeCompare(b.name))
      renderTransactionsPages(startIndex, endIndex)
      } else if (e.currentTarget.dataset.sort === 'ztoa'){
      transactionState.transactions.sort((a,b) => b.name.localeCompare(a.name))
      renderTransactionsPages(startIndex, endIndex)
      } else if (e.currentTarget.dataset.sort === 'highest'){
      transactionState.transactions.sort((a,b) => Math.abs(b.amount) - Math.abs(a.amount))
      renderTransactionsPages(startIndex, endIndex)
      } else if (e.currentTarget.dataset.sort === 'lowest'){
      transactionState.transactions.sort((a,b) => Math.abs(a.amount) - Math.abs(b.amount))
      renderTransactionsPages(startIndex, endIndex)
      } else {
            document.querySelector('.transactions-content').insertAdjacentHTML('beforeend', getInitialTransactions())
      }
      
}
function filterTransactions(e){
    const filterValue = e.currentTarget.dataset.filter
    const filterText = e.currentTarget.textContent.trim()
    
    document.querySelector('[data-dropdown-menu="transactions-category"]').classList.remove('show-dropdown')
    document.querySelector('#dropdown-btn span').textContent = filterText

    transactionState.currentPage = 1
    const startIndex = 0
    const endIndex = transactionState.itemsPerPage

    if (filterValue === 'all'){
        renderTransactionsPages(startIndex, endIndex)
        document.querySelector('.pagination-wrapper').innerHTML = createPaginationBtns(totalPages)
    } else {
        const filtered = transactionState.transactions.filter(item => item.category.toLowerCase().replace(' ', '-') === filterValue)
        const pages = Math.ceil(filtered.length / transactionState.itemsPerPage)
        document.querySelector('#transaction-table').innerHTML = filtered.slice(startIndex, endIndex).map((item) => {
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
                    <h4 style="color: ${formatAmount(item.amount, true).includes('+') ? 'var(--color-green)' : ''}">${formatAmount(item.amount, true)}</h4>
                </div>
            </div>`
        }).join('')
        document.querySelector('.pagination-wrapper').innerHTML = createPaginationBtns(pages)
    }

    document.querySelectorAll('[data-page]').forEach((btn) => btn.addEventListener('click', handlePagination))
    document.querySelectorAll('[data-pagination]').forEach((btn) => btn.addEventListener('click', handleNextandPreviuosPages))
}
function searchTransactions(e){
      const searchResults = transactionState.transactions.filter((item) => item.name.toLowerCase().includes(e.target.value))
      let pages = Math.ceil(searchResults.length / transactionState.itemsPerPage);
      transactionState.currentPage = 1;
      const startIndex = (transactionState.currentPage - 1) * transactionState.itemsPerPage;
      const endIndex = startIndex + transactionState.itemsPerPage;
      if (e.target.value !== ''){
      document.querySelector('#transaction-table').innerHTML = `
      ${searchResults.slice(startIndex, endIndex).map((item) => {
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
                  <h4 style="color: ${formatAmount(item.amount, true).includes('+') ?  'var(--color-green)' : ''} ">${formatAmount(item.amount, true)}</h4>
                  </div>
            </div>`

      }).join('')}`
      document.querySelector('.btn-row').innerHTML = `
      <button data-pagination="previous" class="btn btn--light"><img src="./assets/images/icon-caret-left.svg"
            alt=""> <span>Prev</span></button>
      <div class="pagination-wrapper">
      ${createPaginationBtns(pages)}
      </div>
      <button data-pagination="next" class="btn btn--light"> <span>Next</span> <img
            src="./assets/images/icon-caret-right.svg" alt=""></button>
       `
      }
      document.querySelectorAll('[data-page]').forEach((btn) => btn.addEventListener('click', handlePagination))
      document.querySelectorAll('[data-pagination]').forEach((btn) => btn.addEventListener('click', handleNextandPreviuosPages))
}
function renderTransactions(){
      document.querySelector('.transactions-content').insertAdjacentHTML('beforeend', getInitialTransactions())
      document.querySelector('[data-search="search-transaction"]').addEventListener('input', searchTransactions)
      document.querySelectorAll('[data-page]').forEach((btn) => btn.addEventListener('click', handlePagination))
      document.querySelectorAll('[data-pagination]').forEach((btn) => btn.addEventListener('click', handleNextandPreviuosPages))
      document.querySelectorAll('[data-sort]').forEach((btn) => btn.addEventListener('click', sortTransactions))
      document.querySelectorAll('[data-filter]').forEach((btn) => btn.addEventListener('click', filterTransactions))


}
export function initTransactions() {
      if (!document.getElementById('transactions')) return;
      renderTransactions()

}
