function importData()
{
}

console.log("something fun");

$("#xml-test-text").text("hm");

function requestXML()
{
    let xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
            showData(this);
    };
    xHttp.open("GET", "sessions.xml");
    xHttp.send();
}


function showData(xml)
{
    let xmlDoc = xml.responseXML;

    console.log(xmlDoc);

    let sessions = xmlDoc.getElementsByTagName("session");
    let courses = [], dates = [], times = [], rooms = [], teachers = [], ids = [];

    for (let i = 0; i < sessions.length; i++) {
        courses[i] = sessions[i].querySelector("course").childNodes[0].nodeValue;
        dates[i] = sessions[i].querySelector("date").childNodes[0].nodeValue;
        times[i] = sessions[i].querySelector("time").childNodes[0].nodeValue;
        rooms[i] = sessions[i].querySelector("room").childNodes[0].nodeValue;
        teachers[i] = sessions[i].querySelector("teacher").childNodes[0].nodeValue;
        ids[i] = sessions[i].querySelector("ids").childNodes[0].nodeValue;

        console.log(i + ". " + courses[i]);
        console.log(i + ". " + dates[i]);
        console.log(i + ". " + times[i]);
        console.log(i + ". " + rooms[i]);
        console.log(i + ". " + teachers[i]);
        console.log(i + ". " + ids[i]);
        document.getElementById("xml-test-text").innerHTML = courses[0] + dates[0] + times[0] + rooms[0] + teachers[0] + ids[0];

    }
    
    console.log(sessions[0]);

    // let books = xmlDoc.getElementsByTagName("book");
    // for (let i = 0; i < books.length; i++) {
    //     hpTableContent += "<tr class='hp-table'>" +
    //         "<td class='hp-table'>" + books[i].querySelector("author").childNodes[0].nodeValue + "</td>" +
    //         "<td class='hp-table'>" + books[i].querySelector("title").childNodes[0].nodeValue + "</td>" +
    //         "<td class='hp-table'>" + books[i].querySelector("year").childNodes[0].nodeValue + "</td>" +
    //         "</tr>";
    // }
    // document.getElementById("HP").innerHTML = hpTableContent;
}
requestXML();

// function showMyData(xml)
// {
//     let xmlDoc = xml.responseXML;
//     let lists = xmlDoc.getElementsByTagName("list-of-things");
//     let happyList = lists[0].getElementsByTagName("make-me-happy");
//     let happyThings = happyList[0].getElementsByTagName("list-item");
//     document.getElementById("happy").innerHTML += " " + happyThings.length;
//     let goodList = lists[0].getElementsByTagName("i-am-good-at");
//     let goodThings = goodList[0].getElementsByTagName("list-item");
//     document.getElementById("good").innerHTML += " " + goodThings.length;
//     let learnList = lists[0].getElementsByTagName("i-want-to-learn");
//     let learnThings = learnList[0].getElementsByTagName("list-item");
//     document.getElementById("learn").innerHTML += " " + learnThings.length;
//
// }