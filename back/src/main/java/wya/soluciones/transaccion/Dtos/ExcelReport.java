package wya.soluciones.transaccion.Dtos;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ExcelReport {

    private int TotalRows;
    private int ValidRows;
    private List<ExcelReportRow> DuplicatedRows;

}
