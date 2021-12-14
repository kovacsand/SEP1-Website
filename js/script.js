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
    $("#week-number").text("Week " + chosenWeek);

    clearTable();

    $("#previous-week").on("click", function()
    {
        chosenWeek--;
        check();
    });

    $("#next-week").on("click", function ()
    {
        chosenWeek++;
        check();
    });
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

function importData(userId) {
    requestXML(userId);
}

function requestXML(userId) {
    let xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
            getData(this, userId);
    };
    xHttp.open("GET", "sessions.xml");
    xHttp.send();
}

function getData(xml, userId) {
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
        ids[i] = sessions[i].querySelector("ids").childNodes[0].nodeValue.replace(/\s/g, '').split(",");
    }
    updateTable(userId);
}

function clearTable() {
    $("#week-number-title").text("Week " + chosenWeek);
    $('td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6)').attr("rowspan", "1");
    $("td").css("display", "table-cell");
    $('td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6)').text("");
    $('td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6)').css("background-color", "white");
}

function updateTable(userId) {
    $("#week-number").text("Week " + chosenWeek);
    for (let i = 0; i < sessions.length; i++)
    {
        let tableId, tableLastCellId, dayOfTheSession;
        if (ids[i].includes(userId) && weekOfYear(days[i], months[i], years[i]) == chosenWeek) {
            console.log("ID found");
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
            dayOfTheSession = tableId;
            tableLastCellId = tableId + "-";
            tableId += "-" + parseInt(times[i].substr(0, 2));
            if (Math.floor(parseInt(times[i].substr(3, 2)) / 30) != 0)
                tableId += 30;
            else
                tableId += "00";
            tableLastCellId += parseInt(times[i].substr(8, 2));
            if (Math.floor(parseInt(times[i].substr(11, 2)) / 30) != 0)
                tableLastCellId += 30;

            document.getElementById(tableId).innerHTML =
                courses[i] + "<br/>" + teachers[i] + "<br/>" + rooms[i] + "<br/>"+ times[i];
            $("#" + tableId).css("background-color", "lightblue");


            let firstToDelete = parseInt(times[i].substr(0, 2)) * 100;
            if (Math.floor(parseInt(times[i].substr(3, 2)) / 30) != 0)
                firstToDelete += 30;
            if (firstToDelete % 100 == 30)
                firstToDelete += 70;
            else
                firstToDelete += 30;

            let lastToDelete = parseInt(times[i].substr(8, 2)) * 100;
            if (Math.floor(parseInt(times[i].substr(11, 2)) / 30) != 0)
                lastToDelete += 30;

            let counter = 1;
            let j = firstToDelete;
            while (j <= lastToDelete) {
                let cellToBeDeleted = dayOfTheSession + "-" + j;
                $("#" + cellToBeDeleted).css("display", "none");
                console.log("deleting one cell");
                if (j % 100 == 30)
                    j += 70;
                else
                    j += 30;
                counter++;
            }
            $("#" + tableId).attr("rowspan", counter);
        }
    }
}
 //SEARCH
 function check(){
    clearTable();
    importData(document.getElementById("search").value);
}

//Stuff that we want to run when page is opened
init();