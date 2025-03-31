# Validación y Visualización de Operaciones Bancarias en Excel

## Descripción

Se sube un archivo Excel (.xls) con operaciones bancarias y se procesa su contenido. Se contabilizan las filas (operaciones) y se detectan duplicados de manera grafica.

## Tecnologías Utilizadas

- **Backend:** Java Spring Boot (Spring Web)
- **Frontend:** HTML, CSS, JavaScript (Fetch API)

## Justificación de Decisiones

- **Spring Boot**: Facilita la manipulacion de datos y procesamiento de archivos. Ademas agiliza el desarrollo de apis
- **Fetch API**: Para consumir apis.

## Posibles Dificultades y Soluciones

- **Formato Incorrecto :** Usar unicamente el formato `.xls` .
- **Archivos Vacíos:** Se maneja una respuesta de error clara para el usuario.
- **Detección de Datos Duplicados:** Se implementa una lista de registros repetidos y se alertan visualmente.
- **Errores de pricesamiento:** Se recomienda el uso de esta plantilla como base [descargar el archivo bbva soles_fullstack.xls](./bbva%20soles_fullstack.xls)

## Ejecución

1. **Iniciar el Docker-compose:** Ejecuta `compose up` del archico [docker-compose.yaml](./docker-compose.yaml) .
2. **Abrir `http://localhost/` en el navegador.**
