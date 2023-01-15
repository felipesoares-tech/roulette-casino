function downloadXlsx() {
    console.log('teste')
    fetch('/admin/submit-data')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log('Erro:', error));
}

var tagContador = document.getElementById('cont')
var rounds = 0
var winBot1 = 0, winBot2 = 0, winBot3 = 0
var inputLastFiveNumbers = 0
var arrayLastFiveNumbers = null
var controlBot1 = true, controlBot2 = true, controlBot3 = true
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

document.getElementById('btn_win1').addEventListener('click', () => {
    if (controlBot1) {
        winBot1 = 1
        document.getElementById("count_win1").innerHTML = winBot1
        controlBot1 = false
    } else {
        winBot1 = 0
        document.getElementById("count_win1").innerHTML = winBot1
        controlBot1 = true
    }
})

document.getElementById('btn_win2').addEventListener('click', () => {
    if (controlBot2) {
        winBot2 = 1
        document.getElementById("count_win2").innerHTML = winBot2
        controlBot2 = false
    } else {
        winBot2 = 0
        document.getElementById("count_win2").innerHTML = winBot2
        controlBot2 = true
    }

})

document.getElementById('btn_win3').addEventListener('click', () => {
    if (controlBot3) {
        winBot3 = 1
        document.getElementById("count_win3").innerHTML = winBot3
        controlBot3 = false
    } else {
        winBot3 = 0
        document.getElementById("count_win3").innerHTML = winBot3
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
            fetch('/admin/submit-data', {
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
    } else {
        alert('Informe os ultimos 5 números!!')
        return false
    }

})