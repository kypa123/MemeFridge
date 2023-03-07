import * as Api from '../api.js';


const test = document.getElementById('test');
console.log(test.textContent)


async function dataInsert(){
    try{
        const result = await Api.get('/users','')
        console.log(result)
        test.innerText = result[0].name
    }
    catch(err){
        console.log(err)
    }
}
dataInsert()