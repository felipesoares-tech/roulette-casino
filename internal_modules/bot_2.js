module.exports = {
    predict(lastNumber, ultimos_numeros) {
        let contador_coluna1 = 0, contador_coluna2 = 0, contador_coluna3 = 0
        let proxima_coluna1, proxima_coluna2

        for (let i = 0; i < 5; i++) {
            if (ultimos_numeros[i] % 3 === 1) {
                contador_coluna1++;
            } else if (ultimos_numeros[i] % 3 === 2) {
                contador_coluna2++;
            } else {
                contador_coluna3++;
            }
        }

        if (contador_coluna1 >= contador_coluna2 && contador_coluna1 >= contador_coluna3) {
            proxima_coluna1 = (lastNumber + 1) % 3 + 1
            proxima_coluna2 = (lastNumber + 2) % 3 + 1
        } else if (contador_coluna2 >= contador_coluna1 && contador_coluna2 >= contador_coluna3) {
            proxima_coluna1 = (lastNumber + 2) % 3 + 1
            proxima_coluna2 = (lastNumber + 3) % 3 + 1
        } else {
            proxima_coluna1 = (lastNumber + 3) % 3 + 1
            proxima_coluna2 = (lastNumber + 1) % 3 + 1
        }

        contador_coluna1 = 0
        contador_coluna2 = 0
        contador_coluna3 = 0

        return `${proxima_coluna1} e ${proxima_coluna2}`

    }
}







