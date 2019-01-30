$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var conn = $.db.getConnection();

function ValidarClaveMovil(ClaveMovil){
	try	{
		var mQuery = 'select count(*) as "last" from '+Constants.BD_MOBILE+'."ORDR" ' +
		             ' where "ClaveMovil" = \'' + ClaveMovil + '\'';
		var mConn = $.hdb.getConnection();
		var rs = mConn.executeQuery(mQuery);
		mConn.close();
		
		var res = 0;
		
		if (rs.length > 0)
		{
			res = parseInt(rs[0].last.toString());
		}else{
			res = 0;
		}
		
		return res;
	}catch(e){
		return -1;
	}
}

function ValidarDocumento(ordr){
    
    var res = Constants.MESSAGE_SUCCESS;
    
    try{
        
        var valCM = ValidarClaveMovil(ordr.ClaveMovil);
        if(valCM > 0){
            res = "Ya existe un registro con la Clave Movil indicada.";
        }else if(valCM === -1){
            res = "Ocurrió un error intentando comprobar la Clave Movil del documento.";
        }else if(ordr.OrderLines.length <= 0){
            res = "No se puede registrar el documento sin el detalle.";
        }else if(ordr.ClaveMovil === undefined || ordr.ClaveMovil === ''){
            res = "No se puede registrar el documento sin la ClaveMovil";
        }else if(ordr.TransaccionMovil === undefined || ordr.TransaccionMovil === ''){
            res = "Se debe indicar el tipo de Transaccion Movil del documento.";
        }else if(ordr.EmpleadoVenta === undefined || ordr.EmpleadoVenta === ''){
            res = "Se debe indicar el empleado de venta.";
        }else if(ordr.Moneda === undefined || ordr.Moneda === ''){
            res = "Se debe indicar la moneda del documento.";
        }else if(ordr.CondicionPago === undefined || ordr.CondicionPago === ''){
            res = "Se debe indicar la condición de pago del documento.";
        }else if(ordr.SocioNegocio === undefined || ordr.SocioNegocio === ''){
            res = "Se debe indicar el socio de negocio de documento.";
        }else if(ordr.FechaContable === undefined || ordr.FechaContable === ''){
            res = "Se debe indicar la fecha contable del documento.";
        }else if(ordr.FechaVencimiento === undefined || ordr.FechaVencimiento === ''){
            res = "Se debe indicar la fecha de vencimiento del documento.";
        }else if(ordr.Empresa === undefined || ordr.Empresa === ''){
            res = "El documento debe estar dirigido a una sociedad (Empresa) en específico.";
        }
        
    }catch(e){
        res = e.message;
    }
    
    return res;
}

function RegistrarCabecera(ordr){
    
    var insertResult = Constants.MESSAGE_SUCCESS;
    
    try{
        
        var query = 'insert into '+Constants.BD_MOBILE+'."ORDR" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        var pstmt = conn.prepareStatement(query);   
        
        pstmt.setString(1, ordr.ClaveMovil);
        pstmt.setString(2, ordr.TransaccionMovil);
        pstmt.setString(3, ordr.SocioNegocio);
        pstmt.setString(4, ordr.ListaPrecio);
        pstmt.setString(5, ordr.CondicionPago);
        pstmt.setString(6, ordr.Indicador);
        pstmt.setString(7, ordr.Referencia);
        pstmt.setString(8, ordr.FechaContable);
        pstmt.setString(9, ordr.FechaVencimiento);
        pstmt.setString(10, ordr.Moneda);
        pstmt.setString(11, ordr.EmpleadoVenta);
        pstmt.setString(12, ordr.DireccionFiscal);
        pstmt.setString(13, ordr.DireccionEntrega);
        pstmt.setString(14, ordr.Comentario);
        pstmt.setString(15, 'N');
        pstmt.setString(16, 'N');
        pstmt.setString(17, 'N');
        pstmt.setString(18, '');
        pstmt.setString(19, '');
        pstmt.setInt(20, ordr.Empresa);
        pstmt.setString(21, ordr.Rango);
        pstmt.setString(22, ordr.Latitud);
        pstmt.setString(23, ordr.Longitud);
        if(ordr.hasOwnProperty('Hora')){
            pstmt.setString(24, ordr.Hora);
        }else{
            pstmt.setString(24, '');
        }
        if(ordr.hasOwnProperty('Conectado')){
            pstmt.setString(25, ordr.Conectado);
        }else{
            pstmt.setString(25, '');
        }
        if(ordr.hasOwnProperty('Descuento')){
            pstmt.setDouble(26, ordr.Descuento);
        }else{
            pstmt.setDouble(26, 0);
        }
        pstmt.execute();
        
    }catch(e){
        insertResult = e.message;
    }
    
    return insertResult;
}

