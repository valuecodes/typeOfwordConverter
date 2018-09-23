
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
    let randomInput=document.getElementById("randomPhrase");
    // converterInput.addEventListener('change',convert)
    converterInput.addEventListener('keyup',convert);
    randomInput.addEventListener('click',convert);
    function convert(){
        let convertValue=document.getElementById('converterInput').value;
        
        let input=convertValue.split(" ");
        // console.log(input.length);
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

            // Cleans string to Object
            arr=toObject(typeOfWord);
            console.log(arr);
            
            // Output text
            outputText(arr);
            
            // Count Data for statistics
            countData(arr);

        }
        // Clears everything every time user inputs 
        typeOfWord=[];
    }
} 

// Cleans string to Object
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

// Output text
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
    }else if(type==3){
        var svg = document.getElementById("chart");
        while(svg.firstChild) svg.removeChild(svg.firstChild); 
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
        case "preposition":return "#bb7a3c";
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
        case "interrogativePronoun": return "#87ffc7";
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

// Count Data for statistics
let countData=(arr)=>{

    let typeArray=new Array;
    let typeA;
    let types=[];

    for(var i=0;i<arr.length;i++){
        for(var j=0;j<arr[i].type.length;j++){
            if(arr[i].type[j]!==undefined){
                if(typeArray.includes(arr[i].type[j])===false){
                    typeArray.push(arr[i].type[j]);
                    typeA=(arr[i].type[j]);
                    let obj={type:typeA,total:1};
                    types.push(obj);
                }else{
                for(var k=0;k<types.length;k++){
                    if(types[k].type==arr[i].type[j]){
                        types[k].total++;
                    }
                }
                } 
            } 
        }
    }

    // Create bar chart
    createBarChart(types);

    // console.log(types);
}

let createBarChart=(data)=>{
    
    clear(3);
    let svgData=[];
    for(var i=0;i<data.length;i++){
        svgData.push([data[i].type,data[i].total])
    }

    const w = 540;
    const h = 400;
    const padding = 60;
    
    // Chart
    const svg = d3.select("#chart")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);

    let max=0;

    for(i=0;i<svgData.length;i++){
        if(max<svgData[i][1]){
            max=svgData[i][1];
        }
    }

    console.log(max);

    var linearScale=d3.scale.linear()
    .domain([0,max])
    .range([0,300]);


                 // Vertical

                svg.selectAll("rect")
                  .data(svgData)
                  .enter()
                  .append("rect")
                  .attr("x", (d, i) => i * 45)
                  .attr("y", (d, i) => (h - linearScale(d[1])-100))
                  .attr("width", 32)
                  .style("height", (d) => linearScale(d[1])+"px")
                  .attr("fill",(d)=>{
                      return getColor(d);
                  });

                // Text

                svg.selectAll("text")
                .data(svgData)
                .enter()
                .append("text")
                .style('text-anchor', 'start')
                .text((d) => d[0])
                .attr("x", (d, i) => -290)
                .attr("y", (d, i) =>22+(i * +45) )
                .attr("fill","black")
                .attr("transform", "rotate(270)");

                svg.selectAll("text.value")
                .data(svgData)
                .enter()
                .append("text")
                .attr("class","value")
                .text((d) => d[1])
                .attr("x", (d, i) => {
                    if(d[1]<10){
                       return (i * 45)+7;
                    }
                    return i * 45;
                    

                })
                .attr("y", (d, i) => 330)
                .style("font-size", "25px");
                // .attr("x", (d, i) => -290)
                // .attr("y", (d, i) =>22+(i * +45) )
                // .attr("fill","black")
                // // .style("text-anchor", "bottom")
                // .attr("transform", "rotate(270)");

                //   Horizontal
                //   svg.selectAll("rect")
                //   .data(svgData)
                //   .enter()
                //   .append("rect")
                //   .attr("y", (d, i) =>i * 45)
                //   .attr("x", (d, i) =>0 )
                //   .attr("height", 32)
                //   .style("width", (d) => d[1]*6+"px");            
}

// Buttons

