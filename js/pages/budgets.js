import { initDropdown } from "../components/dropdowns.js";
import { initModal } from "../components/modals.js";
import { calculateTotal, formatAmount, formatDate } from "../utility.js";
import { getLocalStorage, setLocalStorage } from "../localStorage.js";
import { generatePieChart } from "../components/pieChart.js";

const data = await getLocalStorage();

const budgetsState = {
      budgetSummary: [],
      budgetTransactions: [],
      budgetCategory: [],
      selectedBudget: undefined,
      budgetTransactionsAmounts: [],
      themeSelected: '',
      categorySelected: '',
}
budgetsState.budgetSummary = data.budgets;
budgetsState.budgetCategory = budgetsState.budgetSummary.map((item) => {return item.category})
budgetsState.budgetTransactions = data.transactions.filter((item) => {return budgetsState.budgetCategory.includes(item.category)});
budgetsState.budgetTransactionsAmounts = budgetsState.budgetTransactions.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item.amount);
        return acc;
}, {})
budgetsState.budgetTransactions = budgetsState.budgetTransactions.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
        return acc;
}, {}) 
 
function getTotalPerCategory(category){
  if (budgetsState.budgetCategory.includes(category)){
    const amounts = budgetsState.budgetTransactionsAmounts[category].map(amount => ({ amount }))
    return Math.abs(calculateTotal(amounts))
  }
  return 0;
}
 
const colorNameMap = {
    '#277C78': 'Green',
    '#F2CDAC': 'Yellow',
    '#82C9D7': 'Cyan',
    '#626070': 'Navy',
    '#C94736': 'Red',
    '#826CB0': 'Purple',
    '#597C7C': 'Turquoise',
    '#93674F': 'Brown',
    '#934F6F': 'Magenta',
    '#3F82B2': 'Blue',
    '#97A0AC': 'Navy Grey',
    '#7F9161': 'Army Green',
    '#AF81BA': 'Pink',
    '#CAB361': 'Gold',
    '#BE6C49': 'Orange',
}
 
function getUsedThemes() {
    return budgetsState.budgetSummary.map(item => item.theme)
}
 
function disableExistingCategories(excludeCategory = null) {
    document.querySelectorAll('[data-modal="new-budget-modal"] [data-category], [data-modal="edit-budget-modal"] [data-category]').forEach((li) => {
        const categoryText = li.textContent.trim()
        if (budgetsState.budgetCategory.includes(categoryText) && categoryText !== excludeCategory) {
            li.style.pointerEvents = 'none'
            li.style.opacity = '0.4'
        } else {
            li.style.pointerEvents = ''
            li.style.opacity = ''
        }
    })
}
 
function disableUsedThemes(excludeTheme = null) {
    const usedThemes = getUsedThemes()
    document.querySelectorAll('[data-modal="new-budget-modal"] [data-color], [data-modal="edit-budget-modal"] [data-color]').forEach((li) => {
        const existing = li.querySelector('.already-used-tag')
        if (existing) existing.remove()
        li.style.pointerEvents = ''
        li.style.opacity = ''
        li.style.display = ''
 
        if (usedThemes.includes(li.dataset.color) && li.dataset.color !== excludeTheme) {
            li.style.pointerEvents = 'none'
            li.style.opacity = '0.4'
            li.style.display = 'flex'
            li.style.justifyContent = 'space-between'
            const tag = document.createElement('small')
            tag.classList.add('already-used-tag')
            tag.textContent = 'Already used'
            li.appendChild(tag)
        }
    })
}
 
function getBudgetSummary(){
  const limit = budgetsState.budgetSummary.reduce((acc, item) => {
    return acc + item.maximum
  }, 0)
  const spentAmount = Math.abs(Object.values(budgetsState.budgetTransactionsAmounts).flat().reduce((acc, item) => {return acc + item}, 0))
 
  
  return `<div class="card budgets-summary">      
        <div class="test">
              <div class="pie-chart-wrapper">
                <svg id="pieChart" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">               
                    ${generatePieChart(budgetsState.budgetSummary, getTotalPerCategory)}
                </svg>
                <div class="transparent-cricle">
                  <div class="white-cirlce">
                    <h2>${formatAmount(spentAmount, false)}</h2>
                    <small>of ${formatAmount(limit, false)} limit</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="spending-summary">
              <h3>Spending Summary</h3>
              <div>
        ${budgetsState.budgetSummary.map((item) => {
            return `<div class="budget-item">
            <div class="budget-badge">
              <span class="badge" style="background-color: ${item.theme}"></span>
              <small>${item.category}</small>
            </div>
            <div class="flex gap-100">
              <h4>${formatAmount(getTotalPerCategory(item.category), false)}</h4>
              <small>of ${formatAmount(item.maximum, false)}</small>
            </div>
          </div>`
        }).join('')}
            </div>
            </div>
            </div>
            
  `
}
 
