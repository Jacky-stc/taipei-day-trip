import * as view from "./view.js";
import * as model from "./model.js";

model.fetchUrl("/api/member", "GET", view.getOrderList);

view.mainResize();

const orderListOuter = document.querySelector("#order-list");
const orderList = document.querySelector(".order-list");
const orderListArrow = document.querySelector("#order-list .arrow");
orderListOuter.addEventListener("click", () => {
  orderList.classList.toggle("expanded");
  orderListArrow.classList.toggle("rotate");
});
const profileOuter = document.querySelector("#profile");
const profile = document.querySelector(".profile");
profileOuter.addEventListener("click", () => {
  profile.classList.toggle("expanded");
});
const cameraIcon = document.querySelector(".camera-icon");
const uploadImg = document.querySelector(".upload-img");
const memberImg = document.querySelector(".member-img");
cameraIcon.addEventListener("click", () => {
  uploadImg.click();
});
uploadImg.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener("load", () => {
    const dataURL = reader.result;
    memberImg.style.backgroundImage = `url(${dataURL})`;
  });
});

async function getObjectFromS3() {
  const fetchData = await fetch("/api/member/s3", { method: "GET" });
  const fetchResponse = await fetchData.json();
  if (fetchResponse.data === null) {
    return;
  } else {
    memberImg.style.backgroundImage = `url("${fetchResponse.data}")`;
  }
}
getObjectFromS3();

const memberName = document.querySelector(".name");
const memberBirth = document.querySelector(".birth");
const memberGender = document.querySelector(".gender");
const memberPhone = document.querySelector(".phone");
const memberEmail = document.querySelector(".email");

async function getMemberInfo() {
  const fetchData = await fetch("api/member/info", { method: "GET" });
  const fetchResponse = await fetchData.json();
  memberName.value = fetchResponse.member.name;
  memberBirth.value = fetchResponse.member.birth;
  memberGender.value = fetchResponse.member.gender;
  memberPhone.value = fetchResponse.member.phone;
  memberEmail.value = fetchResponse.member.email;
}
getMemberInfo();

function storeMemberInfo() {
  const memberInfo = {
    name: memberName.value,
    birth: memberBirth.value,
    gender: memberGender.value,
    phone: memberPhone.value,
    email: memberEmail.value,
  };
  const loader = document.querySelector(".loader");
  loader.style.visibility = "visible";
  async function postMemberInfo() {
    const formData = new FormData();
    formData.append("file", uploadImg.files[0]);
    const fetchS3Data = await fetch("/api/member/s3", {
      method: "POST",
      body: formData,
    });
    if (fetchS3Data.status !== 200) {
      loader.style.visibility = "hidden";
      view.showHint("儲存失敗");
      return;
    }
    const fetchMemberData = await fetch("/api/member/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberInfo),
    });
    if (fetchMemberData.status !== 200) {
      loader.style.visibility = "hidden";
      view.showHint("儲存失敗");
    } else {
      loader.style.visibility = "hidden";
      view.showHint("儲存成功");
    }
  }
  postMemberInfo();
}
const storeBtn = document.querySelector(".store-btn");
storeBtn.addEventListener("click", () => {
  storeMemberInfo();
});
