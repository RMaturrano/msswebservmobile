$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var conn = $.db.getConnection();
var YA_EXISTE_CLAVE = 'Ya existe un registro con la Clave Movil indicada';

function ValidarClaveMovil(ClaveMovil){
	try	{
		var mQuery = 'select count(*) as "last" from '+Constants.BD_MOBILE+'."OCLG" ' +
		             ' where "CLAVEMOVIL" = \'' + ClaveMovil + '\'';
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

function ValidarDocumento(oclg){
    
    var res = Constants.MESSAGE_SUCCESS;
    
    try{
        
        var valCM = ValidarClaveMovil(oclg.ClaveMovil);
        if(valCM > 0){
            res = YA_EXISTE_CLAVE;
        }else if(valCM === -1){
            res = "Ocurrió un error intentando comprobar la Clave Movil del documento.";
        }
        
    }catch(e){
        res = e.message;
    }
    
    return res;
}

function RegistrarCabecera(oclg){
    
    var insertResult = Constants.MESSAGE_SUCCESS;
    
    try{
        
        var query = 'insert into '+Constants.BD_MOBILE+'."OCLG" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        var pstmt = conn.prepareStatement(query);   
        
        pstmt.setString(1, oclg.ClaveMovil.toString());
        pstmt.setString(2, oclg.Origen.toString());
        pstmt.setString(3, oclg.CodigoCliente.toString());
        pstmt.setString(4, oclg.CodigoContacto.toString());
        pstmt.setString(5, oclg.CodigoDireccion.toString());
        pstmt.setInt(6, oclg.CodigoMotivo);
        pstmt.setString(7, oclg.Comentarios.toString());
        pstmt.setInt(8, oclg.Vendedor);
        pstmt.setString(9, oclg.Latitud.toString());
        pstmt.setString(10, oclg.Longitud.toString());
        pstmt.setString(11, oclg.FechaCreacion.toString());
        pstmt.setString(12, oclg.HoraCreacion.toString());
        pstmt.setString(13, oclg.ModoOffLine.toString());
        pstmt.setInt(14, oclg.ClaveFactura);
        pstmt.setString(15, oclg.SerieFactura.toString());
        pstmt.setInt(16, oclg.CorrelativoFactura);
        pstmt.setString(17, oclg.TipoIncidencia.toString());
        pstmt.setString(18, oclg.FechaPago.toString());
        pstmt.setString(19, 'N');
        pstmt.setString(20, 'N');
        pstmt.setString(21, 'N');
        pstmt.setInt(22, -1);
        pstmt.setString(23, '');
        pstmt.setInt(24, oclg.Empresa);
        pstmt.setString(25, oclg.Rango);
        //pstmt.setString(26, oclg.Foto64);
        
        if(oclg.hasOwnProperty('Foto64')){
            pstmt.setText(26, oclg.Foto64);    
        }else{
            pstmt.setText(26, '');
        }
        
        pstmt.execute();
        
    }catch(e){
        insertResult = e.message;
    }
    
    return insertResult;
}

var params;
try{

	params = $.request.body.asString();
	
	if (params !== undefined)
	{
	    //convertir los parámetros a JSON
		var objActivity = JSON.parse(params);
		
		//validar las propiedades del documento
		var messageValidation = ValidarDocumento(objActivity);
		
		if(messageValidation === Constants.MESSAGE_SUCCESS){
		    
		    //realizar el registro en la BD de la cabecera del documento
		    var resCabe = RegistrarCabecera(objActivity);
		        
		    if(resCabe === Constants.MESSAGE_SUCCESS){
		        
                objType = Constants.SUCCESS_MESSAGE_RESPONSE;
		        objResult = functions.CreateJSONMessage(objActivity.ClaveMovil, Constants.MESSAGE_SUCCESS);
		        conn.commit();
		        
		        functions.AddLogRegister(objActivity.Empresa, -1, objActivity.ClaveMovil, 
		            Constants.DOCTYPE_INCIDENCIA, "Registrado en base intermedia. ", 
		            Constants.SOURCE_APP_TO_BD, 
		            Constants.TYPE_SUCCESS);

            }else{
                conn.rollback();
                objType = Constants.ERROR_MESSAGE_RESPONSE;  
    	        objResult = functions.CreateJSONMessage(-102, resCabe + " - " + params);
    	        
    	        functions.AddLogRegister(objActivity.Empresa, -1, objActivity.ClaveMovil, 
			            Constants.DOCTYPE_INCIDENCIA, "Error registrando objeto " + resCabe, 
			            Constants.SOURCE_APP_TO_BD, 
			            Constants.TYPE_ERROR);
            }
		}else{
		    if(messageValidation === YA_EXISTE_CLAVE){
		        objType = Constants.ERROR_MESSAGE_RESPONSE;  
			    objResult = functions.CreateJSONMessage(-201, messageValidation);
		    }else{
		        objType = Constants.ERROR_MESSAGE_RESPONSE;  
			    objResult = functions.CreateJSONMessage(-101, "Validación de documento fallida: " + messageValidation);
		    }
		    
		    functions.AddLogRegister(objActivity.Empresa, -1, objActivity.ClaveMovil, 
			            Constants.DOCTYPE_INCIDENCIA, messageValidation, Constants.SOURCE_APP_TO_BD, Constants.TYPE_ERROR);   
		}
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;  
		objResult = functions.CreateJSONMessage(-100, "No ha ingresado los parámetros de entrada.");
	}
	
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse,objType);
	
}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;  
	objResult = functions.CreateJSONMessage(-9703000, e.message + " - " + params);
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse, objType);
}finally{
    conn.close();
}