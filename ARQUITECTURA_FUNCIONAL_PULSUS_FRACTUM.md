# Pulsus Fractum — Arquitectura funcional y de desarrollo

Documento vivo de la web app de la Escuela de Metalkimia.

## 1. Principio rector

Lo ya construido es materia prima. Primero se recupera, después se refina.

- El archivo original es la fuente de verdad visual y funcional.
- No se reconstruyen movimientos, diagramas o interacciones que ya funcionan.
- Cada transformación se realiza sobre la base existente.
- Se modifica una dimensión por vez y se verifica antes de continuar.
- El responsive original debe conservarse o mejorarse, nunca degradarse.

## 2. Objetivo de la aplicación

Pulsus Fractum debe funcionar simultáneamente como:

1. Presentación pública de la Escuela de Metalkimia.
2. Atlas Vivo explorable.
3. Puerta de acceso al Campus protegido.
4. Entorno de administración, invisible para visitantes y estudiantes.

## 3. Tipos de usuario

### Visitante

Puede recorrer la identidad de la Escuela, el Cosmograma, principios, dominios, Pasajes y descripciones generales de las formaciones.

### Estudiante o Aude

Accede mediante una llave al Campus y puede consultar los contenidos, prácticas, recorridos y herramientas correspondientes.

### Administración

Accede a funciones de edición, importación, exportación y restauración. Estas herramientas nunca aparecen en la interfaz pública.

## 4. Niveles de contenido

### Público

- Atlas Vivo y Cosmograma.
- Escuela y sus cuatro puertas.
- Principios y dominios.
- Pasajes y descripción general.
- Información institucional y de las formaciones.
- Pasaje de Agencia como ejemplo público.

### Reservado

Su existencia es visible, pero el contenido aparece velado y marcado con acceso desde el Campus.

- Contenido revelado completo.
- Correspondencias técnicas.
- Uso metalkímico.
- Movimiento sugerido.
- Ludus y Ludoteca.
- Loop de intervención.
- Glosario técnico.
- Módulos, clases, prácticas y registros personales.

### Administrativo

- Modo de edición.
- Importación y exportación JSON.
- Restauración de información.
- Gestión futura de accesos y contenidos.

## 5. Arquitectura de navegación

### Encabezado institucional

La cabecera pública contiene únicamente:

- Escudo de Pulsus Fractum.
- Nombre de la Escuela y Atlas Vivo.
- Acceso al Campus.
- Menú general.

No muestra herramientas administrativas, contadores provisionales ni iconos sin función real.

### Desktop

- Exploración espacial completa.
- Navegación lateral persistente.
- Cosmograma, cámaras e instrumentos visibles simultáneamente.
- Contenidos abiertos en paneles superpuestos que no destruyen la posición del mapa.
- Hover, profundidad y movimiento como recursos de orientación.

### Tablet horizontal

- Navegación lateral compacta.
- Cosmograma conservado con controles táctiles.
- Paneles de contenido de aproximadamente 70–85% del viewport.

### Tablet vertical

- Composición híbrida próxima a móvil.
- Elementos secundarios colapsables.
- Ninguna acción puede depender exclusivamente del hover.

### Celular

- Recorrido guiado y táctil.
- Barra inferior con Atlas, Escuela, Pasajes y Campus.
- Menú para territorios secundarios.
- Carruseles o recorrido vertical para cámaras y tarjetas.
- Modales presentados como paneles inferiores.
- Área táctil mínima recomendada de 44 × 44 px.

## 6. Identidad visual

- Fondo negro-violeta con movimiento ambiental sutil.
- Dorado bronce en lugar de amarillo intenso.
- Rosa/magenta reservado para activación, selección y Potentia.
- No utilizar filtros que reduzcan la nitidez de escudos o ilustraciones.
- No utilizar etiquetas planas: los controles son piezas dimensionales, facetadas y reactivas.
- El escudo institucional acompaña la cabecera; no compite con el contenido central.

## 7. Accesos

### Decisión de flujo: llave triangular y acumulativa

El acceso del MVP se organiza como una tríada. No son tres formularios independientes: es una misma llave que reconoce cuántos componentes válidos presenta la persona y abre el nivel correspondiente.

1. `POTENTIA` identifica a quien atravesó el reto y abre **Universo Magia para Atrevidos**. Desde allí puede descubrir y recorrer la información pública de la Escuela.
2. La segunda palabra selecciona el alcance: `POTENTIA + METALKIMIA` abre el **Campus general**; `POTENTIA + CUSTOS` (o el nombre de otro Ordo) abre el espacio general de ese **Ordo**.
3. Al nombre del Ordo se le suma una identificación: `POTENTIA + CUSTOS + A17` abre la **cursada específica** correspondiente.

