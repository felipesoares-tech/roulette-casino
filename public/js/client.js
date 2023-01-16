function downloadFiles() {
    fetch('/admin/download')
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'bot_static.zip';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        })
        .catch(error => console.error(error));
}

var tagContador = document.getElementById('cont')
var rounds = 0
var scoreBot1 = 0, scoreBot2 = 0, scoreBot3 = 0
var inputLastFiveNumbers = 0
var arrayLastFiveNumbers = null
var controlBot1 = true, controlBot2 = true, controlBot3 = true
var firstClick = true
var dataCollect = true
const GetStorageStatus = localStorage.getItem('CollectData')
tagContador.value = 0

console.log(GetStorageStatus)

if (GetStorageStatus == 'false') {
    btn_win1.disabled = true
    btn_win2.disabled = true
    btn_win3.disabled = true
    dataCollect = false
    btn_win1.style.backgroundColor = 'red'
    btn_win2.style.backgroundColor = 'red'
    btn_win3.style.backgroundColor = 'red'

} else {
    btn_win1.disabled = false
    btn_win2.disabled = false
    btn_win3.disabled = false
    dataCollect = true
    btn_win1.style.backgroundColor = 'rgb(35 143 35)'
    btn_win2.style.backgroundColor = 'rgb(35 143 35)'
    btn_win3.style.backgroundColor = 'rgb(35 143 35)'

}

document.getElementById('data_btn').addEventListener('click', () => {
    let btn_win1 = document.getElementById('btn_win1')
    let btn_win2 = document.getElementById('btn_win2')
    let btn_win3 = document.getElementById('btn_win3')

    if (!btn_win1.disabled, !btn_win2.disabled, !btn_win3.disabled) {
        btn_win1.disabled = true
        btn_win2.disabled = true
        btn_win3.disabled = true
        dataCollect = false
        btn_win1.style.backgroundColor = 'red'
        btn_win2.style.backgroundColor = 'red'
        btn_win3.style.backgroundColor = 'red'
        localStorage.setItem('CollectData', 'false')
    } else {
        btn_win1.disabled = false
        btn_win2.disabled = false
        btn_win3.disabled = false
        dataCollect = true
        btn_win1.style.backgroundColor = 'rgb(35 143 35)'
        btn_win2.style.backgroundColor = 'rgb(35 143 35)'
        btn_win3.style.backgroundColor = 'rgb(35 143 35)'
        localStorage.setItem('CollectData', 'true')
    }

})


document.getElementById('btn_last_five').addEventListener('click', () => {
    do {
        inputLastFiveNumbers = prompt("Digite os 5 ultimos números:")

        if (inputLastFiveNumbers) {
            arrayLastFiveNumbers = inputLastFiveNumbers.split(" ")
            if (arrayLastFiveNumbers.length > 5)
                alert(`Quantidade de números informados inválidos!\nQuantidade informada: ${arrayLastFiveNumbers.length}`)
            console.log(arrayLastFiveNumbers)
        } else
            break;
    } while (arrayLastFiveNumbers.length > 5)

})

document.getElementById('btn_win1').addEventListener('click', () => {
    if (controlBot1) {
        document.getElementById("count_win1").innerHTML = 1
        controlBot1 = false
    } else {
        document.getElementById("count_win1").innerHTML = 0
        controlBot1 = true
    }
})

document.getElementById('btn_win2').addEventListener('click', () => {
    if (controlBot2) {
        document.getElementById("count_win2").innerHTML = 1
        controlBot2 = false
    } else {
        document.getElementById("count_win2").innerHTML = 0
        controlBot2 = true
    }

})

document.getElementById('btn_win3').addEventListener('click', () => {
    if (controlBot3) {
        document.getElementById("count_win3").innerHTML = 1
        controlBot3 = false
    } else {
        document.getElementById("count_win3").innerHTML = 0
        controlBot3 = true
    }
})

