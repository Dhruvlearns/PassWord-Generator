/** custom attribute ko fetch krnw ka tarika */
const inputSlider=document.querySelector("[data-lengthSlider]"); 
const lengthDisplay=document.querySelector( "[data-lengthNumber]");
const passowrdDisplay=document.querySelector("[data-passwordDisplay]")
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#number");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='!@#$%^&**()_+~<>?{}[]'

let password="";
let passwordlength=10;
let checkcount=0;
handleSlider();
//set  strength circle to grey
setIndicator("#ccc");

//setpassword length
function handleSlider(){
    inputSlider.value=passwordlength;
    lengthDisplay.innerText=passwordlength;

    const min=inputSlider.min;
    const max=inputSlider.max;

    inputSlider.style.backgroundSize=((passwordlength-min)*100/(max-min))+ "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxshadow ='0px  0px  12px 1px ${color}'
}

function getRndInteger(min,max){
        return Math.floor(Math.random()* (max-min)) + min
}

function generateRandomInteger(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
     hasLower=false;
     hasUpper=false;
     hasNum=false;
     hasSym=false;

     if(uppercaseCheck.checked) hasUpper=true;

     if(lowercaseCheck.checked) hasLower=true;

     if(numbersCheck.checked) hasNum=true;

     if(symbolsCheck.checked) hasSym=true;


     if(hasLower && hasLower &&hasNum && passwordlength>=8){
        setIndicator("#0f0")
     }
     else if((hasLower || hasUpper) && (hasNum || hasSym)){
        setIndicator('#ff0')
     }
     else{
        setIndicator("#f00")
     }
}

async function copyContent(){
    try{
   await  navigator.clipboard.writeText(passowrdDisplay.value);
   copyMsg.innerText="copied";
    }
   catch(e){
    copyMsg.innerText("failed");
   }

   // to make copy wala span visible
   copyMsg.classList.add("active");

   setTimeout(()=>{
    copyMsg.classList.remove("active");
   },2000);
}


function shufflepassword(array){
    //fisheryates mehtod
    for(let i=array.length-1; i>0 ;i--){
        //random j find out
        const j=Math.floor(Math.random()*(i + 1));
        //swap at i and j
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;

    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;

}

function handleCheckBoxChange(){
    checkcount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkcount++; 
    });

    //special condition
    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})



inputSlider.addEventListener('input',(e)=>{
    passwordlength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passowrdDisplay.value)
     copyContent();
})

generateBtn.addEventListener('click',()=>{
    //none of the checkboxes are checked
    if(checkcount<=0) return;

    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleSlider();
    }

    /** lets strta the journey to find ne password */
 console.log("strating the journey")
    //remove old password
    password="";
    //lets put the stuff mentioned by checkbox
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(NumbersCheck.checked){
    //     password+=generateRandomInteger();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }
    let funcArr=[];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomInteger);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    console.log("compulsory additonn done")

    //remainign addition
    for(let i=0;i<passwordlength-funcArr.length;i++){
        let randomIndex=getRndInteger(0,funcArr.length);

        password+=funcArr[randomIndex]();
    }
    console.log("remaining additonn done")

    //shuffle the password
    password=shufflepassword(Array.from(password));
    console.log("shuffling  done")
    //show in ui
    passowrdDisplay.value=password;
    console.log("ui addition done");
    //calculate strength

    calcStrength();


})