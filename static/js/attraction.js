import * as view from "./view.js";
import * as model from "./model.js";

let imgNow = 0;
let imgLength = 0;

const main = document.querySelector("main");
const nowHeight = document.body.scrollHeight;
main.style.minHeight = nowHeight - 253 + "px";

// 設定API URL
const attraction_id = window.location.pathname.replace("/attraction/", "");
const attractionIdUrl = "/api/attraction/" + attraction_id;

// 頁面載入
view.showLoader();
model.fetchUrl(attractionIdUrl, "get", view.imgPreload).then((data) => {
  imgLength = data.data.images.length;
});

let index = 0;
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
nextBtn.addEventListener("click", () => {
  dot();
  index++;
  carousel();
});
prevBtn.addEventListener("click", () => {
  dot();
  index--;
  carousel();
});
function carousel() {
  const imgNum = document.querySelectorAll(".inner img").length;
  if (index < 0) {
    index = imgNum - 1;
  } else if (index > imgNum - 1) {
    index = 0;
  }
  const outer = document.querySelector(".outer");
  const inner = document.querySelector(".inner");
  let width = getComputedStyle(outer).width;
  width = Number(width.slice(0, -2));
  inner.style.left = `${index * width * -1}px`;

  const dot = document.querySelectorAll(".dot");
  dot[index].style.backgroundColor = "#000";
}
function dot() {
  const dot = document.querySelectorAll(".dot");
  dot[index].style.backgroundColor = "#fff";
}

view.orderDateLimit();

// 選擇上半天行程
document.querySelector(".morning_reservation").addEventListener("click", () => {
  view.morningReservation();
});
// 選擇下半天行程
document
  .querySelector(".afternoon_reservation")
  .addEventListener("click", () => {
    view.afternoonReservation();
  });

// 預定導覽行程
const bookingBtn = document.querySelector(".booking_btn");
bookingBtn.addEventListener("click", () => {
  const bookingInfo = model.getBookingInfo();
  async function booking() {
    const hintContainer = document.querySelector(".hint_container");
    const hint = document.querySelector(".hint");
    const fetchData = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(bookingInfo),
    });
    const fetchResponse = await fetchData.json();
    if (fetchData.status === 200) {
      location.href = "/booking";
    }
    if (fetchData.status === 403) {
      hint.textContent = "預訂失敗，請輸入正確的信息";
      hintContainer.style.display = "block";
      setTimeout(() => {
        hintContainer.style.display = "none";
      }, 2000);
    }
    if (fetchData.status === 500) {
      hint.textContent = "伺服器發生錯誤";
      hintContainer.style.display = "block";
      setTimeout(() => {
        hintContainer.style.display = "none";
      }, 2000);
      location.reload();
    }
  }
  model.fetchUrl("/api/user/auth", "get", view.userCheck).then((data) => {
    if (data.data === null) {
      view.showLoginArea();
    } else {
      booking();
    }
  });
});