function getBudgetCard(){
  return `
  ${budgetsState.budgetSummary.map((item) => {
    const spent = getTotalPerCategory(item.category)

    return `  <div class="card budgets-card" data-budget="${item.category}">
            <div class="flex-between">
              <div class="flex gap-200">
                <div class="color-dot" style="background-color: ${item.theme}"></div>
                <h3>${item.category}</h3>
              </div>
              <div class="dropdown-container">
                <button data-dropdown-trigger="edit-delete-dropdown">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M9.75 8C9.75 8.34612 9.64736 8.68446 9.45507 8.97225C9.26278 9.26003 8.98947 9.48434 8.6697 9.61679C8.34993 9.74924 7.99806 9.7839 7.65859 9.71637C7.31913 9.64885 7.00731 9.48218 6.76256 9.23744C6.51782 8.9927 6.35115 8.68087 6.28363 8.34141C6.2161 8.00194 6.25076 7.65007 6.38321 7.3303C6.51567 7.01053 6.73997 6.73722 7.02775 6.54493C7.31554 6.35264 7.65388 6.25 8 6.25C8.46413 6.25 8.90925 6.43437 9.23744 6.76256C9.56563 7.09075 9.75 7.53587 9.75 8ZM3 6.25C2.65388 6.25 2.31554 6.35264 2.02775 6.54493C1.73997 6.73722 1.51566 7.01053 1.38321 7.3303C1.25076 7.65007 1.2161 8.00194 1.28363 8.34141C1.35115 8.68087 1.51782 8.9927 1.76256 9.23744C2.00731 9.48218 2.31913 9.64885 2.65859 9.71637C2.99806 9.7839 3.34993 9.74924 3.6697 9.61679C3.98947 9.48434 4.26278 9.26003 4.45507 8.97225C4.64737 8.68446 4.75 8.34612 4.75 8C4.75 7.53587 4.56563 7.09075 4.23744 6.76256C3.90925 6.43437 3.46413 6.25 3 6.25ZM13 6.25C12.6539 6.25 12.3155 6.35264 12.0278 6.54493C11.74 6.73722 11.5157 7.01053 11.3832 7.3303C11.2508 7.65007 11.2161 8.00194 11.2836 8.34141C11.3512 8.68087 11.5178 8.9927 11.7626 9.23744C12.0073 9.48218 12.3191 9.64885 12.6586 9.71637C12.9981 9.7839 13.3499 9.74924 13.6697 9.61679C13.9895 9.48434 14.2628 9.26003 14.4551 8.97225C14.6474 8.68446 14.75 8.34612 14.75 8C14.75 7.77019 14.7047 7.54262 14.6168 7.3303C14.5288 7.11798 14.3999 6.92507 14.2374 6.76256C14.0749 6.60006 13.882 6.47116 13.6697 6.38321C13.4574 6.29526 13.2298 6.25 13 6.25Z"
                      fill="#B3B3B3" />
                  </svg>
                </button>
                <ul data-dropdown-menu="edit-delete-dropdown"
                  class="dropdown-list dropdown-list--compact dropdown--compact">
                  <li class="dropdown-item" data-modal-trigger="edit-budget-modal" data-edit="edit-budget">Edit Budget
                  </li>
                  <li class="dropdown-item btn--delete" data-modal-trigger="delete-budget-modal">Delete Budget</li>
                </ul>
              </div>
            </div>
            <div class="budgets-progress-wrapper">
              <p>Maximum of ${formatAmount(item.maximum, false)}</p>
              <div class="bar budgets-progress">
                <div data-progress="budget-progress" class="bar--inner" style="background-color: ${item.theme}; width:${(spent/item.maximum * 100) > 100 ? 100 : (spent/item.maximum * 100)}%"></div>
              </div>
              <div class="grid grid-column">
                <div class="budget-badge">
                  <span class="badge" style="background-color: ${item.theme};"></span>
                  <div>
                    <small>Spent</small>
                    <h5>${formatAmount(spent, false)}</h5>
                  </div>
                </div>
                <div class="budget-badge">
                  <span class="badge" style="background-color: ${item.theme};"></span>
                  <div>
                    <small>Remaining</small>
                    <h5>${spent > item.maximum ? formatAmount(0, false) : formatAmount(item.maximum - spent, false)}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div class="budgets-table">
              <div class="flex-between">
                <h3>Latest Spending</h3>
                <a class="flex gap-150" href="transactions.html?category=${item.category}">See All <img src="./assets/images/icon-caret-right.svg" alt=""></a>
              </div>
              ${budgetsState.budgetTransactions[item.category] ? budgetsState.budgetTransactions[item.category].slice(0,3).map((transaction) => {
                return `<div class="budgets-row">
                <div class="image-title">
                  <img src="${transaction.avatar}" alt="">
                  <h5>${transaction.name}</h5>
                </div>
                <div>
                  <h5>${formatAmount(transaction.amount)}</h5>
                  <small>${formatDate(transaction.date)}</small>
                </div>
              </div>`
              }).join('') : ''}
              </div>
              </div>
              `
  }).join('')}
`
}
function saveBudget(){
  return data.budgets = budgetsState.budgetSummary
} 
function createDeleteBudgetModalMarkup(name){
    return `<div class="card modal__card">
      <div class="card-heading">
        <h1>Delete '${name}'?</h1>
        <button data-collapse-trigger="collapse-delete-budget"><img src="./assets/images/icon-close-modal.svg"
            alt=""></button>
      </div>
      <small>Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it
        will be removed forever.</small>
      <button data-delete="delete-budget" class="btn btn--danger">Yes, Confirm Deletion</button>
      <button data-collapse-trigger="collapse-delete-budget" class="btn--transparent">No, Go Back</button>
    </div>`
}
 
