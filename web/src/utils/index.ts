import Excel from 'exceljs';
// 把obj中的值与 obj2值比较，不同的保留，白名单中的保留

export const exclude = (obj: Record<string, any>, obj2: Record<string, any>, whiteKeys = ['id']) => {

    const temp: Record<string, any> = {};

    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (!whiteKeys.includes(key)) {
            if (obj[key] !== obj2[key]) temp[key] = value
        } else temp[key] = value
    })


    return temp;

}

export const filterObj = (obj: Record<string, any>) => {

    const temp: Record<string, any> = {};

    Object.keys(obj).forEach(key => {

        const value = obj[key];

        if (value !== undefined || value !== '')
            temp[key] = value;

    })

    return temp;

}

export const downloadFile = (data: Blob, filename: string = 'file.xlsx') => {

    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

export type XlsxColumn = { value: string, label: string };

export const exportXlsxFile = async (columns: XlsxColumn[], rows: any[][]) => {

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet('sheet');
    sheet.columns = columns.map(({label, value}) => ({header: label, key: value}));
    sheet.addRows(rows);
    const buffer = await workbook.xlsx.writeBuffer();
    downloadFile(new Blob([buffer]), `${Date.now()}.xlsx`);
}

export const importXlsxFile = (file: File) => {

    const reader = new FileReader();

    reader.onload = async (e) => {
        const buffer = e?.target?.result;

        if (buffer instanceof ArrayBuffer) {

            const workbook = new Excel.Workbook();

            await workbook.xlsx.load(buffer);

            workbook.eachSheet(function (worksheet, sheetId) {

                console.log('sheetId :', sheetId);

                worksheet.eachRow(function (row, rowNumber) {
                    // console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
                    console.log('rowNumber :', rowNumber);
                    row.eachCell(function (cell, colNumber) {
                        console.log('Cell ' + colNumber + ' = ' + cell.value);
                    });
                });

                // todo... insert to db;


            });
        }

    }

    reader.readAsArrayBuffer(file);


}