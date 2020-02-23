const xlsx = require('xlsx')

 const pointDifference = (filename)=>  {
    const workbook = xlsx.readFile(filename)
    const sheetName = workbook.SheetNames[0]
    const workSheet = workbook.Sheets[sheetName]
    const sheetJSON = xlsx.utils.sheet_to_json(workSheet)
    const final = []
    sheetJSON.forEach((row, i) => {
        if (i !== 0)  {
            const diffObj = {
                N: row['UNPROCESSED(U)'] - row['PROCESSED DATASET(P)'],
                E: row['__EMPTY_4'] - row['__EMPTY_1'],
                Z: row['__EMPTY_5'] - row['__EMPTY_2']
            }
            final.push(diffObj)
        }
    })
    return final
}

module.exports = {
    pointDifference
}