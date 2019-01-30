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
		var mQuery = 'select count(*) as "last" from '+Constants.BD_MOBILE+'."OCRD" ' +
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

function ValidarDocumento(ocrd){
    
    var res = Constants.MESSAGE_SUCCESS;
    
    try{
        
        var valCM = ValidarClaveMovil(ocrd.ClaveMovil);
        if(valCM > 0){
            res = "Ya existe un registro con la Clave Movil indicada.";
        }else if(valCM === -1){
            res = "Ocurrió un error intentando comprobar la Clave Movil del documento.";
        }
        
    }catch(e){
        res = e.message;
    }
    
    return res;
}

function RegistrarContactos(ClaveMovil,contactos){
    
    var insertResult = Constants.MESSAGE_SUCCESS;
    var i;
    
    try{
        
        for(i = 0; i < contactos.length ; i++)
		{
		    var query = 'insert into '+Constants.BD_MOBILE+'."CRD1" values(?,?,?,?,?,?,?,?,?,?,?)';
            var pstmt = conn.prepareStatement(query);   
            
            pstmt.setString(1, ClaveMovil);
            pstmt.setString(2, contactos[i].IdContacto);
            pstmt.setString(3, contactos[i].PrimerNombre);
            pstmt.setString(4, contactos[i].SegundoNombre);
            pstmt.setString(5, contactos[i].Apellidos);
            pstmt.setString(6, contactos[i].Posicion);
            pstmt.setString(7, contactos[i].Direccion);
            pstmt.setString(8, contactos[i].CorreoElectronico);
            pstmt.setString(9, contactos[i].Telefono1);
            pstmt.setString(10, contactos[i].Telefono2);
            pstmt.setString(11, contactos[i].TelefonoMovil);
            pstmt.execute();
		}
		
    }catch(e){
        insertResult = e.message;
    }
    
    return insertResult;
}

function RegistrarDirecciones(ClaveMovil,direcciones){
    
    var insertResult = Constants.MESSAGE_SUCCESS;
    var i;
    
    try{
        
        for(i = 0; i < direcciones.length ; i++)
		{
		    var query = 'insert into '+Constants.BD_MOBILE+'."CRD2" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
            var pstmt = conn.prepareStatement(query);   
            
            pstmt.setString(1, ClaveMovil);
            pstmt.setString(2, direcciones[i].Tipo);
            pstmt.setString(3, direcciones[i].Codigo);
            pstmt.setString(4, direcciones[i].Pais);
            pstmt.setString(5, direcciones[i].Departamento);
            pstmt.setString(6, direcciones[i].Provincia);
            pstmt.setString(7, direcciones[i].Distrito);
            pstmt.setString(8, direcciones[i].Calle);
            pstmt.setString(9, direcciones[i].Referencia);
            pstmt.setString(10, direcciones[i].Latitud);
            pstmt.setString(11, direcciones[i].Longitud);
            pstmt.setString(12, direcciones[i].Ruta);
            pstmt.setString(13, direcciones[i].Zona);
            pstmt.setString(14, direcciones[i].Canal);
            pstmt.setString(15, direcciones[i].Giro);
            pstmt.execute();
		}
		
    }catch(e){
        insertResult = e.message;
    }
    
    return insertResult;
}

