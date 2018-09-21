
// Request data from github
loadDoc("https://raw.githubusercontent.com/valuecodes/typeOfwordConverter/master/dataBase/mainWordData.json", myFunction1);
function loadDoc(url, cFunction) {
  var xhttp;
  xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      cFunction(this);
    }
 };
  xhttp.open("GET", url, true);
  xhttp.send();
}

let typeOfWord=new Array;

function myFunction1(xhttp) {

    json=JSON.parse(xhttp.responseText);
    // User input
    let converterInput=document.getElementById('converterInput');
    converterInput.addEventListener('keyup',convert)
    
    function convert(){
        let convertValue=document.getElementById('converterInput').value;
        
        let input=convertValue.split(" ");
        console.log(input.length);
        clear(1);
    
        // var out=document.getElementById('outputWord');

        // for(var i=0;i<input.length;i++){
        //     var p=document.createElement('span');
        //     var text=document.createTextNode(input[i]+" ");
        //     out.appendChild(p);
        //     p.appendChild(text);
        // }

        // document.getElementById('outputWord').innerHTML=input;
        
        
        for(var j=0;j<input.length;j++){
            console.log(input[j]);
            word=input[j].toLowerCase().replace(/[^a-zA-Z ]/gi,"").split("").join("");
            let flag=0;

            // Seperates each word with /
            typeOfWord.push("/ "+word);

            // Check if word is found pushes word types to typeOfWord
            for(var i=0;i<json.length;i++){
                if(json[i].word==word && json[i].word.length==word.length){
                    // check for duplicates
                    if(typeOfWord.includes(json[i].type)===false){
                        typeOfWord.push(' '+json[i].type+' ')
                        flag=1;
                    }  
                }
            }

            // If word is not recognized
            if(flag==0 && word!==""){
                typeOfWord.push(undefined);
            }
            // document.getElementById('outputType').innerHTML=typeOfWord.join(" ");

            // Cleans string to Object
            arr=toObject(typeOfWord);
            console.log(arr);
            
            // Output text
            outputText(arr);


        }
        // Clears everything every time user inputs 
        typeOfWord=[];
    }
} 


let toObject=(str)=>{
    let temp = str.join(" ").split("/");
    let arr=[];
    let word=[];
    let types=[];
    for(var i=0;i<temp.length;i++){
        if(temp[i]!=="" || temp[i]!==undefined){
            word=temp[i].split(" ").filter(val=>!!val);
            types=word.slice(1);
            // console.log(word);
            if(word[0]!==undefined){
                arr.push({
                word:word[0],
                type:types
                });
            }  
        }
    }
    return arr;
}

let outputText=(arr)=>{
    clear(2);
    createOutput(arr);
    var text=document.getElementById('outputType').children;
    // var origin=document.getElementById('outputWord').children;
    for(var i=0;i<arr.length;i++){
        let color=getColor(arr[i].type);
        text[i].style.backgroundColor = color;
    }
}

// Clears span elements when user types
function clear(type){
    if(type==1){
        var span = document.getElementById("outputWord");
        while(span.firstChild) span.removeChild(span.firstChild);
    }else if(type==2){
        var span2 = document.getElementById("outputType");
        while(span2.firstChild) span2.removeChild(span2.firstChild); 
    }
}

// Creates colors
let getColor=(arr)=>{
    switch(arr[0]){
        case "adj":return "#ffe493";
        case "verb":return "#93aeff";
        case "noun":return "#f76e6e";
        case "adverb":return "#da86c5";
        case "conjuction":return "#889b1e";
        case "preposition":return "#a3f8d";
        case "interjection":return "#bfff87";
        case "relativePronoun": return "#87ffc7";
        case "personalPronoun": return "#87ffc7";
        case "indefinitePronoun": return "#87ffc7";
        case "objectPronoun": return "#87ffc7";
        case "reflexivePronoun": return "#87ffc7";
        case "intensivePronouns": return "#87ffc7";
        case "possessivePronoun": return "#87ffc7";
        case "demonstrativePronoun": return "#87ffc7";
        case "archaicPronouns": return "#87ffc7";
    }
}

// Create output
let createOutput=(arr)=>{
    var out=document.getElementById('outputType');
    for(var i=0;i<arr.length;i++){
        var p=document.createElement('span');
        var text=document.createTextNode(arr[i].word+" ");
            out.appendChild(p);
            p.appendChild(text);
    }
}