import { v4 as uuidv4 } from "uuid";
import isEmail from 'validator/lib/isEmail';

const fillForm = (targets, sum, label) => {
  return `
    <input type="hidden" name="receiver" value="4100110727803322" />
    <input
      type="hidden"
      name="formcomment"
      value="Изучение английского по сериалам"
    />
    <input
      type="hidden"
      name="short-dest"
      value="Изучение английского по сериалам"
    />
    <input type="hidden" name="label" value="${label}" />
    <input type="hidden" name="quickpay-form" value="donate" />
    <input type="hidden" name="targets" value="${targets}" />
    <input type="hidden" name="sum" value="${sum}" data-type="number" />
    <input type="radio" name="paymentType" value="AC" checked />
  `;
};

const yandexFormEl = document.createElement("form");
yandexFormEl.style.display = "none";
yandexFormEl.action = "https://money.yandex.ru/quickpay/confirm.xml";
yandexFormEl.method = "POST";

const formEl = document.querySelector(".form");
const emailInputEl = document.querySelector(".form__email");
const nameInputEl = document.querySelector(".form__name");
const submitBtnEl = document.querySelector(".form__button");
const alertBLockEl = document.querySelector(".form__alert")

const closeBtnEl = document.querySelector(".form__close");
const closeOrderBtnEl = document.querySelector(".form__order-close");
const handleCloseFormBtnClick = () => {
  formEl.style.display = "none";
}
closeBtnEl.addEventListener("click", handleCloseFormBtnClick);
closeOrderBtnEl.addEventListener("click", handleCloseFormBtnClick);

const buyBtnEl = document.querySelectorAll(".buy-btn > button");
const handleBuyBtnClick = () => {
  formEl.style.display = "block";
}
[...buyBtnEl].forEach(el => el.addEventListener("click", handleBuyBtnClick));

let alertTimer;

formEl.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    clearInterval(alertTimer);

    submitBtnEl.innerHTML = '<div class="lds-ring"><div></div><div></div><div></div><div></div></div> Идет обработка запроса'

    emailInputEl.disabled = true;
    emailInputEl.style.border = "1px solid black";
    nameInputEl.disabled = true;
    submitBtnEl.disabled = true;

    closeBtnEl.removeEventListener("click", handleCloseFormBtnClick);
    closeOrderBtnEl.removeEventListener("click", handleCloseFormBtnClick);
    
    if (!isEmail(emailInputEl.value)) {
      throw new Error('Пожалуйста, введите валидный email.');
    }
    const label = uuidv4();

    const dataToSend = {
      email: emailInputEl.value,
      name: nameInputEl.value,
      label,
    };

    const response = await fetch(
      `https://misty-momentous-windscreen.glitch.me/api/v1/payment/create`,
      {
        body: JSON.stringify(dataToSend),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }
    );

    if (response.ok) {
      alertBLockEl.classList.remove("form__alert_red");
      alertBLockEl.classList.add("form__alert_green");
      alertBLockEl.textContent = "Спасибо! Заказ оформлен. Идет переход к оплате...";
      alertBLockEl.style.display = "block";

      yandexFormEl.innerHTML = fillForm(
        "Курс английского по сериалу Downton Abbey",
        2,
        label
      );
      document.body.appendChild(yandexFormEl);
      yandexFormEl.submit();
    } else {
      throw new Error("Что-то пошло не так, попробуйте повторить позже.")
    }
  } catch (error) {
    submitBtnEl.innerHTML = "Купить";
    emailInputEl.disabled = false;
    nameInputEl.disabled = false;
    submitBtnEl.disabled = false;
    closeBtnEl.addEventListener("click", handleCloseFormBtnClick);
    closeOrderBtnEl.addEventListener("click", handleCloseFormBtnClick);

    alertBLockEl.classList.add("form__alert_red");
    alertBLockEl.textContent = error.message;
    alertBLockEl.style.display = "block";

    if (error.message === "Пожалуйста, введите валидный email.") {
      emailInputEl.style.border = "2px solid #ff2727";
    }

    alertTimer = setInterval(() => {
      alertBLockEl.style.display = "none";
    }, 3000);
  }
});