function RegistrarCabecera(ocrd){
    
    var insertResult = Constants.MESSAGE_SUCCESS;
    
    try{
        
        var query = 'insert into '+Constants.BD_MOBILE+'."OCRD" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        var pstmt = conn.prepareStatement(query);   
        
        pstmt.setString(1, ocrd.ClaveMovil);
        pstmt.setString(2, ocrd.TransaccionMovil);
        pstmt.setString(3, ocrd.TipoPersona);
        pstmt.setString(4, ocrd.TipoDocumento);
        pstmt.setString(5, ocrd.NumeroDocumento);
        pstmt.setString(6, ocrd.NombreRazonSocial);
        pstmt.setString(7, ocrd.NombreComercial);
        pstmt.setString(8, ocrd.ApellidoPaterno);
        pstmt.setString(9, ocrd.ApellidoMaterno);
        pstmt.setString(10, ocrd.PrimerNombre);
        pstmt.setString(11, ocrd.SegundoNombre);
        pstmt.setString(12, ocrd.Telefono1);
        pstmt.setString(13, ocrd.Telefono2);
        pstmt.setString(14, ocrd.TelefonoMovil);
        pstmt.setString(15, ocrd.CorreoElectronico);
        pstmt.setInt(16, ocrd.GrupoSocio);
        pstmt.setInt(17, ocrd.ListaPrecio);
        pstmt.setInt(18, ocrd.CondicionPago);
        pstmt.setString(19, ocrd.Indicador);
        pstmt.setString(20, ocrd.Zona);
        pstmt.setString(21, 'N');
        pstmt.setString(22, 'N');
        pstmt.setString(23, 'N');
        pstmt.setInt(24, ocrd.Empresa);
        pstmt.setString(25, ocrd.PoseeActivo);
        pstmt.setString(26, ocrd.Vendedor);
        pstmt.setString(27, '');
        pstmt.setString(28, '');
        pstmt.setString(29, ocrd.Proyecto);
        if(ocrd.hasOwnProperty('TipoRegistro')){
            pstmt.setString(30, ocrd.TipoRegistro);
        }else{
            pstmt.setString(30, '01');
        }
        pstmt.execute();
        
        if(ocrd.Contacts.length > 0){
            insertResult = RegistrarContactos(ocrd.ClaveMovil, ocrd.Contacts);
        }
        
        if(ocrd.Directions.length > 0){
            insertResult = RegistrarDirecciones(ocrd.ClaveMovil, ocrd.Directions);
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
		var objBusinessPartner = JSON.parse(params);
		
		//validar las propiedades del documento
		var messageValidation = ValidarDocumento(objBusinessPartner);
		
		if(messageValidation === Constants.MESSAGE_SUCCESS){
		    
		    //realizar el registro en la BD de la cabecera del documento
		    var resCabe = RegistrarCabecera(objBusinessPartner);
		        
		    if(resCabe === Constants.MESSAGE_SUCCESS){
		        
                objType = Constants.SUCCESS_MESSAGE_RESPONSE;
		        objResult = functions.CreateJSONMessage(objBusinessPartner.ClaveMovil, Constants.MESSAGE_SUCCESS);
		        conn.commit();
		        
		        functions.AddLogRegister(objBusinessPartner.Empresa, -1, objBusinessPartner.ClaveMovil, 
		            Constants.DOCTYPE_BUSINESS_PARTNER, "Registrado en base intermedia. ", 
		            Constants.SOURCE_APP_TO_BD, 
		            Constants.TYPE_SUCCESS);

            }else{
                conn.rollback();
                objType = Constants.ERROR_MESSAGE_RESPONSE;  
    	        objResult = functions.CreateJSONMessage(-102, resCabe);
    	        
    	        functions.AddLogRegister(objBusinessPartner.Empresa, -1, objBusinessPartner.ClaveMovil, 
			            Constants.DOCTYPE_BUSINESS_PARTNER, "Error registrando objeto " + resCabe, 
			            Constants.SOURCE_APP_TO_BD, 
			            Constants.TYPE_ERROR);
            }
		}else{
		    objType = Constants.ERROR_MESSAGE_RESPONSE;  
			objResult = functions.CreateJSONMessage(-101, "Validación de documento fallida: " + messageValidation);
			
			functions.AddLogRegister(objBusinessPartner.Empresa, -1, objBusinessPartner.ClaveMovil, 
			            Constants.DOCTYPE_BUSINESS_PARTNER, messageValidation, Constants.SOURCE_APP_TO_BD, Constants.TYPE_ERROR);
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