La tercera llave será una credencial entregada al inscribirse. Para el MVP identifica Ordo, cohorte o persona, por ejemplo `CUSTOS-A17`. Más adelante podrá reemplazarse por una identidad individual administrada del lado del servidor.

Los permisos son acumulativos: quien abre el Campus conserva acceso a Escuela y Universo durante la sesión, sin repetir claves.

Flujos principales:

`Potentia → POTENTIA → Universo Magia para Atrevidos`  
`Transmuta o Universo → Escuela pública`  
`Escuela → POTENTIA reconocida + METALKIMIA → Campus general`  
`Puerta → POTENTIA + NOMBRE DEL ORDO → Espacio general del Ordo`  
`Puerta → POTENTIA + NOMBRE DEL ORDO + COHORTE/ID → Cursada específica`

Cuando la persona llega al acceso desde la Escuela, el sistema puede mostrar `POTENTIA` ya reconocida si fue validada previamente. Para el Campus común solicita `METALKIMIA`; para un Ordo, su nombre; para la cursada, la cohorte o ID. La interfaz no explica públicamente las combinaciones ni revela claves válidas.

Esta estructura permite sumar en el futuro otras palabras, grados o recorridos sin crear nuevas puertas dispersas: una combinación distinta puede habilitar otro territorio.

### Presentación pública de los Ordos

- El Campus general puede mostrar Pulsus, Principios, Archivo Vivo, la lógica del sistema y una presentación suficiente de cada Ordo.
- Abrir la ficha de un Ordo no equivale a ingresar en su cursada: sirve para comprender su propósito, contribución y recorrido.
- Cada ficha de Ordo ofrece una única acción, `Ingresar al Ordo`.
- La puerta conserva la llave y el Ordo ya reconocidos como marcas apagadas y solicita solamente la cohorte o ID pendiente.
- `Volver al Atlas Vivo` retorna al cosmograma; nunca abre Principios ni el sistema completo.
- Las palabras no se muestran como ejemplos antes de ser descubiertas. La puerta utiliza los nombres neutros `Llave`, `Territorio` y `Ordo · ID`.

### Campus de prueba

- Llave temporal: `PULSUS2026`.
- Desbloquea contenidos reservados durante la sesión del navegador.
- No habilita automáticamente funciones administrativas.
- Es un recurso transitorio de desarrollo y debe retirarse de la presentación pública cuando el flujo de Potentia esté conectado.

### Acceso definitivo

Pendiente de implementar del lado del servidor. La versión final no debe guardar contraseñas reales dentro del HTML público.

## 8. Integración con el universo MPA

- Pulsus Fractum pertenece a Transmuta.
- Debe existir un retorno discreto hacia la página personal de RCD.
- El logo MPA representa el sistema mayor. Por ahora funciona como sello institucional y no se vincula automáticamente con Universo MPA.
- El escudo Pulsus Fractum representa la Escuela y permanece asociado a su identidad local.

## 9. Estado actual

- Archivo original portado íntegramente a la aplicación.
- Responsive y movimientos originales conservados.
- Paleta refinada hacia violeta y bronce.
- Etiquetas planas sustituidas por controles dimensionales.
- Cabecera pública simplificada.
- Navegación diferenciada para desktop, tablet y celular.
- Administración retirada de la interfaz pública.
- Acceso de Campus de prueba implementado.

## 10. Próximas iteraciones propuestas

1. Sustituir el acceso temporal por la puerta triangular progresiva.
2. Hacer que Potentia recuerde el primer componente validado durante la sesión.
3. Conectar desde la Escuela el acceso a Campus con `POTENTIA` reconocida y los dos componentes restantes.
4. Incorporar movimiento ambiental y retornos institucionales RCD/MPA.
5. Revisar el mapa de contenidos públicos y reservados.
6. Implementar autenticación segura y roles de estudiante/administración.

## 11. Criterios de aceptación generales

- La navegación debe entenderse sin explicación externa.
- Ningún control público debe exponer funciones administrativas.
- Todos los destinos deben ser accesibles mediante teclado y tacto.
- No debe existir desplazamiento horizontal accidental.
- La experiencia debe conservar identidad y detalle en desktop, tablet y celular.
- Cada iteración debe probarse en los tres formatos antes de considerarse terminada.
