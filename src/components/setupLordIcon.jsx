import { defineElement } from "@lordicon/element";
import lottie from "lottie-web";

// Mendefinisikan lord-icon dan memuat animasi hanya sekali
export const setupLordIcon = () => {
  defineElement(lottie.loadAnimation);
};