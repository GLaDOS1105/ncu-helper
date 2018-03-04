"use strict";
/* Author: Sean Wu
 ** NCU CSIE, Taiwan
 ** This code is some kind of messy but I don't give a fuck. After all, it works.
 */

var centerBody = document.getElementsByTagName('center')[0]
if (centerBody) {
    var mainTable = document.getElementsByTagName('table')[0];
    mainTable.setAttribute('id', 'main-table');
    var GPAHeader = document.createElement('td');
    GPAHeader.innerHTML = 'GPA Score';
    mainTable.children[0].firstChild.appendChild(GPAHeader);
    var scoresList = mainTable.children[0].querySelectorAll('tr.list1');
    for (var i = 0; i < scoresList.length; i++)
        scoresList[i].appendChild(document.createElement('td'));

    /* Append GPA score for each row. */
    function isValidScore(tr) {
        var score = parseInt(tr.children[4].innerHTML);
        if (Number.isInteger(score))
            return true;
        return false;
    }

    function scoreToNCUGP(score) {
        score = Number(score);
        if (score >= 80)
            return 4;
        if (score >= 70)
            return 3;
        if (score >= 60)
            return 2;
        if (score >= 1)
            return 1;
        return 0;
    }

    function scoreToNTUGP(score) {
        score = Number(score);
        if (score >= 90)
            return 4.3;
        if (score >= 85)
            return 4;
        if (score >= 80)
            return 3.7;
        if (score >= 77)
            return 3.3;
        if (score >= 73)
            return 3.0;
        if (score >= 70)
            return 2.7;
        if (score >= 67)
            return 2.3;
        if (score >= 63)
            return 2.0;
        if (score >= 60)
            return 1.7;
        return 0;
    }

    /* Make the main table (score of credits) selectable. */
    $('#main-table tr.list1 td').on('click', function () {
        var tr = $(this).parent();
        if (tr.hasClass('selected'))
            tr.removeClass('selected');
        else
            tr.addClass('selected');
        calculateGPA();
    });

    /* Extend the row of td.list3 */
    $('tr.list3 td[colspan]').attr('colspan', '6');

    /* Create GPA table. */
    var GPA = document.createElement('div');
    var GPATitle = document.createElement('span');
    var GPAPoints = document.createElement('span');
    var GPAModes = document.createElement('div');
    var selectAction = document.createElement('div');

    /* Modes */
    var modesOptions = ['NCU(4.0)', 'NTU(4.3)'];
    modesOptions.forEach(element => {
        var input = document.createElement('input');
        var label = document.createElement('label');
        var bigSpan = document.createElement('span');
        var smallSpan = document.createElement('span');
        input.type = 'radio';
        input.value = element;
        input.id = 'Mode' + element;
        input.name = 'modes';
        label.className = 'radio';
        label.setAttribute('for', 'Mode' + element);
        bigSpan.className = 'big';
        smallSpan.className = 'small';
        bigSpan.appendChild(smallSpan);
        label.appendChild(bigSpan);
        label.appendChild(document.createTextNode(element))
        GPAModes.appendChild(input);
        GPAModes.appendChild(label);
    });

    /* Select Actions */
    var selectAllBtn = document.createElement('button');
    var selectMajorBtn = document.createElement('button');
    var selectLast60Btn = document.createElement('button');
    var selectSJBtn = document.createElement('button');
    var deselectAllBtn = document.createElement('button');
    selectAllBtn.innerHTML = 'Select All';
    selectMajorBtn.innerHTML = 'Select All Major';
    selectLast60Btn.innerHTML = 'Select Last 60 Credits';
    selectSJBtn.innerHTML = 'Select All Senior/Junior Courses';
    deselectAllBtn.innerHTML = 'Deselect All';

    GPA.id = 'GPA';
    GPATitle.id = 'GPATitle';
    GPATitle.innerHTML = 'GPA';
    GPAPoints.id = 'GPAPoints';
    GPAPoints.innerHTML = 0;
    GPAModes.id = 'GPAModes';

    GPA.appendChild(GPATitle);
    GPA.appendChild(GPAPoints);
    GPA.appendChild(GPAModes);
    GPA.appendChild(selectAllBtn);
    GPA.appendChild(selectMajorBtn);
    GPA.appendChild(selectLast60Btn);
    GPA.appendChild(selectSJBtn);
    GPA.appendChild(deselectAllBtn);
    centerBody.appendChild(GPA);

    document.getElementById('ModeNCU(4.0)').checked = true;

    function deselectAll() {
        for (var i = 0; i < scoresList.length; i++)
            if (scoresList[i].classList.contains('selected'))
                scoresList[i].classList.remove('selected');
        calculateGPA();
    }

    deselectAllBtn.onclick = deselectAll;

    selectAllBtn.onclick = function () {
        for (var i = 0; i < scoresList.length; i++)
            if (isValidScore(scoresList[i]) &&
                !scoresList[i].classList.contains('selected'))
                scoresList[i].classList.add('selected');
        calculateGPA();
    }
    selectMajorBtn.onclick = function () {
        deselectAll();
        for (var i = 0; i < scoresList.length; i++)
            if (isValidScore(scoresList[i]) &&
                !scoresList[i].classList.contains('selected') &&
                scoresList[i].children[1].innerHTML === "必")
                scoresList[i].classList.add('selected');
        calculateGPA();
    }
    selectLast60Btn.onclick = function () {
        deselectAll();
        var i = scoresList.length - 1;
        var totalCredits = 0;
        while (totalCredits < 60 && i >= 0) {
            if (isValidScore(scoresList[i]) &&
                !scoresList[i].classList.contains('selected') &&
                Number(scoresList[i].children[3].innerHTML) !== 0) {
                totalCredits += Number(scoresList[i].children[3].innerHTML)
                scoresList[i].classList.add('selected');
            }
            i--;
        }
        calculateGPA();
    }

    selectSJBtn.onclick = function () {
        deselectAll();
        var firstYear = Number(scoresList[0].firstChild.innerHTML.slice(0, -1));
        for (var i = 0; i < scoresList.length; i++)
            if (isValidScore(scoresList[i]) &&
                !scoresList[i].classList.contains('selected') &&
                Number(scoresList[i].firstChild.innerHTML.slice(0, -1)) - firstYear >= 2)
                scoresList[i].classList.add('selected');
        calculateGPA();
    }

    $('label[for="ModeNCU(4.0)"').on('click', function () {
        insertGPATableData(scoreToNCUGP);
    });
    $('label[for="ModeNTU(4.3)"').on('click', function () {
        insertGPATableData(scoreToNTUGP);
    })

    function insertGPATableData(modeFunc) {
        for (var i = 0; i < scoresList.length; i++)
            if (isValidScore(scoresList[i]))
                scoresList[i].children[5].innerHTML = modeFunc(scoresList[i].children[4].innerHTML);
        calculateGPA();
    }

    function calculateGPA() {
        var totalGPA = 0;
        var totalCredits = 0;
        for (var i = 0; i < scoresList.length; i++)
            if (isValidScore(scoresList[i]) &&
                scoresList[i].classList.contains('selected')) {
                totalGPA += Number(scoresList[i].children[3].innerHTML) * Number(scoresList[i].children[5].innerHTML);
                totalCredits += Number(scoresList[i].children[3].innerHTML);
            }
        if (totalCredits === 0)
            GPAPoints.innerHTML = 0;
        else
            GPAPoints.innerHTML = (totalGPA / totalCredits).toFixed(5);
    }

    insertGPATableData(scoreToNCUGP);
}