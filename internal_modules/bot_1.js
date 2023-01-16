module.exports = {
    predict(lastNumber) {
        var colums = []
        let last_column, prediction1, prediction2
        let column1_count = 0, column2_count = 0, column3_count = 0

        if (lastNumber <= 12)
            last_column = 1
        else if (lastNumber <= 24)
            last_column = 2
        else
            last_column = 3

        for (let i = 1; i <= 36; i++) {
            if (i <= 12) {
                if (i == lastNumber) {
                    column1_count += 1;
                }
            } else if (i <= 24) {
                if (i == lastNumber) {
                    column2_count += 1;
                }
            } else {
                if (i == lastNumber) {
                    column3_count += 1;
                }
            }
        }

        if (last_column == 1) {
            if (column2_count < column3_count) {
                prediction1 = 2;
                prediction2 = 3;
            } else {
                prediction1 = 3;
                prediction2 = 2;
            }
        } else if (last_column == 2) {
            if (column1_count < column3_count) {
                prediction1 = 1;
                prediction2 = 3;
            } else {
                prediction1 = 3;
                prediction2 = 1;
            }
        } else {
            if (column1_count < column2_count) {
                prediction1 = 1;
                prediction2 = 2;
            } else {
                prediction1 = 2;
                prediction2 = 1;
            }
        }

        colums[0] = prediction1
        colums[1] = prediction2
        colums.sort()
        return colums
    }
}