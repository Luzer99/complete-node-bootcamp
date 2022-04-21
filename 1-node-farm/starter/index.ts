// //BLOCKING, SYNCHRONOUS WAY
// import { readFileSync, writeFileSync } from "fs";

// const textIn = readFileSync("./txt/input.txt", "utf-8");
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

// writeFileSync("./txt/output.txt", textOut);

// console.log("File written!");

// Non-blocking, asynchronous way
import { readFile, writeFile } from "fs/promises";

const test = async () => {
  try {
    const fileName = await readFile("./txt/start.txt", "utf-8");

    const txt = await readFile(`./txt/${fileName}.txt`, "utf-8");
    console.log(txt);

    const txt2 = await readFile(`./txt/append.txt`, "utf-8");
    console.log(txt2);

    await writeFile("./txt/final.txt", `${txt}\n${txt2}`, "utf-8");
    console.log(`Your file has been written 😊`);
  } catch (err) {
    console.log(err);
  }
};

test();
