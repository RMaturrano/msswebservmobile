$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function GetColumnsToUpdate(ordr){
    try{
        
        var filterCol = [];
        
        if(ordr.hasOwnProperty('TransaccionMovil')){
            filterCol.push('"TransaccionMovil" = \''+ordr.TransaccionMovil+'\' ');
        }
        
        if(ordr.hasOwnProperty('SocioNegocio')){
            filterCol.push('"SocioNegocio" = \''+ordr.SocioNegocio+'\' ');
        }
        
        if(ordr.hasOwnProperty('ListaPrecio')){
            filterCol.push('"ListaPrecio" = \''+ordr.ListaPrecio+'\' ');
        }
        
        if(ordr.hasOwnProperty('CondicionPago')){
            filterCol.push('"CondicionPago" = \''+ordr.CondicionPago+'\' ');
        }
        
        if(ordr.hasOwnProperty('Indicador')){
            filterCol.push('"Indicador" = \''+ordr.Indicador+'\' ');
        }
        
        if(ordr.hasOwnProperty('Referencia')){
            filterCol.push('"Referencia" = \''+ordr.Referencia+'\' ');
        }
        
        if(ordr.hasOwnProperty('FechaVencimiento')){
            filterCol.push('"FechaVencimiento" = \''+ordr.FechaVencimiento+'\' ');
        }
        
        if(ordr.hasOwnProperty('DireccionFiscal')){
            filterCol.push('"DireccionFiscal" = \''+ordr.DireccionFiscal+'\' ');
        }
        
        if(ordr.hasOwnProperty('DireccionEntrega')){
            filterCol.push('"DireccionEntrega" = \''+ordr.DireccionEntrega+'\' ');
        }
        
        if(ordr.hasOwnProperty('Comentario')){
            filterCol.push('"Comentario" = \''+ordr.Comentario+'\' ');
        }
        
        if(ordr.hasOwnProperty('Migrado')){
            filterCol.push('"Migrado" = \''+ordr.Migrado+'\' ');
        }
        
        if(ordr.hasOwnProperty('Actualizado')){
            filterCol.push('"Actualizado" = \''+ordr.Actualizado+'\' ');
        }
        
        if(ordr.hasOwnProperty('Finalizado')){
            filterCol.push('"Finalizado" = \''+ordr.Finalizado+'\' ');
        }
        
        if(ordr.hasOwnProperty('DocEntry')){
            filterCol.push('"DocEntry" = \''+ordr.DocEntry+'\' ');
        }
        
        if(ordr.hasOwnProperty('Mensaje')){
            filterCol.push('"Mensaje" = \''+ordr.Mensaje+'\' ');
        }
        
        return filterCol.join(',');
        
    }catch(e){
        return undefined;
    }
}

function ValidarDocumento(ordr){
    
    var res = Constants.MESSAGE_SUCCESS;
    
    try{
        
        if(ordr.hasOwnProperty('TransaccionMovil') && (ordr.TransaccionMovil === undefined || ordr.TransaccionMovil === '')){
            res = "Se debe indicar el tipo de Transaccion Movil del documento.";
        }else if(ordr.hasOwnProperty('EmpleadoVenta') && (ordr.EmpleadoVenta === undefined || ordr.EmpleadoVenta === '')){
            res = "Se debe indicar el empleado de venta.";
        }else if(ordr.hasOwnProperty('Moneda') && (ordr.Moneda === undefined || ordr.Moneda === '')){
            res = "Se debe indicar la moneda del documento.";
        }else if(ordr.hasOwnProperty('CondicionPago') && (ordr.CondicionPago === undefined || ordr.CondicionPago === '')){
            res = "Se debe indicar la condición de pago del documento.";
        }else if(ordr.hasOwnProperty('SocioNegocio') && (ordr.SocioNegocio === undefined || ordr.SocioNegocio === '')){
            res = "Se debe indicar el socio de negocio de documento.";
        }else if(ordr.hasOwnProperty('FechaContable') && (ordr.FechaContable === undefined || ordr.FechaContable === '')){
            res = "Se debe indicar la fecha contable del documento.";
        }else if(ordr.hasOwnProperty('FechaVencimiento') && (ordr.FechaVencimiento === undefined || ordr.FechaVencimiento === '')){
            res = "Se debe indicar la fecha de vencimiento del documento.";
        }else if(ordr.Empresa === undefined || ordr.Empresa === ''){
            res = "El documento debe estar dirigido a una sociedad (Empresa) en específico.";
        }
        
    }catch(e){
        res = e.message;
    }
    
    return res;
}

