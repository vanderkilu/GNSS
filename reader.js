const xlsx = require("xlsx");

const SHEET_JSON = {
  SHEET_JSON_NORMAL: "",
  EXPORT_SHEET_JSON: ""
};

const pointDifference = filename => {
  const workbook = xlsx.readFile(filename);
  const sheetName = workbook.SheetNames[0];
  const workSheet = workbook.Sheets[sheetName];
  const sheetJSON = xlsx.utils.sheet_to_json(workSheet);
  const final = [];
  sheetJSON.forEach((row, i) => {
    if (i !== 0) {
      const diffObj = {
        ID: "P" + (i + 1),
        N: row["UNPROCESSED(U)"] - row["PROCESSED DATASET(P)"],
        E: row["__EMPTY_4"] - row["__EMPTY_1"]
      };
      final.push(diffObj);
    }
  });
  SHEET_JSON["SHEET_JSON_NORMAL"] = final;
  return final;
};

const pointFilteredDifference = filename => {
  const workbook = xlsx.readFile(filename);
  const sheetName = workbook.SheetNames[0];
  const workSheet = workbook.Sheets[sheetName];
  const sheetJSON = xlsx.utils.sheet_to_json(workSheet);
  final = [];
  sheetJSON.forEach((row, i) => {
    const diffObj = {
      ID: "P" + (i + 1),
      "N/m": row["N/m"] - 29.80707,
      "E/m": row["E/m"] + 6.14656
    };
    final.push(diffObj);
  });
  SHEET_JSON["EXPORT_SHEET_JSON"] = final;
  return final;
};

const exportToSheet = (sheetName, fileName) => {
  const sheet = xlsx.utils.json_to_sheet(SHEET_JSON[sheetName]);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, sheet, "processed");
  xlsx.writeFile(workbook, fileName, { sheet: "processed" });
};

module.exports = {
  pointDifference,
  pointFilteredDifference,
  exportToSheet
};
