import { differenceInSeconds } from "date-fns";

export const convertHexToRGB = (hex) => {
  // check if it's a rgba
  if (hex.match("rgba")) {
    let triplet = hex.slice(5).split(",").slice(0, -1).join(",");
    return triplet;
  }

  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");

    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }

    c = "0x" + c.join("");

    return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",");
  }
};

export function getTimeDifference(date) {
  let difference = differenceInSeconds(new Date(), date);

  if (difference < 60) return `${Math.floor(difference)} sec`;
  else if (difference < 3600) return `${Math.floor(difference / 60)} min`;
  else if (difference < 86400) return `${Math.floor(difference / 3660)} h`;
  else if (difference < 86400 * 30) return `${Math.floor(difference / 86400)} d`;
  else if (difference < 86400 * 30 * 12) return `${Math.floor(difference / 86400 / 30)} mon`;
  else return `${(difference / 86400 / 30 / 12).toFixed(1)} y`;
}

export function generateRandomId() {
  let tempId = Math.random().toString();
  let uid = tempId.substring(2, tempId.length - 1);
  return uid;
}

export function numberWithCommas(x = 0) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function hasAccess(permissions, permission) {
  if (permissions.includes(permission)) {
    return true;
  } else if (permissions.includes("superadmin") || permissions.includes("admin")) {
    return true;
  }
  return false;
}

export function inactiveStudents() {
  const trs = document.getElementsByTagName("tr");
  for (let i=1; i<trs.length; i++) {
    if (trs[i].innerHTML.includes("inactive")) {
      trs[i].classList.add("inactive");
    } else {
      trs[i].classList.remove("inactive");
    }
  }
}

export function completedStudents() {
  const trs = document.getElementsByTagName("tr");
  for (let i=1; i<trs.length; i++) {
    if (trs[i].innerHTML.includes("completed")) {
      trs[i].classList.add("completed");
    } else {
      trs[i].classList.remove("completed");
    }
  }
}

export const deleteDuplicate = (array, property) => {
  return array.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[property]).indexOf(obj[property]) === pos;
  });
};
