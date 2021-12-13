let sessions, courses, dates, times, rooms, teachers, ids, days, months, years, lengths;
let currentWeek = new Date, chosenWeek;

function init() {
    courses = new Array();
    dates = new Array();
    times = new Array();
    rooms = new Array();
    teachers = new Array();
    ids = new Array();
    days = new Array();
    months = new Array();
    years = new Array();
    lengths = new Array();

    currentWeek = weekOfYear(currentWeek.getDate(), currentWeek.getMonth() + 1, currentWeek.getFullYear());
    chosenWeek = currentWeek;
}

function dayOfWeek(day, month, year) {
    let date = new Date(year, month - 1, day); //js date starts with 1, 0, 1
    return date.getDay();
    //Monday is 1, Sunday is 7
}

function weekOfYear(day, month, year) {
    let date = new Date(year, month - 1, day); //js date starts with 1, 0, 1
    let d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    let weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return weekNo;
}

function calculateLength(time) {
    let startHour = time.substr(0, 2);
    let startMinute = time.substr(3, 2);
    let endHour = time.substr(8, 2);
    let endMinute = time.substr(11, 2);
    startMinute = startHour * 60 + startMinute * 1;
    endMinute = endHour * 60 + endMinute * 1;
    return endMinute - startMinute;
}

function importData() {
    requestXML();
}

function requestXML() {
    let xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
            getData(this);
    };
    xHttp.open("GET", "sessions.xml");
    xHttp.send();
}

function getData(xml) {
    let xmlDoc = xml.responseXML;
    sessions = xmlDoc.getElementsByTagName("session");

    for (let i = 0; i < sessions.length; i++) {
        courses[i] = sessions[i].querySelector("course").childNodes[0].nodeValue;
        dates[i] = sessions[i].querySelector("date").childNodes[0].nodeValue;
        days[i] = parseInt(dates[i].substr(0,2));
        months[i] = parseInt(dates[i].substr(3, 4));
        years[i] = parseInt(dates[i].substr(6, 2)) + 2000;
        times[i] = sessions[i].querySelector("time").childNodes[0].nodeValue;
        lengths[i] = calculateLength(times[i]);

        rooms[i] = sessions[i].querySelector("room").childNodes[0].nodeValue;
        teachers[i] = sessions[i].querySelector("teacher").childNodes[0].nodeValue;
        ids[i] = sessions[i].querySelector("ids").childNodes[0].nodeValue;

        document.getElementById("xml-test-text").innerHTML = courses[0] + dates[0] + times[0] + rooms[0] + teachers[0] + ids[0];
    }

    refreshTable();
}

function refreshTable()
{
    for (let i = 0; i < sessions.length; i++)
    {
        let tableId;
        if (weekOfYear(days[i], months[i], years[i] === currentWeek))
        {
            tableId = dayOfWeek(days[i], months[i], years[i]);
            if (tableId == 1)
                tableId = "monday";
            if (tableId == 2)
                tableId = "tuesday";
            if (tableId == 3)
                tableId = "wednesday";
            if (tableId == 4)
                tableId = "thursday";
            if (tableId == 5)
                tableId = "friday";
            if (tableId == 6)
                tableId = "saturday";
            if (tableId == 7)
                tableId = "sunday";
            tableId += "-" + parseInt(times[i].substr(0, 2));
            if (Math.floor(parseInt(times[i].substr(3, 2)) / 30) != 0)
                tableId += 3;
            console.log(tableId);
        }

        document.getElementById(tableId).innerHTML = courses[i] + "\n" + teachers[i] + "\n" + rooms[i];
    }
}

//Stuff that we want to run when page is opened
init();
importData();





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