package wya.soluciones.transaccion.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import wya.soluciones.transaccion.Dtos.ExcelReport;
import wya.soluciones.transaccion.Service.ValidationExcelService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
public class ValidationExcelController {
    private final ValidationExcelService validationExcelService;

    @PostMapping("/validateExcel")
    public ResponseEntity<?> validaExcel(@RequestParam(required = true) MultipartFile excel) {
        if (excel == null) {
            return ResponseEntity.badRequest().body("El archivo no puede ser nulo.");

        }
        if (!excel.getOriginalFilename().endsWith(".xls")) {
            return ResponseEntity.badRequest().body("El archivo no es un archivo de Excel válido.");
        }

        if (excel.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo está vacío.");
        }

        try {
            ExcelReport report = validationExcelService.validateExcelFile(excel);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al procesar el archivo: " + e.getMessage());
        }

    }

}
