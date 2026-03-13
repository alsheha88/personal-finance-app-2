// Minimize sideBar
const minimizeBtn = document.querySelector('[data-minimize]');
const showNavBtn = document.querySelector('#show-nav');
function toggleNav(e){
    console.log(showNavBtn)
    if (e.currentTarget === minimizeBtn){
        document.querySelector('nav').classList.add('collapse');
        document.querySelector('#show-nav').classList.add('show-nav')
    } else if (e.currentTarget === showNavBtn){
        document.querySelector('nav').classList.remove('collapse');
        document.querySelector('#show-nav').classList.remove('show-nav')
    }
}
// Add in init function
export function initNavBar(){
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 800){
            document.querySelector('#show-nav').classList.remove('show-nav');
            document.querySelector('nav').classList.remove('collapse');
        }
        
    })
    showNavBtn.addEventListener('click', toggleNav)
    minimizeBtn.addEventListener('click', toggleNav)
}
