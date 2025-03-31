package wya.soluciones.transaccion.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import wya.soluciones.transaccion.Dtos.ExcelReport;
import wya.soluciones.transaccion.Dtos.ExcelReportRow;

@Service
public class ValidationExcelService {

    public ExcelReport validateExcelFile(MultipartFile excel) throws IOException {

        Workbook workbook = new HSSFWorkbook(excel.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        int startRow = 12;
        List<ExcelReportRow> reportRows = new ArrayList<>();
        // se resta la ultima fila para evitar leer la fila de saldo final
        for (int i = startRow; i <= sheet.getLastRowNum() - 1; i++) {
            Row row = sheet.getRow(i);
            ExcelReportRow excelReportRow = ExcelReportRow.builder()
                    .CodeOperation((int) row.getCell(2).getNumericCellValue())
                    .DescriptionOperation(row.getCell(4).getStringCellValue())
                    .RowNumber(i + 1).build();
            reportRows.add(excelReportRow);
        }
        workbook.close();

        List<ExcelReportRow> duplicatedRows = reportRows.stream()
                .collect(Collectors.groupingBy(ExcelReportRow::getCodeOperation))
                .values()
                .stream()
                .filter(list -> list.size() > 1)
                .flatMap(List::stream)
                .toList();

        return ExcelReport.builder()
                .TotalRows(reportRows.size())
                .ValidRows(reportRows.size() - duplicatedRows.size())
                .DuplicatedRows(duplicatedRows)
                .build();

    }
}
