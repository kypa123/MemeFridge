import * as Api from '../api.js';

document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    const modalButton = document.getElementById('content-upload-modal-button');
    const modal = modalButton.dataset.target;
    const target = document.getElementById(modal);
    modalButton.addEventListener('click',()=>{
        openModal(target);
    })
  
    // Add a click event on various child elements to close the parent modal
    const array = document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []
    array.forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      const e = event || window.event;
  
      if (e.keyCode === 27) { // Escape key
        closeAllModals();
      }
    });
  });



async function register(e){
  try{
    e.preventDefault();
    const form = new FormData(myForm);
    console.log('ㅎㅇㅎㅇ')
    const result = await fetch('/contents',{
      method:'POST',
      body:form
    })
    console.log(result);
  }
  catch(err){
    console.log(err)
  }
}

const myForm = document.querySelector('form')
myForm.addEventListener('submit',register);