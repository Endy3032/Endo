/* eslint-disable @typescript-eslint/ban-types */
declare global {
  interface Console {
    botLog: Function
    localLog: Function
    tagLog: Function
    localTagLog: Function
  }
}

export {}