let getPhrase=()=>{
    let num=Math.ceil(Math.random()*10);
    let phrases=[
        {
            "phrase":"Deadpool (Wade Winston Wilson) is a fictional character appearing in American comic books published by Marvel Comics. Created by writer Fabian Nicieza and artist/writer Rob Liefeld, the character first appeared in The New Mutants #98 (cover-dated February 1991). Initially Deadpool was depicted as a supervillain when he made his first appearance in The New Mutants and later in issues of X-Force, but later evolved into his more recognizable antiheroic persona. Deadpool, whose real name is Wade Wilson, is a disfigured and deeply disturbed mercenary and assassin with the superhuman ability of an accelerated healing factor and physical prowess. The character is known as the 'Merc with a Mouth' because of his tendency to joke constantly, including his proclivity for breaking the fourth wall, a literary device used by the writers for humorous effect and running gags."
        },{
            "phrase":"In his first appearance, Deadpool is hired by Tolliver to attack Cable and the New Mutants. After subsequently appearing in X-Force as a recurring character, Deadpool began making guest appearances in a number of different Marvel Comics titles such as The Avengers, Daredevil, and Heroes for Hire. In 1993, the character received his own miniseries, titled The Circle Chase, written by Fabian Nicieza and pencilled by Joe Madureira. It was a relative success and Deadpool starred in a second, self-titled miniseries written in 1994 by Mark Waid, pencilled by Ian Churchill, and inked by Jason Temujin Minor and Bud LaRosa. Waid later commented"
        },{
            "phrase":"Deadpool's next starring appearance came in 2004 with the launch of Cable & Deadpool written by Fabian Nicieza, where Deadpool became partnered with his former enemy, Cable, teaming up in various adventures. This title was canceled with issue #50 and replaced by a new Cable series in March 2008.[25] Deadpool then appeared briefly in the Wolverine: Origins title by writer Daniel Way before Way and Paco Medina launched another Deadpool title in September 2008.[26] Medina was the main series artist, with Carlo Barberi"
        },{
            "phrase":"Wade managed to defeat Black Box, Black Tom and Black Swan, but in the process, his face was burned and disfigured again.[volume & issue needed] Former FBI agent Allison Kemp wanted to get revenge on Deadpool because of his involvement in an accident which left her in a wheelchair, and she called other enemies of Deadpool such as T-Ray and Slayback and trained them to kill Deadpool.[47][48] Deadpool infiltrated their base and managed to get T-Ray and Slayback killed when Kemp was about to kill herself in an explosion which would kill Wade in the process, he convinced her not to attack him. In that moment, he was surprised by the returned Evil Deadpool, who informed Wade that the serum they took was not permanent, reasons why Wade's face didn't heal or a finger he lost grew back, so Wade would return after Evil Deadpool shot him.[49] Daniel Way's Deadpool series concluded with issue 63."
        },{
            "phrase":"At a New Year's Eve party in 1999, Tony Stark meets scientist Maya Hansen, the inventor of experimental regenerative treatment Extremis that allows recovery from crippling injuries. Disabled scientist Aldrich Killian offers them a place in his company Advanced Idea Mechanics, but Stark rejects him. In 2013, Stark is having panic attacks due to his experiences during the alien invasion and subsequent Battle of New York.[N 1] Restless, he has built dozens of Iron Man suits, creating friction with his girlfriend Pepper Potts. A string of bombings by a terrorist known as the Mandarin has left intelligence agencies bewildered by a lack of forensic evidence. Stark's security chief Happy Hogan is badly injured in a Mandarin attack, causing Stark to issue a televised threat to the Mandarin, who responds by destroying Stark's home with gunship helicopters. Hansen, who came to warn Stark, survives the attack with Potts. Stark escapes in an Iron Man suit, which his artificial intelligence J.A.R.V.I.S. pilots to rural Tennessee, following a flight plan from Stark's investigation into the Mandarin. Stark's experimental armor lacks sufficient power to return to California, and the world believes him dead."
        },{
            "phrase":"With Harley's help, Stark traces the Mandarin to Miami and infiltrates his headquarters using improvised weapons. Inside he discovers the Mandarin is actually an English actor named Trevor Slattery, who is oblivious to the actions carried out in his image. Killian, who appropriated Hansen's Extremis research as a cure for his own disability and expanded the program to include injured war veterans, reveals he is the real Mandarin behind Slattery's cover. After capturing Stark, Killian reveals that he has subjected Potts to Extremis in the hope that Stark will help fix Extremis's flaws while trying to save her. Killian kills Hansen when she tries to stop him. Stark escapes and reunites with Rhodes, discovering that Killian intends to attack President Ellis aboard Air Force One."
        },{
            "phrase":"Captain America is a fictional superhero appearing in American comic books published by Marvel Comics. Created by cartoonists Joe Simon and Jack Kirby, the character first appeared in Captain America Comics #1 (cover dated March 1941) from Timely Comics, a predecessor of Marvel Comics. Captain America was designed as a patriotic supersoldier who often fought the Axis powers of World War II and was Timely Comics' most popular character during the wartime period. The popularity of superheroes waned following the war and the Captain America comic book was discontinued in 1950, with a short-lived revival in 1953. Since Marvel Comics revived the character in 1964, Captain America has remained in publication."
        },{
            "phrase":"Venom is a fictional character appearing in American comic books published by Marvel Comics, commonly in association with Spider-Man. The character is a sentient alien Symbiote with an amorphous, liquid-like form, who requires a host, usually human, to bond with for its survival. After bonding with a human host, the Symbiote bestows its enhanced powers upon the host. When the Venom Symbiote bonds with a human, that new dual-life form usually refers to itself as. The Symbiote was originally introduced as a living alien costume in The Amazing Spider-Man #252 (May 1984), with a full first appearance as Venom in The Amazing Spider-Man #300 (May 1988)."
        },{
            "phrase":"The Venom Symbiote's first known host was Spider-Man, who eventually separated himself from the creature when he discovered its true nefarious nature. The Symbiote went on to merge with other hosts, most notably Eddie Brock, its second and most infamous host, with whom it first became Venom and one of Spider-Man's archenemies.[1] According to S.H.I.E.L.D., it is considered one of the greatest threats to humanity, alongside Magneto, Doctor Doom, and Red Skull.[2]"
        },{
            "phrase":"Shooter came up with the idea of switching Spider-Man to a black-and-white costume, possibly influenced by the intended costume design for the new Spider-Woman, with artist Mike Zeck designing the black-and-white costume.[11] Writer/artist John Byrne states on his website that the idea for a costume made of self-healing biological material was one he originated when he was the artist on Iron Fist to explain how that character's costume was constantly being torn and then apparently repaired by the next issue, explaining that he ended up not using the idea on that title, but that Roger Stern later asked him if he could use the idea for Spider-Man's alien costume. Stern in turn plotted the issue in which the costume first appeared but then left the title. It was writer Tom DeFalco and artist Ron Frenz who established that the costume was a sentient alien being that was vulnerable to high sonic energy during their run on The Amazing Spider-Man that preceded Michelinie's.[12]"
        },{
            "phrase":"The story of how Spider-Man gets his new black costume is recounted in Marvel Super Heroes Secret Wars #8 (December 1984), in which writer Jim Shooter and artist Mike Zeck depicted the heroes and villains of the Marvel Universe transported to another planet called Battleworld by a being called the Beyonder. After Spider-Man's costume is ruined from battles with the villains, he is directed by Thor and the Hulk to a room at the heroes' base where they inform him a machine can read his thoughts and instantly fabricate any type of clothing. Choosing a machine he believes to be the correct one, Spider-Man causes a black sphere to appear before him, which spreads over his body, dissolving the tattered old costume and covering his body to form a new black and white costume. To Spider-Man's surprise, the costume can mimic street clothes and provides a seemingly inexhaustible and stronger supply of webbing.[13][14]"
        }
    ]
    
    document.getElementById("converterInput").textContent=phrases[num].phrase;
    
}