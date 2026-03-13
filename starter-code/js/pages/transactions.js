import { fetchData } from "../data/fetch.js";
import { formatAmount, formatDate } from "../utility.js";


const data = await fetchData();

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
function renderTransactions(){
      document.querySelector('.transactions-content').insertAdjacentHTML('beforeend', getInitialTransactions())
      document.querySelectorAll('[data-page]').forEach((btn) => btn.addEventListener('click', handlePagination))
      document.querySelectorAll('[data-pagination]').forEach((btn) => btn.addEventListener('click', handleNextandPreviuosPages))

}
export function initTransactions() {
      if (!document.getElementById('transactions')) return;
      renderTransactions()

}