function openDeleteBudgetModal(btn){
    const clickedBudgetName = btn.closest('[data-budget]').dataset.budget
    const selectedItem = budgetsState.budgetSummary.find((item) => item.category.trim() === clickedBudgetName)
    if (selectedItem){
        budgetsState.selectedBudget = selectedItem;
        document.querySelector('[data-modal="delete-budget-modal"]').innerHTML = createDeleteBudgetModalMarkup(selectedItem.category)
        document.querySelector('[data-modal="delete-budget-modal"]').classList.add('show-modal')
        initModal()
        document.querySelector('[data-delete="delete-budget"]').addEventListener('click', () => {
            document.querySelector('[data-modal="delete-budget-modal"]').classList.remove('show-modal')
            const budgetIndex = budgetsState.budgetSummary.indexOf(selectedItem)
            budgetsState.budgetSummary.splice(budgetIndex, 1);
 
            delete budgetsState.budgetTransactionsAmounts[selectedItem.category]
            delete budgetsState.budgetTransactions[selectedItem.category]
            budgetsState.budgetCategory = budgetsState.budgetCategory.filter(c => c !== selectedItem.category)
            saveBudget()
            setLocalStorage(data)
 
            document.querySelector('#budgets-summary').innerHTML = getBudgetSummary()
            document.querySelector('.budgets-card-wrapper').removeChild(btn.closest('[data-budget]'))
        })
    }
}
 
function openEditBudgetModal(btn){
    const clickedBudgetName = btn.closest('[data-budget]').dataset.budget
    const selectedItem = budgetsState.budgetSummary.find((item) => item.category.trim() === clickedBudgetName)
    if (selectedItem){
        budgetsState.selectedBudget = selectedItem
        budgetsState.themeSelected = selectedItem.theme
        budgetsState.categorySelected = selectedItem.category
 
        const editModal = document.querySelector('[data-modal="edit-budget-modal"]')
        editModal.querySelector('[data-dropdown-trigger="edit-budget-category"] span:last-child').textContent = selectedItem.category
        editModal.querySelector('[data-spend="spend-amount-edit"]').value = selectedItem.maximum
        editModal.querySelector('[data-dropdown-trigger="edit-budget-theme"] .color-dot').style.backgroundColor = selectedItem.theme
        editModal.querySelector('[data-dropdown-trigger="edit-budget-theme"] span:last-child').textContent = colorNameMap[selectedItem.theme] || selectedItem.theme
 
        editModal.classList.add('show-modal')
        initModal()
        disableExistingCategories(selectedItem.category)
        disableUsedThemes(selectedItem.theme)

    }
}
 
function handleThemeSelection(e){
    const colorItem = e.target.closest('[data-color]')
    const categoryItem = e.target.closest('[data-category]')
 
    if (colorItem){
        budgetsState.themeSelected = colorItem.dataset.color
        const dropdownMenu = colorItem.closest('[data-dropdown-menu]')
        const triggerName = dropdownMenu.dataset.dropdownMenu
        const triggerBtn = document.querySelector(`[data-dropdown-trigger="${triggerName}"]`)
        triggerBtn.querySelector('.color-dot').style.backgroundColor = budgetsState.themeSelected
        triggerBtn.querySelector('span:last-child').textContent = colorItem.textContent.trim()
        dropdownMenu.classList.remove('show-dropdown')
    }
 
    if (categoryItem){
        budgetsState.categorySelected = categoryItem.textContent.trim()
        const dropdownMenu = categoryItem.closest('[data-dropdown-menu]')
        const triggerName = dropdownMenu.dataset.dropdownMenu
        const triggerBtn = document.querySelector(`[data-dropdown-trigger="${triggerName}"]`)
        triggerBtn.querySelector('span').textContent = budgetsState.categorySelected
        dropdownMenu.classList.remove('show-dropdown')
    }
}

