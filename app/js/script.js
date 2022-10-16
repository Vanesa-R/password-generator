/* VARIABLES Y OBJETOS*/

const section = document.querySelector(".generated__password");
const passGenerated = document.querySelector(".password__text");
const copyPass = document.querySelector(".password__copy");
const passLength = document.querySelector(".characters");
const rangeBar = document.querySelector(".range");
const checkboxes = document.querySelectorAll("input[type=checkbox]");
const passStrength = document.querySelector(".level__text");
const level = document.querySelectorAll(".level");
const btnGenerate = document.querySelector(".btn--generate");

const percentage = document.documentElement.style;

const charactersIncluded = {
    includeUppercase : true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false
}


/* EVENTOS */

// Generate password
btnGenerate.addEventListener("click", (e) => {
    e.preventDefault();
    generatePassword();
    strenghtPassword();
})



// Copy password
copyPass.addEventListener("click", () => {
    if (passGenerated.value !== ""){
        navigator.clipboard.writeText(passGenerated.value);
        (navigator.clipboard.writeText(passGenerated.value)) && setMessage("input--copied", "Copied!");
        (window.outerWidth < 450) && copyPass.classList.add("img--hidden");
    }
})



/* FUNCIONES */

// Set button generate
const enabledGenerate = () => {
    btnGenerate.disabled = false;
    copyPass.disabled = false;
    btnGenerate.setAttribute("aria-disabled", "false");
}
const disabledGenerate = () => {
    btnGenerate.disabled = true;
    btnGenerate.setAttribute("aria-disabled", "true");
    setMessage("input--empty", "Generate password");
}



// Set password length
const setRange = () => {
    percentage.setProperty("--percentage", "50%")

    rangeBar.addEventListener("input", (e) => {
        percentage.setProperty("--percentage", `${rangeBar.value * 5}%`)
        passLength.textContent = `${rangeBar.value}`;
        generatePassword();
        strenghtPassword()
    })
}
setRange();



// Set characters includes
const setIncludes = () => {
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", e => {

            (checkbox.hasAttribute("checked")) ? checkbox.removeAttribute("checked") : checkbox.setAttribute("checked", "checked");
            checkbox.setAttribute("aria-checked", e.target.checked);

            switch(checkbox.getAttribute("name")) {
                case "uppercase":
                    charactersIncluded.includeUppercase = e.target.checked;
                    break;
                case "lowercase":
                    charactersIncluded.includeLowercase = e.target.checked;
                    break;
                case "numbers":
                    charactersIncluded.includeNumbers = e.target.checked;
                    break;
                case "symbols":
                    charactersIncluded.includeSymbols = e.target.checked;
                    break;
            }
          
            generatePassword();
            strenghtPassword();
        })
        
    })
}
setIncludes()



// Set message 
const setMessage = (state, text) => {

    const message = document.createElement("span");
    if (!document.querySelector(".input--empty")){
        message.classList.add(state);
        message.textContent = text;
        section.appendChild(message)
    
        if (passGenerated.value != ""){
           setTimeout(() => {
                (window.outerWidth < 450) && copyPass.classList.remove("img--hidden");
                message.remove();
            }, 1500)
    
        } else {
            const mutationObserver = new MutationObserver(function(mutations) {
                mutations.forEach(mutation => {
                    if(mutation.attributeName == "disabled"){
                        (!mutation.target.disabled) && message.remove();
                    }
                });
            });
    
            mutationObserver.observe(btnGenerate, {attributes: true});
        }
    }
}



// Characters Available
const getCharacters = (low, high) => {
    let charactersCode = [];

    for (let i = low; i <= high; i++){
        charactersCode.push(i)
    }
    return charactersCode;
}
const uppercases = getCharacters(65, 90);
const lowercases = getCharacters(97, 122);
const numbers = getCharacters(48, 57);
const symbols = getCharacters(33, 47).concat(getCharacters(58, 64)).concat(getCharacters(123, 126));



// Generate Password
const generatePassword = () => {
    let allCharactersIncluded = [];
    let randomPasword = [];

    (charactersIncluded.includeUppercase == true) && allCharactersIncluded.push(uppercases);
    (charactersIncluded.includeLowercase == true) && allCharactersIncluded.push(lowercases);
    (charactersIncluded.includeNumbers == true) && allCharactersIncluded.push(numbers);
    (charactersIncluded.includeSymbols == true) && allCharactersIncluded.push(symbols);


    if (allCharactersIncluded.length > 0){
        allCharactersIncluded = allCharactersIncluded.join(",").split(",");
    
        for (let i = 0; i < rangeBar.value; i++){
            let c = allCharactersIncluded[Math.floor(Math.random() * allCharactersIncluded.length)]
            randomPasword.push(String.fromCharCode(c))
        }
    }
    passGenerated.value = `${randomPasword.join("")}`;
    (passGenerated.value == "") ? disabledGenerate() : enabledGenerate();

}
generatePassword()



// Strength Password
const strenghtPassword = () => {
    let result = zxcvbn(`${passGenerated.value}`)

    level.forEach((el, index) => {
        (index < result.score) && el.classList.add(`level--${result.score}`);

        if ((index + 1) !== result.score) {
            let n = index + 1;

            level.forEach(el => {
                (el.classList.contains(`level--${n}`)) && el.classList.remove(`level--${n}`)
            })
        }        
    })

    switch(result.score) {
        case 1:
            passStrength.textContent = `Too weak!`;
            break;
        case 2:
            passStrength.textContent = `Weak`;
            break;
        case 3:
            passStrength.textContent = `Medium`;
            break;
        case 4:
            passStrength.textContent = `Strong`;
            break;
        default:
            passStrength.textContent = ``;

    }
}
strenghtPassword()