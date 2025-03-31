
package wya.soluciones.transaccion.Dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ExcelReportRow {
    private Integer CodeOperation;
    private String DescriptionOperation;
    private Integer RowNumber;

}