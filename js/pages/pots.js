import { initDropdown } from "../components/dropdowns.js";
import { initModal } from "../components/modals.js";
import { formatAmount } from "../utility.js";
import { getLocalStorage, setLocalStorage } from "../localStorage.js";

const data = await getLocalStorage();

const potState = {
    pots: [],
    themeSelected: '',
    selectedPot: undefined,

}

potState.pots = data.pots;
function generatePotsMarkup(pots = potState.pots){
    return pots.map((item) => {
        return `<div class="card card--compact pots-card" data-pot="${item.name.trim()}">
          <div class="pots-card-heading">
            <div>
              <div class="color-dot" style="background-color: ${item.theme};" ></div>
              <h3>${item.name}</h3>
            </div>
            <div class="dropdown-container">
              <button data-dropdown-trigger="edit-pot-dropdown">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M9.75 8C9.75 8.34612 9.64736 8.68446 9.45507 8.97225C9.26278 9.26003 8.98947 9.48434 8.6697 9.61679C8.34993 9.74924 7.99806 9.7839 7.65859 9.71637C7.31913 9.64885 7.00731 9.48218 6.76256 9.23744C6.51782 8.9927 6.35115 8.68087 6.28363 8.34141C6.2161 8.00194 6.25076 7.65007 6.38321 7.3303C6.51567 7.01053 6.73997 6.73722 7.02775 6.54493C7.31554 6.35264 7.65388 6.25 8 6.25C8.46413 6.25 8.90925 6.43437 9.23744 6.76256C9.56563 7.09075 9.75 7.53587 9.75 8ZM3 6.25C2.65388 6.25 2.31554 6.35264 2.02775 6.54493C1.73997 6.73722 1.51566 7.01053 1.38321 7.3303C1.25076 7.65007 1.2161 8.00194 1.28363 8.34141C1.35115 8.68087 1.51782 8.9927 1.76256 9.23744C2.00731 9.48218 2.31913 9.64885 2.65859 9.71637C2.99806 9.7839 3.34993 9.74924 3.6697 9.61679C3.98947 9.48434 4.26278 9.26003 4.45507 8.97225C4.64737 8.68446 4.75 8.34612 4.75 8C4.75 7.53587 4.56563 7.09075 4.23744 6.76256C3.90925 6.43437 3.46413 6.25 3 6.25ZM13 6.25C12.6539 6.25 12.3155 6.35264 12.0278 6.54493C11.74 6.73722 11.5157 7.01053 11.3832 7.3303C11.2508 7.65007 11.2161 8.00194 11.2836 8.34141C11.3512 8.68087 11.5178 8.9927 11.7626 9.23744C12.0073 9.48218 12.3191 9.64885 12.6586 9.71637C12.9981 9.7839 13.3499 9.74924 13.6697 9.61679C13.9895 9.48434 14.2628 9.26003 14.4551 8.97225C14.6474 8.68446 14.75 8.34612 14.75 8C14.75 7.77019 14.7047 7.54262 14.6168 7.3303C14.5288 7.11798 14.3999 6.92507 14.2374 6.76256C14.0749 6.60006 13.882 6.47116 13.6697 6.38321C13.4574 6.29526 13.2298 6.25 13 6.25Z"
                    fill="#B3B3B3" />
                </svg>
              </button>
              <ul data-dropdown-menu="edit-pot-dropdown" class="dropdown-list dropdown-list--compact dropdown--compact">
                <li class="dropdown-item" data-modal-trigger="edit-pot-modal" data-edit="edit-pot">Edit Pot</li>
                <li class="dropdown-item btn--delete" data-modal-trigger="delete-pot-modal">Delet Pot</li>
              </ul>
            </div>
          </div>
          <div class="pots-progress-wrapper">
            <div class="flex-between">
              <small>Total Saved</small>
              <h2 data-total="total-saved">${formatAmount(item.total, false)}</h2>
            </div>
            <div class="bar pots-progress">
              <div class="bar--inner" style="background-color: ${item.theme}; width: ${(item.total/item.target) * 100}%"></div>
            </div>
            <div class="flex-between">
              <small data-progress="progress">${((item.total/item.target) * 100).toFixed(2)}%</small>
              <small data-target="target-amount">Target of ${formatAmount(item.target, false)}</small>
            </div>
          </div>
          <div class="pots-card-btns">
            <button data-modal-trigger="add-modal" data-add="add-money" class="btn pots-btns">+ Add Money</button>
            <button data-modal-trigger="withdraw-modal" data-withdraw="withdraw" class="btn pots-btns">Withdraw</button>
          </div>
        </div>`

    }).join('')
}
function handleThemeSelection(e) {
  const color = e.currentTarget
  potState.themeSelected = color.dataset.color
  const themeTarget = color.parentElement.dataset.dropdownMenu === 'add-pot-theme' ? 'add-pot-theme' : 'edit-pot-theme'
  document.querySelector(`[data-dropdown-trigger="${themeTarget}"]`).innerHTML = `
    <div class="form__theme">
      <span class="color-dot" style="background-color: ${potState.themeSelected}"></span>
      <span>${color.textContent}</span>
    </div>
    <img src="./assets/images/icon-caret-down.svg" alt="">
  `
  color.parentElement.classList.remove('show-dropdown')
}
function createAddAmountModalMarkup({name, theme, total, target}){
    return `<div class="card modal__card">
        <div class="card-heading">
          <h1>Add to '${name}'</h1>
          <button data-collapse-trigger="collapse-add-pot"><img src="./assets/images/icon-close-modal.svg" alt=""></button>
        </div>
        <small>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus hendrerit. Pellentesque aliquet nibh
          nec urna. In nisi neque, aliquet.</small>
        <div class="flex-between">
          <small>New Amount</small>
          <h2>${formatAmount(0, false)}</h2>
        </div>
        <div class="bar pots-progress">
          <div data-progress="add-pot-progress" class="bar--inner" style="background-color: ${theme}; width: ${(total/target) * 100}%">
          </div>
          <div class="widthdraw-form-progress"> </div>
        </div>
        <div class="flex-between">
          <small data-percentage="add-pot-percentage">${((total/target) * 100).toFixed(2)}%</small>
          <small>Target of ${formatAmount(target, false)}</small>
        </div>
        <form class="form__wrapper" id="addMoneyForm">
          <label for="add-pot">Amount to Add</label>
          <input data-add="add-pot-amount" class="input" type="number" name="add-pot" id="add-pot" placeholder="$">
          <button type="submit" data-submit="add-pot-btn" class="btn btn--dark">Confirm Addition</button>
        </form>

      </div>`
}
function openAddAmountModal(btn){
    const { selectedItem, index, selectedPot } = getSelectedPot(btn)
    if (selectedItem){
        potState.selectedPot = selectedItem
        
        document.querySelector('[data-modal="add-modal"]').innerHTML = createAddAmountModalMarkup(selectedItem)
        initModal()
        const progress = selectedItem.total;

        document.querySelector('[data-add="add-pot-amount"]').addEventListener('input', (e) =>{
            const currentProgress = parseFloat(((progress/selectedItem.target)*100).toFixed(2));
            const newProgress = parseFloat(((e.target.value/selectedItem.target)*100).toFixed(2));
            
            document.querySelector('[data-modal="add-modal"] div div h2').innerHTML = formatAmount(e.target.value, false); 
            document.querySelector('[data-progress="add-pot-progress"]').style.borderTopRightRadius = `0`
            document.querySelector('[data-progress="add-pot-progress"]').style.borderBottomRightRadius = `0`
            document.querySelector('[data-percentage="add-pot-percentage"]').innerText = `${newProgress > 100 ? 100 : newProgress}%`;
            document.querySelector('[data-percentage="add-pot-percentage"]').style.color = 'var(--color-green)';
            document.querySelector('.widthdraw-form-progress').style.backgroundColor = 'var(--color-grey-900)';
            document.querySelector('.widthdraw-form-progress').style.width = `${(newProgress + currentProgress) > 100 ? 100 - currentProgress : newProgress}%`;
            document.querySelector('.widthdraw-form-progress').style.left = `${currentProgress}%`;
        })
        document.querySelector('#addMoneyForm').addEventListener('submit', (e) => {
            e.preventDefault()
            const addPotMoney = parseFloat(document.querySelector('[data-add="add-pot-amount"]').value);
            const updatedProgress = (((progress + addPotMoney) / selectedItem.target)*100).toFixed(2);
            const progressBar = selectedPot.querySelector('.pots-progress-wrapper .pots-progress .bar--inner');
            const totalSaved = selectedPot.querySelector('.pots-progress-wrapper [data-total="total-saved"]');
            const updatedPercentage = selectedPot.querySelector('.pots-progress-wrapper .flex-between [data-progress="progress"]');
            console.log(selectedPot)
            
            totalSaved.innerHTML = formatAmount((progress + addPotMoney), false);
            progressBar.style.width = `${updatedProgress > 100 ? 100 : updatedProgress}%`
            updatedPercentage.innerHTML = `${updatedProgress > 100 ? 100 : updatedProgress}%`

            potState.pots[index].total = progress + addPotMoney;
            savePots()            
            document.querySelector('[data-modal="add-modal"]').classList.remove('show-modal')
        })
    }
}