function renderBudgets(){
    document.querySelector('#budgets-summary').innerHTML = getBudgetSummary();
    document.querySelector('.budgets-card-wrapper').innerHTML = getBudgetCard();
    document.querySelector('.budgets-card-wrapper').addEventListener('click', (e) => {
        const deleteBudgetTriggerBtn = e.target.closest('[data-modal-trigger="delete-budget-modal"]')
        const editBudgetTriggerBtn = e.target.closest('[data-modal-trigger="edit-budget-modal"]')
        
        if (deleteBudgetTriggerBtn) openDeleteBudgetModal(deleteBudgetTriggerBtn)
        if (editBudgetTriggerBtn) openEditBudgetModal(editBudgetTriggerBtn)
    })
 
    document.querySelector('[data-modal="new-budget-modal"]').addEventListener('click', handleThemeSelection)
    document.querySelector('[data-modal="edit-budget-modal"]').addEventListener('click', handleThemeSelection)
    document.querySelector('[data-modal-trigger="new-budget-modal"]')?.addEventListener('click', () => {
        document.querySelector('[data-modal="new-budget-modal"]').classList.add('show-modal')
        budgetsState.themeSelected = ''
        budgetsState.categorySelected = ''
        disableExistingCategories()
        disableUsedThemes()
    })
 
    document.querySelector('#newBudgetForm').addEventListener('submit', (e) => {
        e.preventDefault()
        const category = budgetsState.categorySelected
        const maximum = parseFloat(document.querySelector('[data-spend="spend-amount-add"]').value)
        const theme = budgetsState.themeSelected
 
        if (!category || !maximum || !theme) return
 
        const newBudget = { category, maximum, theme }
        budgetsState.budgetSummary.push(newBudget)
        budgetsState.budgetCategory.push(category)
 
        const categoryTransactions = data.transactions.filter(item => item.category === category)
        budgetsState.budgetTransactions[category] = categoryTransactions
        budgetsState.budgetTransactionsAmounts[category] = categoryTransactions.map(item => item.amount)

        saveBudget()
        setLocalStorage(data)
 
        document.querySelector('#budgets-summary').innerHTML = getBudgetSummary()
        document.querySelector('.budgets-card-wrapper').innerHTML = getBudgetCard()
        document.querySelector('[data-modal="new-budget-modal"]').classList.remove('show-modal')
 
        initDropdown()
        initModal()
    })
 
    document.querySelector('#editBudgetForm').addEventListener('submit', (e) => {
        e.preventDefault()
        const category = budgetsState.categorySelected || budgetsState.selectedBudget.category
        const maximum = parseFloat(document.querySelector('[data-spend="spend-amount-edit"]').value)
        const theme = budgetsState.themeSelected || budgetsState.selectedBudget.theme
 
        const index = budgetsState.budgetSummary.findIndex(item => item.category === budgetsState.selectedBudget.category)
 
        if (category !== budgetsState.selectedBudget.category){
            const newCategoryTransactions = data.transactions.filter(item => item.category === category)
            budgetsState.budgetTransactions[category] = newCategoryTransactions
            budgetsState.budgetTransactionsAmounts[category] = newCategoryTransactions.map(item => item.amount)
            delete budgetsState.budgetTransactions[budgetsState.selectedBudget.category]
            delete budgetsState.budgetTransactionsAmounts[budgetsState.selectedBudget.category]
            
            budgetsState.budgetCategory[budgetsState.budgetCategory.indexOf(budgetsState.selectedBudget.category)] = category
          }
          
          budgetsState.budgetSummary[index] = { category, maximum, theme }
          saveBudget()
          setLocalStorage(data)
          
          document.querySelector('#budgets-summary').innerHTML = getBudgetSummary()
          document.querySelector('.budgets-card-wrapper').innerHTML = getBudgetCard()
          document.querySelector('[data-modal="edit-budget-modal"]').classList.remove('show-modal')
 
        initDropdown()
        initModal()
    })
}

export function initBudgets() {
      if (!document.getElementById('budgets')) return;
      renderBudgets()
      initDropdown()
      initModal()
}