window.onload = function() {

    var mistakes = 0;
    var mistake = 0;
    var mistake_arr = [];
    var text_input = document.getElementById("text_input");

    var text = document.getElementById("correct").innerText.replace(/(\r\n|\n|\r)/gm, "").replace("|", "");
    document.getElementById("correct").innerText = text;
    var text_length = text.length;
    b = document.getElementById("correct").innerHTML.split("")

    for (i = 0; i < text_length; i++) {
        if (b[i] == " ") {
            b[i] = "<font class='char non-cor space'>" + b[i] + "</font>"
        } else {
            b[i] = "<font class='char non-cor'>" + b[i] + "</font>";
        }
    }
    c = "";
    for (i = 0; i <= b.length - 1; i++) {
        c += b[i];
    }
    document.getElementById("correct").innerHTML = c
    caretka = document.createElement("span");
    caretka.id = "caretka";
    caretka.innerText = "|";
    document.getElementById("correct").prepend(caretka)
    itemListParent = document.querySelector("#correct")
    itemList = document.querySelector("#correct").childNodes

    curPositionOld = 0
    curPositionNew = 1

    document.getElementById("language_text").onclick = function() {
        document.getElementById("language_text").scrollIntoView();
        text_input.scrollLeft = text_input.scrollWidth;
        text_input.selectionStart = text_input.value.length;
        text_input.focus();
    }

    all_char = document.getElementsByClassName("char")
    elem = document.getElementById("trust");
    elem_move = ((screen.width - 36 - parseInt(window.getComputedStyle(elem).width.replace("px", ""))) / text_length)
    beginned = false;

    distrust_count = 0;
    text_input.oninput = function(e) {
        if (beginned == false) {
            beginned = true;
            start = new Date();
        }
        trust_count = 0;
        input_value = text_input.value;
        input_len = input_value.length;
        for (let index = 0; index < text_length; index++) {
            if (text.slice(0, index) == input_value.slice(0, index)) {
                trust_count++;
            } else {
                trust_count--;
                break;
            }
        }
        if (text.slice(0, trust_count) != input_value.slice(0, trust_count)) trust_count--;

        curPositionNew = e.target.selectionStart
        if (curPositionNew == curPositionOld + 1) {
            itemListParent.insertBefore(itemList[curPositionNew], itemList[curPositionOld])
        } else if (curPositionNew > curPositionOld) {
            itemListParent.insertBefore(itemList[curPositionOld], itemList[curPositionNew + 1])
        } else if (curPositionNew < curPositionOld) {
            itemListParent.insertBefore(itemList[curPositionOld], itemList[curPositionNew])
        }
        curPositionOld = curPositionNew

        if (text[input_len - 1] == input_value[input_len - 1] && input_len == trust_count) {
            if (!elem.classList.contains("true")) {
                if (elem.classList.contains("false")) {
                    elem.classList.toggle("false")
                }
                elem.classList.toggle("true")
            }
            elem.style.right = `${-trust_count*elem_move}px`
        } else {
            if (!elem.classList.contains("false")) {
                if (elem.classList.contains("true")) {
                    elem.classList.toggle("true")
                    mistake++;
                    mistake_arr.push(text[trust_count])
                }
                elem.classList.toggle("false")
            }

            if (e.inputType == "deleteContentBackward") {
                // mistakes--;
            } else {
                mistakes++;
            }
        }

        distrust_count = input_len - trust_count
        for (i = 0; i < trust_count; i++) {
            if (all_char[i].classList.contains("non-cor")) {
                all_char[i].classList.remove("non-cor");
                all_char[i].classList.add("cor");
            }
            if (all_char[i].classList.contains("incor")) {
                all_char[i].classList.remove("incor");
                all_char[i].classList.add("cor");
            }
        }
        for (i = trust_count; i < text_length; i++) {
            if (i < Math.min(trust_count + distrust_count, text_length)) {
                if (all_char[i].classList.contains("cor")) {
                    all_char[i].classList.remove("cor");
                    all_char[i].classList.add("incor");
                }
                if (all_char[i].classList.contains("non-cor")) {
                    all_char[i].classList.remove("non-cor");
                    all_char[i].classList.add("incor");
                }

            } else {
                if (all_char[i].classList.contains("cor")) {
                    all_char[i].classList.remove("cor");
                    all_char[i].classList.add("non-cor");
                }
                if (all_char[i].classList.contains("incor")) {
                    all_char[i].classList.remove("incor");
                    all_char[i].classList.add("non-cor");
                }
            }
        }

        if (trust_count == text_length) {
            document.getElementById("test_end").classList.add("anim")
            setTimeout(() => {
                letters = mostUsedLetters(mistake_arr.join(''))
                res = ""
                for (i = 0; i < letters.length; i++) {
                    res += `${letters[i].letter} `
                }
                end = (new Date() - start) / 1000
                let p = document.createElement("p");
                p.style.zIndex = "1";
                p.innerHTML = `
                time: ${end.toFixed(1)} s<br>
                wpm: ${((60 / end) * (text.split(' ')).length).toFixed(0)}<br>
                cpm: ${((60 / end) * text_length).toFixed(0)}<br>
                acc: ${(100 - (mistake / (text_length/100))).toFixed(1)}%<br>
                mistakes: ${res}
                `
                document.getElementById("back_vid").style.display = "none";
                document.getElementById("test_end").append(p)
            }, 1200);
        }
    }
    text_input.addEventListener("keydown", function(event) {
        if (event.code == "ArrowLeft") {
            curPositionNew = event.target.selectionStart
            itemListParent.insertBefore(itemList[curPositionOld], itemList[curPositionNew])
            curPositionOld = curPositionNew
        }
        if (event.code == "ArrowRight") {
            curPositionNew = event.target.selectionStart
            itemListParent.insertBefore(itemList[curPositionOld], itemList[curPositionNew + 1])
            curPositionOld = curPositionNew
        }
    });
    text_input.addEventListener('keyup', event => {
        if (event.code == "ArrowLeft") {
            // curPositionNew -= 1
            // curPositionNew = Math.max(curPositionNew, 0)
            // itemListParent.insertBefore(itemList[curPositionOld], itemList[curPositionNew])
            // curPositionOld = curPositionNew
            // console.log(Array.prototype.indexOf.call(itemList, caretka))
            curPositionNew = event.target.selectionStart
            itemListParent.insertBefore(itemList[curPositionOld], itemList[curPositionNew])
            curPositionOld = curPositionNew
        }
        if (event.code == "ArrowRight") {
            // curPositionNew += 1
            // curPositionNew = Math.min(curPositionNew, input_len)
            // itemListParent.insertBefore(itemList[curPositionOld], itemList[curPositionNew + 1])
            // curPositionOld = curPositionNew
            // console.log(Array.prototype.indexOf.call(itemList, caretka))
            curPositionNew = event.target.selectionStart
            itemListParent.insertBefore(itemList[curPositionOld], itemList[curPositionNew + 1])
            curPositionOld = curPositionNew
        }
    });
    text_input.addEventListener('focusin', (event) => {
        caretka.classList.add("flashing")
    });
    text_input.addEventListener('focusout', (event) => {
        caretka.classList.remove("flashing")
    });
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    hour = d.getHours();
    minute = d.getMinutes();
    second = d.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    if (second.length < 2) second = '0' + second;
    return [year, month, day, hour, minute, second].join('.');
}

function getResolution() {
    const realWidth = window.screen.width * window.devicePixelRatio;
    const realHeight = window.screen.height * window.devicePixelRatio;
    console.log(`Your screen resolution is: ${realWidth} x ${realHeight}`);
}

function mostUsedLetters(sourceString) {
    const charsCount = {};
    for (const chr of sourceString)
        charsCount[chr] = (charsCount[chr] || 0) + 1;
    const result = Object.keys(charsCount)
        .map(chr => ({ letter: chr, count: charsCount[chr] }));
    return result.sort((a, b) => b.count - a.count);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}