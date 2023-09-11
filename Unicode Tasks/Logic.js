const prompt = require("prompt-sync")({ sigint: true});
var n = prompt("Enter value of n: ");
const words = []
console.log("Enter " + n+ " words: ");
for(let i=0; i < n; i++)
{
    words.push(prompt());
}
const occurences = []
let copy = [];
let index = 0
for(let i=0; i < words.length; i++)
{
    let count = 1
    for(let j=0; j< copy.length; j++)
    {
        if(words[i]===copy[j])
        {
            count++;
            index = j
        }
    }
    if(count > 1)
    {
        occurences[index]+=1
    }
    else
    {
        occurences.push(count)
        copy.push(words[i])
    }
}
let number_of_occurences = occurences.toString();
number_of_occurences = number_of_occurences.replaceAll(","," ")
console.log(occurences.length);
console.log(number_of_occurences);

var joint_array = new Array();

for(let i = 0; i<copy.length; i++)
{
    var word_occ = {
        name: copy[i],
        occ: occurences[i]
    };
    joint_array.push(word_occ);
}

for (var i = 0; i < joint_array.length; i++) 
{
    for (var j = 0; j < (joint_array.length - i - 1); j++) 
    {
        if (joint_array[j].occ > joint_array[j + 1].occ) 
        {
            {
                var temp = joint_array[j]
                joint_array[j] = joint_array[j + 1]
                joint_array[j + 1] = temp
            }
        }
    }
}

console.log("\nDescending order:")
for (var i = joint_array.length-1; i >= 0; i--) 
{
    var abc = joint_array[i]
    console.log(abc.name)
}

console.log("\nWord(s) repeated maximum number of times:")
var no = joint_array[joint_array.length-1].occ
for (var i = joint_array.length-1; i >= 0; i--) 
{
    if(joint_array[i].occ===no)
    {
        console.log(joint_array[i].name)
    } 
}

console.log("\nWord(s) repeated minimum number of times:")
var no = joint_array[0].occ
for (var i = 0; i < joint_array.length ; i++) 
{
    if(joint_array[i].occ===no)
    {
        console.log(joint_array[i].name)
    } 
}


