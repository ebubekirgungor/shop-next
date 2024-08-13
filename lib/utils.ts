import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

function titleToUrl(title: string) {
  return title
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u");
}

function birthDateRegex(field: string, value: string) {
  if (field === "day") {
    return (
      value === "" ||
      (value.length <= 2 && value.match(/^(0[1-9]|[12][0-9]|3[01]|\d)$/))
    );
  } else if (field === "month") {
    return (
      value === "" || (value.length <= 2 && value.match(/^(0[1-9]|1[0-2]|\d)$/))
    );
  } else if (field === "year") {
    return value === "" || (value.length <= 4 && value.match(/^\d{0,4}$/));
  }
}

function formatPhone(phoneNumber: string) {
  const value = phoneNumber
    .replace(/\D/g, "")
    .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)!;

  return !value[2]
    ? value[1]
    : "(" + value[1] + ") " + value[2] + (value[3] ? "-" + value[3] : "");
}

export { titleToUrl, birthDateRegex, formatPhone };
