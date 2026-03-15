// Minimize sideBar
const minimizeBtn = document.querySelector('[data-minimize]');
function toggleNav(e){
    if (e.currentTarget === minimizeBtn){
        document.querySelector('nav').classList.add('collapse');
    }
}
export function initNavBar(){
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 800){
            document.querySelector('#show-nav').classList.remove('show-nav');
            document.querySelector('nav').classList.remove('collapse');
        }
    })

    if (minimizeBtn){
        minimizeBtn.addEventListener('click', toggleNav)
    }
}