function createWithdrawAmountModalMarkup({name, theme, total, target}){
    return `<div class="card modal__card">
        <div class="card-heading">
          <h1>Withdraw from '${name}'</h1>
          <button data-collapse-trigger="collapse-withdraw-pot"><img src="./assets/images/icon-close-modal.svg" alt=""></button>
        </div>
        <small>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus hendrerit. Pellentesque aliquet nibh
          nec urna. In nisi neque, aliquet.</small>
        <div class="flex-between">
          <small>New Amount</small>
          <h2>${formatAmount(0, false)}</h2>
        </div>
        <div class="bar pots-progress">
          <div data-progress="pot-withdraw-progress" class="bar--inner" style="background-color: ${theme}; width: ${(total/target) * 100}%">
          </div>
          <div class="widthdraw-form-progress"> </div>
        </div>
        <div class="flex-between">
          <small data-percentage="percentage">${((total/target) * 100).toFixed(2)}%</small>
          <small>Target of ${formatAmount(target, false)}</small>
        </div>
        <form id="withdrawPotForm" class="form__wrapper">
          <label for="withdraw">Amount to Withdraw</label>
          <input data-withdraw="pot-withdraw-amount" class="input" type="number" step="0.01" name="withdraw" id="withdraw"
            placeholder="$">
            <button type="submit" data-confirm="confirm-withdraw-pot" class="btn btn--dark">Confirm Withdraw</button>
        </form>
       </div>`
}

