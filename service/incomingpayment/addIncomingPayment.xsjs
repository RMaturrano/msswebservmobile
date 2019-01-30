$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var conn = $.db.getConnection();
var actualizado = 'N';

function EliminarRegistro(ClaveMovil){
    
    var res = Constants.MESSAGE_SUCCESS;
    
    try{
        var pstmt;
        var mQueryCabe = 'delete from '+Constants.BD_MOBILE+'."ORCT" ' +
		             'where "ClaveMovil" = \'' + ClaveMovil + '\'';
        var mQueryDet = 'delete from '+Constants.BD_MOBILE+'."RCT1" ' +
                     'where "ClaveMovil" = \'' + ClaveMovil + '\'';
		var mConn = $.hdb.getConnection();
		pstmt = conn.prepareStatement(mQueryCabe);   
        pstmt.execute();
        pstmt = conn.prepareStatement(mQueryDet);   
        pstmt.execute();
		mConn.close();
    }catch(e){
        res = e.message;
    }
    
    return res;
}

function ValidarClaveMovil(ClaveMovil){
	try	{
		var mQuery = 'select count(*) as "last" from '+Constants.BD_MOBILE+'."ORCT" ' +
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

function ValidarDocumento(orct){
    
    var res = Constants.MESSAGE_SUCCESS;
    
    try{
        
        var valCM = ValidarClaveMovil(orct.ClaveMovil);
        if(valCM > 0){
            
            //Si existe marcamos el flag actualizado como SI y eliminamos
	        //el registro para crearlo nuevamente
	        actualizado = 'Y';
	        res = EliminarRegistro(orct.ClaveMovil);
            
        }else if(valCM === -1){
            res = "Ocurrió un error intentando comprobar la Clave Movil del documento.";
        }
        
        if(orct.Lines.length <= 0){
            res = "No se puede registrar el documento sin el detalle.";
        }else if(orct.ClaveMovil === undefined || orct.ClaveMovil === ''){
            res = "No se puede registrar el documento sin la ClaveMovil";
        }else if(orct.EmpleadoVenta === undefined || orct.EmpleadoVenta === ''){
            res = "Se debe indicar el empleado de venta.";
        }else if(orct.SocioNegocio === undefined || orct.SocioNegocio === ''){
            res = "Se debe indicar el socio de negocio de documento.";
        }else if(orct.FechaContable === undefined || orct.FechaContable === ''){
            res = "Se debe indicar la fecha contable del documento.";
        }else if(orct.Empresa === undefined || orct.Empresa === ''){
            res = "El documento debe estar dirigido a una sociedad (Empresa) en específico.";
        }
        
    }catch(e){
        res = e.message;
    }
    
    return res;
}

function RegistrarCabecera(orct){
    
    var insertResult = Constants.MESSAGE_SUCCESS;
    
    try{
        
        var query = 'insert into '+Constants.BD_MOBILE+'."ORCT" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        var pstmt = conn.prepareStatement(query);   
        
        pstmt.setString(1, orct.ClaveMovil);
        pstmt.setString(2, orct.TransaccionMovil);
        pstmt.setString(3, orct.SocioNegocio);
        pstmt.setString(4, orct.EmpleadoVenta);
        pstmt.setString(5, orct.Comentario);
        pstmt.setString(6, orct.Glosa);
        pstmt.setString(7, orct.FechaContable);
        pstmt.setString(8, orct.TipoPago);
        pstmt.setString(9, orct.Moneda);
        pstmt.setString(10, orct.ChequeCuenta);
        pstmt.setString(11, orct.ChequeBanco);
        pstmt.setString(12, orct.ChequeVencimiento);
        pstmt.setDecimal(13, orct.ChequeImporte);
        pstmt.setInt(14, orct.ChequeNumero);
        pstmt.setString(15, orct.TransferenciaCuenta);
        pstmt.setString(16, orct.TransferenciaReferencia);
        pstmt.setDecimal(17, orct.TransferenciaImporte);
        pstmt.setString(18, orct.EfectivoCuenta);
        pstmt.setDecimal(19, orct.EfectivoImporte);
        pstmt.setString(20, 'N');
        pstmt.setString(21, actualizado);
        pstmt.setString(22, 'N');
        pstmt.setInt(23, -1);
        pstmt.setString(24, '');
        pstmt.setInt(25, orct.Empresa);
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
		    var query = 'insert into '+Constants.BD_MOBILE+'."RCT1" values(?,?,?,?)';
            var pstmt = conn.prepareStatement(query);   
            
            pstmt.setString(1, ClaveMovil);
            pstmt.setInt(2, -1);
            pstmt.setInt(3, lines[i].FacturaCliente);
            pstmt.setDecimal(4, lines[i].Importe);
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
		var mIncomingPymnt = JSON.parse(params);
		
		//validar las propiedades del documento
		var messageValidation = ValidarDocumento(mIncomingPymnt);
		
		if(messageValidation === Constants.MESSAGE_SUCCESS){
		    
		    //realizar el registro en la BD de la cabecera del documento
		    var resCabe = RegistrarCabecera(mIncomingPymnt);
		        
		    if(resCabe === Constants.MESSAGE_SUCCESS){
		            
	            //realizar el registro de las lineas del documento
	            var resDet = RegistrarDetalle(mIncomingPymnt.ClaveMovil, mIncomingPymnt.Lines);
	            
	            if(resDet === Constants.MESSAGE_SUCCESS){
	                objType = Constants.SUCCESS_MESSAGE_RESPONSE;
			        objResult = functions.CreateJSONMessage(mIncomingPymnt.ClaveMovil, Constants.MESSAGE_SUCCESS);
			        conn.commit();
			        
			        functions.AddLogRegister(mIncomingPymnt.Empresa, mIncomingPymnt.EmpleadoVenta, mIncomingPymnt.ClaveMovil, 
			            Constants.DOCTYPE_INCOMING_PAYMENT, "Registrado en base intermedia. ", 
			            Constants.SOURCE_APP_TO_BD, 
			            Constants.TYPE_SUCCESS);
			        
	            }else{
	                conn.rollback();
	                objType = Constants.ERROR_MESSAGE_RESPONSE;  
		            objResult = functions.CreateJSONMessage(-103, resDet);
		            
		            functions.AddLogRegister(mIncomingPymnt.Empresa, mIncomingPymnt.EmpleadoVenta, mIncomingPymnt.ClaveMovil, 
			            Constants.DOCTYPE_INCOMING_PAYMENT, "Error registrando detalle " + resDet, 
			            Constants.SOURCE_APP_TO_BD, 
			            Constants.TYPE_ERROR);
	            }
            }else{
                conn.rollback();
                objType = Constants.ERROR_MESSAGE_RESPONSE;  
    	        objResult = functions.CreateJSONMessage(-102, resCabe);
    	        
    	        functions.AddLogRegister(mIncomingPymnt.Empresa, mIncomingPymnt.EmpleadoVenta, mIncomingPymnt.ClaveMovil, 
			            Constants.DOCTYPE_INCOMING_PAYMENT, "Error registrando cabecera " + resCabe, 
			            Constants.SOURCE_APP_TO_BD, 
			            Constants.TYPE_ERROR);
            }
		}else{
		    objType = Constants.ERROR_MESSAGE_RESPONSE;  
			objResult = functions.CreateJSONMessage(-101, "Validación de documento fallida: " + messageValidation);
			
			functions.AddLogRegister(mIncomingPymnt.Empresa, mIncomingPymnt.EmpleadoVenta, mIncomingPymnt.ClaveMovil, 
			            Constants.DOCTYPE_INCOMING_PAYMENT, messageValidation, Constants.SOURCE_APP_TO_BD, Constants.TYPE_ERROR);
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