import * as view from "./view.js";
import * as model from "./model.js";

view.mainResize();

model.fetchUrl("/api/member", "GET", view.getOrderList);
model.fetchUrl("/api/member/s3", "GET", view.getObjectFromS3);
model.fetchUrl("/api/member/info", "GET", view.getMemberInfo);

const orderListOuter = document.querySelector("#order-list");
orderListOuter.addEventListener("click", () => {
  view.showOrderList();
});
const profileOuter = document.querySelector("#profile");
profileOuter.addEventListener("click", () => {
  view.showProfile();
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

const storeBtn = document.querySelector(".store-btn");
storeBtn.addEventListener("click", () => {
  storeMemberInfo();
});
function storeMemberInfo() {
  const memberName = document.querySelector(".name");
  const memberPhone = document.querySelector(".phone");
  const memberEmail = document.querySelector(".email");
  if (!view.checkRegex(model.nameRegex, memberName.value, "姓名欄位不能為空")) {
    return;
  }
  if (
    !view.checkRegex(model.phoneRegex, memberPhone.value, "不合法的手機格式")
  ) {
    return;
  }
  if (
    !view.checkRegex(model.emailRegex, memberEmail.value, "不合法的信箱格式")
  ) {
    return;
  }
  const memberInfo = model.getMemberInfo();
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