function ActualizarCabecera(ordr, empresa, orden){
    
    var updateResult = Constants.MESSAGE_SUCCESS;
    var columns;
    try{
        
        query = ' UPDATE '+Constants.BD_MOBILE+'."ORDR" SET  ';
        var where = ' where "ClaveMovil" = \''+orden+'\' AND "EMPRESA"  = ' + empresa;
        columns = GetColumnsToUpdate(JSON.parse(ordr));
        
        if(columns !== undefined && columns !== ''){
            query += columns;
            query += where;
            
            var pstmt = conn.prepareStatement(query);   
            pstmt.execute();
            
        }else{
            updateResult = 'No columns found.' + ' q ' + query + ' o ' + ordr + ' c ' + columns;
        }
                    
    }catch(e){
        updateResult = e.message;
    }
    
    return updateResult;
}

function ActualizarDetalle(ClaveMovil,lines){
    
    var insertResult = Constants.MESSAGE_SUCCESS;
    var i;
    
    try{
        
        for(i = 0; i < lines.length ; i++)
		{
		    query = 'insert into '+Constants.BD_MOBILE+'."RDR1" values(?,?,?,?,?,?,?,?,?,?)';
            var pstmt = conn.prepareStatement(query);   
            
            pstmt.setString(1, ClaveMovil);
            pstmt.setString(2, lines[i].Linea);
            pstmt.setString(3, lines[i].Articulo);
            pstmt.setString(4, lines[i].UnidadMedida);
            pstmt.setString(5, lines[i].Almacen);
            pstmt.setString(6, lines[i].Cantidad);
            pstmt.setString(7, lines[i].ListaPrecio);
            pstmt.setString(8, lines[i].PrecioUnitario);
            pstmt.setString(9, lines[i].PorcentajeDescuento);
            pstmt.setString(10, lines[i].Impuesto);
            pstmt.execute();
		}
		
    }catch(e){
        insertResult = e.message;
    }
    
    return insertResult;
}

try{

	var params = $.request.body.asString();
	var empId = $.request.parameters.get('empId');
	var ordrId = $.request.parameters.get('ordrId');
	
	if (params !== undefined && empId !== undefined && ordrId !== undefined)
	{
	    conn = $.db.getConnection();
	    
	    //convertir los parámetros a JSON
		var ordrCabe = JSON.parse(params);
 
	    //realizar el registro en la BD de la cabecera del documento
	    var resCabe = ActualizarCabecera(ordrCabe, empId, ordrId);
	        
	    if(resCabe === Constants.MESSAGE_SUCCESS){
	            
            if(ordrCabe.hasOwnProperty('OrderLines') && ordrCabe.OrderLines.length > 0){
	            var resDet = ActualizarDetalle(ordrId, ordrCabe.OrderLines);
	            
	            if(resDet === Constants.MESSAGE_SUCCESS){
	                objType = Constants.SUCCESS_MESSAGE_RESPONSE;
			        objResult = functions.CreateJSONMessage(empId, Constants.MESSAGE_SUCCESS);
			        conn.commit();
	            }else{
	                conn.rollback();
	                objType = Constants.ERROR_MESSAGE_RESPONSE;  
		            objResult = functions.CreateJSONMessage(-103, resDet);
	            }
            }else{
                objType = Constants.SUCCESS_MESSAGE_RESPONSE;
		        objResult = functions.CreateJSONMessage(empId, Constants.MESSAGE_SUCCESS);
		        conn.commit();
            }
        }else{
            conn.rollback();
            objType = Constants.ERROR_MESSAGE_RESPONSE;  
	        objResult = functions.CreateJSONMessage(-102, resCabe);
        }
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;  
		objResult = functions.CreateJSONMessage(-100, "No ha ingresado los parámetros de entrada.");
	}
	
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse,objType);
	
}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;  
	objResult = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse, objType);
}finally{
    conn.close();
}