function openWithdrawAmountModal(btn){
    const { clickedPotName, selectedItem, index, selectedPot } = getSelectedPot(btn)

    if (selectedItem){
        const progress = selectedItem.total;
        potState.selectedPot = selectedItem
        document.querySelector('[data-modal="withdraw-modal"]').innerHTML = createWithdrawAmountModalMarkup(selectedItem)
        initModal()
        document.querySelector('[data-withdraw="pot-withdraw-amount"]').addEventListener('input', (e) =>{
            const currentProgress = ((progress/selectedItem.target)*100).toFixed(2);
            const deductedProgress = ((e.target.value/selectedItem.target)*100).toFixed(2);
            const updatedProgress = currentProgress - deductedProgress;
            if (e.target.value <= progress){
                document.querySelector('[data-modal="withdraw-modal"] div div h2').innerHTML = formatAmount(e.target.value, false); 
                document.querySelector('[data-progress="pot-withdraw-progress"]').style.width = `${updatedProgress}%`
                document.querySelector('[data-progress="pot-withdraw-progress"]').style.borderTopRightRadius = `0`
                document.querySelector('[data-progress="pot-withdraw-progress"]').style.borderBottomRightRadius = `0`
                document.querySelector('[data-percentage="percentage"]').innerText = `${deductedProgress}%`;
                document.querySelector('[data-percentage="percentage"]').style.color = 'var(--color-red)';
                document.querySelector('.widthdraw-form-progress').style.backgroundColor = 'var(--color-red)';
                document.querySelector('.widthdraw-form-progress').style.width = `${deductedProgress}%`;
                document.querySelector('.widthdraw-form-progress').style.left = `${updatedProgress}%`;
            }
        })
        document.querySelector('#withdrawPotForm').addEventListener('submit', (e) => {
            e.preventDefault()
            const potWithdrawAmount = document.querySelector('[data-withdraw="pot-withdraw-amount"]').value;
            const updateProgress = (((progress - potWithdrawAmount) / selectedItem.target)*100).toFixed(2);
            const progressBar = selectedPot.querySelector('.pots-progress-wrapper .pots-progress .bar--inner');
            const totalSaved = selectedPot.querySelector('.pots-progress-wrapper [data-total="total-saved"]');
            const updatedPercentage = selectedPot.querySelector('.pots-progress-wrapper .flex-between [data-progress="progress"]')
            
            totalSaved.innerHTML = formatAmount((progress - potWithdrawAmount), false);
            progressBar.style.width = `${updateProgress}%`
            updatedPercentage.innerHTML = `${updateProgress}%`

            document.querySelector('[data-modal="withdraw-modal"]').classList.remove('show-modal');

            potState.pots[index].total = progress - potWithdrawAmount;
            savePots()
        })
    }
}
function createDeletePotModalMarkup(name){
    return `<div class="card modal__card">
        <div class="card-heading">
          <h1>Delete '${name}'?</h1>
          <button data-collapse-trigger="collapse-delete-pot"><img src="./assets/images/icon-close-modal.svg" alt=""></button>
        </div>
        <small>Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will
          be removed forever.</small>
        <button data-delete-trigger="delete-pot" class="btn btn--danger">Yes, Confirm Deletion</button>
        <button data-collapse-trigger="collapse-delete-pot" class="btn--transparent">No, Go Back</button>
      </div>`
}
function openDeletePotModal(btn){
  const { clickedPotName, selectedItem, index, selectedPot } = getSelectedPot(btn)
  if (selectedItem){
      potState.selectedPot = selectedItem;
      document.querySelector('[data-modal="delete-pot-modal"]').innerHTML = createDeletePotModalMarkup(selectedItem.name)
      initModal()
      document.querySelector('[data-delete-trigger="delete-pot"]').addEventListener('click', () => {
          document.querySelector('[data-modal="delete-pot-modal"]').classList.remove('show-modal')
          const potIndex = potState.pots.indexOf(selectedItem)
          potState.pots.splice(potIndex, 1);
          savePots()
          document.querySelector('.pots-section').removeChild(btn.closest('[data-pot]'))
    })
  }
}

