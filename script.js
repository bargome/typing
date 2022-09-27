window.onload = function() {

    var mistakes = 0;
    var mistake = 0;
    var mistake_arr = [];
    var text_input = document.getElementById("text_input");

    document.getElementById("text_type").onclick = function() {
        text_input.scrollLeft = text_input.scrollWidth;
        text_input.selectionStart = text_input.value.length;
        text_input.focus();
    }

    var text = document.getElementById("correct").innerText.replace(/(\r\n|\n|\r)/gm, "");
    document.getElementById("correct").innerText = text;
    var text_length = text.length;

    b = document.getElementById("correct").innerHTML.split("")
    for (i = 0; i < text_length; i++) {
        b[i] = "<font class='char non-cor'>" + b[i] + "</font>";
    }
    c = "";
    for (i = 0; i <= b.length - 1; i++) {
        c += b[i];
    }
    document.getElementById("correct").innerHTML = c

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


        // document.getElementById("text_input_test").value = text.slice(0, trust_count);

        if (text[input_len - 1] == input_value[input_len - 1] && input_len == trust_count) {
            if (!elem.classList.contains("true")) {
                if (elem.classList.contains("false")) {
                    elem.classList.toggle("false")
                }
                elem.classList.toggle("true")
            }
            distrust_count = 0;

            elem.style.right = `${-trust_count*elem_move}px`
                // elem.style.right = "-10px";
                // elem.style.backgroundColor = "chartreuse";
        } else {
            if (!elem.classList.contains("false")) {
                if (elem.classList.contains("true")) {
                    elem.classList.toggle("true")
                    mistake++;

                    mistake_arr.push(text[trust_count])
                }
                elem.classList.toggle("false")
            }

            // if (e.inputType == "deleteContentBackward")
            if (e.inputType == "deleteContentBackward") {
                // mistakes--;
                distrust_count--;
            } else {
                mistakes++;
                distrust_count++;
                // mistake_arr.push(text[trust_count])

            }
            // elem.style.backgroundColor = "red";
        }

        // for (i = trust_count; i < Math.min(trust_count + distrust_count, text_length); i++) {
        //     console.log(all_char[i])
        //     if (all_char[i].classList.contains("incor")) {
        //     } else {
        //         all_char[i].classList.add("incor");
        //     }
        // }

        // for (i = trust_count; i < text_length; i++) {
        //     console.log(all_char[i])
        //     if (all_char[i].classList.contains("incor")) {
        //     } else {
        //         all_char[i].classList.add("incor");
        //     }
        // }

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
            // sleep(6000)
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
            // letters = mostUsedLetters(mistake_arr.join(''))
            // res = ""
            // for (i = 0; i < letters.length; i++) {
            //     res += `${letters[i].letter} `
            // }
            // end = (new Date() - start) / 1000
            // document.getElementById("test_end").innerHTML = `
            //                                                 <p>time: ${end.toFixed(1)} s<br>
            //                                                 wpm: ${((60 / end) * (text.split(' ')).length).toFixed(0)}<br>
            //                                                 cpm: ${((60 / end) * text_length).toFixed(0)}<br>
            //                                                 acc: ${(100 - (mistake / (text_length/100))).toFixed(1)}%<br>
            //                                                 mistakes: ${res}</p>
            //                                                 `
        }
    }
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
    // фильтруем строку, оставив только буквы
    // const filteredStr = sourceString.toLowerCase().replace(/[^а-яё]/g, '');
    // считаем в объект кол-во вхождений каждой буквы, используя ее как ключ
    const charsCount = {};
    for (const chr of sourceString)
        charsCount[chr] = (charsCount[chr] || 0) + 1;
    // преобразуем полученный объект в массив объектов
    const result = Object.keys(charsCount)
        .map(chr => ({ letter: chr, count: charsCount[chr] }));
    // возвращаем отсортированный 
    return result.sort((a, b) => b.count - a.count);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}