document.getElementById("form-data").addEventListener("submit", (event) => {
    var tagLastNum = document.getElementById("last_num")
    if (arrayLastFiveNumbers != null) {
        if (firstClick) {
            event.preventDefault()
            fetch('/admin/array-update', {
                method: 'POST',
                body: JSON.stringify({ arrayLastFiveNumbers }),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Dados enviados', data)
                    tagLastNum.value = ''
                    let botPredict1 = document.getElementById('predict_bot1')
                    let botPredict2 = document.getElementById('predict_bot2')
                    let botPredict3 = document.getElementById('predict_bot3')

                    botPredict1.value = `${data.predict1}`
                    botPredict2.value = `${data.predict2}`
                    botPredict3.value = `${data.predict3}`

                    controlBot1 = true
                    controlBot2 = true
                    controlBot3 = true

                    firstClick = false;
                })
                .catch(error => {
                    console.error('Erro ao enviar dados:', error)
                })
        } else {
            let lastNum = document.getElementById("last_num").value.trim()

            if (!lastNum) {
                alert('Informe um valor!!')
                event.preventDefault()
                return false
            }
            let valueContador = document.getElementById('cont').value
            let valueWinBot1 = document.getElementById("count_win1").innerHTML
            let valueWinBot2 = document.getElementById("count_win2").innerHTML
            let valueWinBot3 = document.getElementById("count_win3").innerHTML
            let numeroDigitado = document.getElementById('ult_num')
            event.preventDefault()
            numeroDigitado.value = lastNum
            tagContador.value = parseInt(valueContador) + 1
            rounds = parseInt(valueContador) + 1
            if (dataCollect) {
                fetch('/admin/submit-data', {
                    method: 'POST',
                    body: JSON.stringify({ lastNum, valueContador, valueWinBot1, valueWinBot2, valueWinBot3, arrayLastFiveNumbers }),
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Dados enviados', data)

                        if (data.win_bot1) {
                            scoreBot1 += 1
                            document.getElementById('score_b1').innerHTML = scoreBot1
                        }
                        if (data.win_bot2) {
                            scoreBot2 += 1
                            document.getElementById('score_b2').innerHTML = scoreBot2
                        }
                        if (data.win_bot3) {
                            scoreBot3 += 1
                            document.getElementById('score_b3').innerHTML = scoreBot3
                        }
                        //Limpando campos
                        tagLastNum.value = ''
                        document.getElementById("count_win1").innerHTML = 0
                        document.getElementById("count_win2").innerHTML = 0
                        document.getElementById("count_win3").innerHTML = 0

                        let botPredict1 = document.getElementById('predict_bot1')
                        let botPredict2 = document.getElementById('predict_bot2')
                        let botPredict3 = document.getElementById('predict_bot3')

                        botPredict1.value = `${data.predict1}`
                        botPredict2.value = `${data.predict2}`
                        botPredict3.value = `${data.predict3}`

                        controlBot1 = true
                        controlBot2 = true
                        controlBot3 = true

                    })
                    .catch(error => {
                        console.error('Erro ao enviar dados:', error)
                    })
            } else {
                fetch('/admin/collect-off', {
                    method: 'POST',
                    body: JSON.stringify({ lastNum, valueContador, valueWinBot1, valueWinBot2, valueWinBot3, arrayLastFiveNumbers }),
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Dados enviados', data)

                        //Limpando campos
                        tagLastNum.value = ''
                        document.getElementById("count_win1").innerHTML = 0
                        document.getElementById("count_win2").innerHTML = 0
                        document.getElementById("count_win3").innerHTML = 0

                        let botPredict1 = document.getElementById('predict_bot1')
                        let botPredict2 = document.getElementById('predict_bot2')
                        let botPredict3 = document.getElementById('predict_bot3')

                        botPredict1.value = `${data.predict1}`
                        botPredict2.value = `${data.predict2}`
                        botPredict3.value = `${data.predict3}`

                        controlBot1 = true
                        controlBot2 = true
                        controlBot3 = true

                    })
                    .catch(error => {
                        console.error('Erro ao enviar dados:', error)
                    })
            }


        }
    } else {
        alert('Informe os ultimos 5 números!!')
        return false
    }

})