function editPotCard(btn, theme, target, name){
  const { clickedPotName, selectedItem, index, selectedPot } = getSelectedPot(btn)

  if (selectedItem){
    selectedPot.querySelector(`.pots-card-heading div .color-dot`).style.backgroundColor = theme;
    selectedPot.querySelector(`.pots-card-heading div h3`).innerHTML = name;
    selectedPot.querySelector(`.pots-progress-wrapper .flex-between [data-target="target-amount"]`).innerHTML = `Target of ${formatAmount(target, false)}`;
    selectedPot.querySelector(`.pots-progress-wrapper .flex-between h2`).innerHTML = formatAmount(selectedItem.total, false); 
    selectedPot.querySelector('.pots-progress-wrapper .flex-between [data-progress="progress"]').innerText = `${((selectedItem.total/target) * 100).toFixed(2)}%`;
    selectedPot.querySelector('.pots-progress-wrapper .pots-progress .bar--inner').style.backgroundColor = `${theme}`;
    selectedPot.querySelector('.pots-progress-wrapper .pots-progress .bar--inner').style.width = `${((selectedItem.total/target) * 100).toFixed(2)}%`;
    btn.closest('[data-pot]').dataset.pot = name;
  }
  potState.pots[index].name = name;
  potState.pots[index].target = target;
  potState.pots[index].theme = theme;
  savePots()

  document.querySelector('[data-modal="edit-pot-modal"]').classList.remove('show-modal')  
}
function getSelectedPot(btn) {
  const selectedPot = btn.closest('[data-pot]')
  const clickedPotName = selectedPot?.dataset?.pot ?? '' // safe access in case DOM shape changes

  const selectedItem = potState.pots.find((item) => item.name.trim() === clickedPotName)

  if (!selectedItem) {
    // No matching pot found — return a clear result so callers can handle it
    return { clickedPotName, selectedItem: null, index: -1, selectedPot }
  }

  // Now safe to access selectedItem.name because we know it exists
  const index = potState.pots.findIndex((pot) => pot.name === selectedItem.name)

  return { clickedPotName, selectedItem, index, selectedPot }
}
function savePots() {
  data.pots = potState.pots
  setLocalStorage(data)
}
function renderPotsPage(){
    document.querySelector('.pots-section').innerHTML = generatePotsMarkup();
    
    document.querySelector('.pots-section').addEventListener('click', (e) => {
        const addMoneyTriggerBtn = e.target.closest('[data-modal-trigger="add-modal"]')
        const deletePotTriggerBtn = e.target.closest('[data-modal-trigger="delete-pot-modal"]')
        const withdrawMoneyTriggerBtn = e.target.closest('[data-modal-trigger="withdraw-modal"]')
        
        if (addMoneyTriggerBtn) openAddAmountModal(addMoneyTriggerBtn)
        if (deletePotTriggerBtn) openDeletePotModal(deletePotTriggerBtn)
        if (withdrawMoneyTriggerBtn) openWithdrawAmountModal(withdrawMoneyTriggerBtn)
    })

    document.querySelectorAll('[data-color]').forEach((color) => color.addEventListener('click', handleThemeSelection))
    
    document.querySelector('#newPotForm').addEventListener('submit', (e) => {
        e.preventDefault()
        const inputData = {
            target: document.querySelector('[data-target="pot-target"]').value,
            total: 0,
            name: document.querySelector('[data-name="pot-name-add"]').value,
            theme: potState.themeSelected
        }
        potState.pots.push(inputData)
        savePots()
        document.querySelector('.pots-section').insertAdjacentHTML('beforeend', generatePotsMarkup([inputData]))
        document.querySelector('[data-modal="new-pot-modal"]').classList.remove('show-modal')

        initDropdown()
        initModal()
    })
    document.querySelector('#editPotForm').addEventListener('submit', (e) => {
      e.preventDefault()
      const name = document.querySelector('[data-name="pot-name-edit"]').value;
      const target = document.querySelector('[data-target="edit-target"]').value;
      const btn = document.querySelector('[data-modal-trigger="edit-pot-modal"]');
      editPotCard(btn ,potState.themeSelected, target, name, 0)
    })
    initDropdown()
    initModal()
}
export function initPots() {
    if (!document.getElementById('pots')) return;
    renderPotsPage()

}