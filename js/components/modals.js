function renderModal(e){
    const modals = document.querySelectorAll("[data-modal]");
    modals.forEach((modal) => {
        if (e.currentTarget.dataset.modalTrigger === modal.dataset.modal){
            modal.classList.toggle('show-modal')
        } else{
            modal.classList.remove('show-modal')
        }
    })
}

function collapseModal(e){
    const closeModal = document.querySelectorAll("[data-collapse]");
    closeModal.forEach((modal) => {
        if (e.currentTarget.dataset.collapseTrigger === modal.dataset.collapse){
            modal.classList.remove('show-modal')
        }
    })
}

export function initModal(){
    const modalBtn = document.querySelectorAll("[data-modal-trigger]");
    const collapseBtn = document.querySelectorAll("[data-collapse-trigger]");
    modalBtn.forEach((btn) => btn.addEventListener('click', renderModal))
    collapseBtn.forEach((btn) => btn.addEventListener('click', collapseModal))
}