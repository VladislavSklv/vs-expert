import css from './sass/index.scss';
import IMask from 'imask';

document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.querySelector('.open-modal');
    const modal = document.querySelector('.modal');
    const opacityBlock = document.querySelector('.opacity-block');
    const modalCross = document.querySelector('.cross_modal');
    const hamburger = document.querySelector('.hamburger');
    const navModal = document.querySelector('.navbar-modal');
    const navModalCross = document.querySelector('.cross_navbar-modal');
    const form = document.querySelector('form');
    const submitBtn = document.querySelector('#submit-btn');
    const inputPhone = document.querySelector('.input_phone');
    const inputFile = document.querySelector('.input_file');

    const mask = new IMask(inputPhone, {
        mask: '+7(000)000-00-00',
        lazy: false
    });

    // File Counter

    let label = inputFile.nextElementSibling,
        labelVal = label.querySelector('.field__file-fake').innerText;
  
    inputFile.addEventListener('change', function (e) {
        let countFiles = '';
        if (inputFile.files && inputFile.files.length >= 1)
            countFiles = inputFile.files.length;

        if (countFiles)
            label.querySelector('.field__file-fake').innerText = 'Выбрано файлов: ' + countFiles;
        else
            label.querySelector('.field__file-fake').innerText = labelVal;

        console.log(inputFile.files)
    });

    function openModal() {
        if(!modal.classList.contains('modal_active')) modal.classList.add('modal_active');
        if(!opacityBlock.classList.contains('opacity-block_active')) opacityBlock.classList.add('opacity-block_active');
    }

    function closeModal() {
        if(modal.classList.contains('modal_active')) modal.classList.remove('modal_active');
        if(opacityBlock.classList.contains('opacity-block_active')) opacityBlock.classList.remove('opacity-block_active');
    }

    function closeNavModal() {
        if(navModal.classList.contains('navbar-modal_active')) navModal.classList.remove('navbar-modal_active');
        if(opacityBlock.classList.contains('opacity-block_active')) opacityBlock.classList.remove('opacity-block_active');
    }

    function openNavModal() {
        if(!navModal.classList.contains('navbar-modal_active')) navModal.classList.add('navbar-modal_active');
        if(!opacityBlock.classList.contains('opacity-block_active')) opacityBlock.classList.add('opacity-block_active');
    }
    
    hamburger.addEventListener('click', () => {
        openNavModal();
    });

    openModalBtn.addEventListener('click', () => {
        openModal();
    });
    
    opacityBlock.addEventListener('click', () => {
        closeModal();
        closeNavModal();
    });
    
    modalCross.addEventListener('click', () => {
        closeModal();
    });

    navModalCross.addEventListener('click', () => {
        closeNavModal();
    });

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);
        let formData = new FormData(form);
        for (let i = 0; i < inputFile.files.length; i++) {
            formData.append('files[]', inputFile.files[i]);
        }

        if(error === 0) {
            modal.classList.add('_sending');
            let response = await fetch('./sendmail.php',{
                method: 'POST',
                body: formData
            })
            if(response.ok){
                let result = await response.json();
                if(result.success) {
                    form.reset();
                    label.querySelector('.field__file-fake').innerText = 'Файл не выбран';
                    modal.classList.remove('_sending');
                    closeModal();
                    alert('Заявка отправлена');
                } else {
                    alert('При отправке заявки произошла ошибка: ' + result.error);
                    form.reset();
                    label.querySelector('.field__file-fake').innerText = 'Файл не выбран';
                    modal.classList.remove('_sending');
                    closeModal();
                }              
            } else {
                alert('При отправке заявки произошла ошибка');
                form.reset();
                label.querySelector('.field__file-fake').innerText = 'Файл не выбран';
                modal.classList.remove('_sending');
                closeModal();
            }
        }
    }

    function formValidate(form){
        let error = 0;
        let formReq = document.querySelectorAll('.input');

        formReq.forEach(input => {
            input.classList.remove('input_validated');

            if(input.classList.contains('input_email')){
                if(emailTest(input)){
                    input.classList.add('input_validated');
                    error++;
                }
            } else if(input.classList.contains('input_name')){
                if(nameTest(input)){
                    input.classList.add('input_validated');
                    error++;
                }
            } else if(input.classList.contains('input_phone')){
                if(phoneTest(input)){
                    input.classList.add('input_validated');
                    error++;
                }
            } else if(input.classList.contains('input_text')){
                if(input.value.length < 3){
                    input.classList.add('input_validated');
                    error++;
                }
            }
        });

        return error;
    }

    function emailTest(input) {
        return !/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(input.value) || !input.value.length >=3;
    }

    function phoneTest(input) {
        return !/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(input.value) || !input.value.length >=3;
    }

    function nameTest(input) {
        return !/^[a-zA-Zа-яА-Я'][a-zA-Zа-яА-Я-' ]+[a-zA-Zа-яА-Я']?$/.test(input.value) || !input.value.length >=2;
    }

    submitBtn.addEventListener('click', (e) => formSend(e));

    
    const date = document.querySelector('#date');
    date.textContent = new Date().getFullYear();
})