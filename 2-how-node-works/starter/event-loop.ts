import {readFile} from 'fs';


readFile('text-file.txt', () => {
  console.log('I/O finished');
});

console.log('hELLO FROM THE TOP-LEVEL CODE');