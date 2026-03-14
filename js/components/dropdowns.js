
function toggleDropdown(e){
    const dropdown = e.currentTarget.closest('.dropdown-container').querySelector('[data-dropdown-menu]');
    dropdown.classList.toggle('show-dropdown')
    
    // close all other dropdowns
    document.querySelectorAll('[data-dropdown-menu]').forEach((list) => {
        if (list !== dropdown) list.classList.remove('show-dropdown')
    })
}

export function initDropdown(){
    const dropdownBtns = document.querySelectorAll('[data-dropdown-trigger]');
    dropdownBtns.forEach((btn) => btn.addEventListener('click', toggleDropdown))

}
