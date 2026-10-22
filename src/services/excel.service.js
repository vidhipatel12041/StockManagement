const ExcelJS = require('exceljs');

async function parseExcel(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new Error('No worksheet found in file');

  const rows = [];
  const headerRow = worksheet.getRow(1);
  const headers = headerRow.values.slice(1).map((cell) => (typeof cell === 'string' ? cell.trim() : cell));

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const rowData = {};
    row.values.slice(1).forEach((cellValue, index) => {
      const header = headers[index];
      if (header) rowData[header] = cellValue;
    });
    if (Object.keys(rowData).length > 0) rows.push(rowData);
  });

  return rows;
}

module.exports = { parseExcel };