function RegistrarDetalle(ClaveMovil,lines){
    
    var insertResult = Constants.MESSAGE_SUCCESS;
    var i;
    
    try{
        
        for(i = 0; i < lines.length ; i++)
		{
		    var query = 'insert into '+Constants.BD_MOBILE+'."RDR1" values(?,?,?,?,?,?,?,?,?,?)';
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
	
	if (params !== undefined)
	{
	    //convertir los parámetros a JSON
		var ordrCabe = JSON.parse(params);
		
		//validar las propiedades del documento
		var messageValidation = ValidarDocumento(ordrCabe);
		
		if(messageValidation === Constants.MESSAGE_SUCCESS){
		    
		    //realizar el registro en la BD de la cabecera del documento
		    var resCabe = RegistrarCabecera(ordrCabe);
		        
		    if(resCabe === Constants.MESSAGE_SUCCESS){
		            
	            //realizar el registro de las lineas del documento
	            var resDet = RegistrarDetalle(ordrCabe.ClaveMovil, ordrCabe.OrderLines);
	            
	            if(resDet === Constants.MESSAGE_SUCCESS){
	                objType = Constants.SUCCESS_MESSAGE_RESPONSE;
			        objResult = functions.CreateJSONMessage(ordrCabe.ClaveMovil, Constants.MESSAGE_SUCCESS);
			        conn.commit();
			        
			        functions.AddLogRegister(ordrCabe.Empresa, ordrCabe.EmpleadoVenta, ordrCabe.ClaveMovil, 
			            Constants.DOCTYPE_SALES_ORDER, "Registrado en base intermedia. ", 
			            Constants.SOURCE_APP_TO_BD, 
			            Constants.TYPE_SUCCESS);
			        
	            }else{
	                conn.rollback();
	                objType = Constants.ERROR_MESSAGE_RESPONSE;  
		            objResult = functions.CreateJSONMessage(-103, resDet);
		            
		            functions.AddLogRegister(ordrCabe.Empresa, ordrCabe.EmpleadoVenta, ordrCabe.ClaveMovil, 
			            Constants.DOCTYPE_SALES_ORDER, "Error registrando detalle " + resDet, 
			            Constants.SOURCE_APP_TO_BD, 
			            Constants.TYPE_ERROR);
	            }
            }else{
                conn.rollback();
                objType = Constants.ERROR_MESSAGE_RESPONSE;  
    	        objResult = functions.CreateJSONMessage(-102, resCabe);
    	        
    	        functions.AddLogRegister(ordrCabe.Empresa, ordrCabe.EmpleadoVenta, ordrCabe.ClaveMovil, 
			            Constants.DOCTYPE_SALES_ORDER, "Error registrando cabecera " + resCabe, 
			            Constants.SOURCE_APP_TO_BD, 
			            Constants.TYPE_ERROR);
            }
		}else{
		    objType = Constants.ERROR_MESSAGE_RESPONSE;  
			objResult = functions.CreateJSONMessage(-101, "Validación de documento fallida: " + messageValidation);
			
			functions.AddLogRegister(ordrCabe.Empresa, ordrCabe.EmpleadoVenta, ordrCabe.ClaveMovil, 
			            Constants.DOCTYPE_SALES_ORDER, messageValidation, Constants.SOURCE_APP_TO_BD, Constants.TYPE_ERROR);
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