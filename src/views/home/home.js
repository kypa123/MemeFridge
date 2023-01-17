
let logo = document.getElementById('mainLogo')
logo.src = '/images/sadpepe.png';


logo.addEventListener('mouseover', changeLogo)
logo.addEventListener('mouseleave', getLogoBack)

async function changeLogo(){
    logo.src = '/images/pepe despair.jpg'
}

async function getLogoBack(){
    logo.src = '/images/sadpepe.png';
}