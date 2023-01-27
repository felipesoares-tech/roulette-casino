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
var firstClick = true
tagContador.value = 0

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

                })
                .catch(error => {
                    console.error('Erro ao enviar dados:', error)
                })
        }
    } else {
        alert('Informe os ultimos 5 números!!')
        return false
    }

})