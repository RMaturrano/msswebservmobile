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
		var mQuery = 'select count(*) as "last" from '+Constants.BD_MOBILE+'."ORIN" ' +
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

function ValidarDocumento(ordn){
    
    var res = Constants.MESSAGE_SUCCESS;
    
    try{
        
        var valCM = ValidarClaveMovil(ordn.ClaveMovil);
        if(valCM > 0){
            res = "Ya existe un registro con la Clave Movil indicada.";
        }else if(valCM === -1){
            res = "Ocurrió un error intentando comprobar la Clave Movil del documento.";
        }else if(ordn.Lineas.length <= 0){
            res = "No se puede registrar el documento sin el detalle.";
        }else if(ordn.ClaveMovil === undefined || ordn.ClaveMovil === ''){
            res = "No se puede registrar el documento sin la ClaveMovil";
        }else if(ordn.EmpleadoVenta === undefined || ordn.EmpleadoVenta === ''){
            res = "Se debe indicar el empleado de venta.";
        }else if(ordn.Moneda === undefined || ordn.Moneda === ''){
            res = "Se debe indicar la moneda del documento.";
        }else if(ordn.SocioNegocio === undefined || ordn.SocioNegocio === ''){
            res = "Se debe indicar el socio de negocio de documento.";
        }else if(ordn.FechaContable === undefined || ordn.FechaContable === ''){
            res = "Se debe indicar la fecha contable del documento.";
        }else if(ordn.FechaVencimiento === undefined || ordn.FechaVencimiento === ''){
            res = "Se debe indicar la fecha de vencimiento del documento.";
        }else if(ordn.Empresa === undefined || ordn.Empresa === ''){
            res = "El documento debe estar dirigido a una sociedad (Empresa) en específico.";
        }
        
    }catch(e){
        res = e.message;
    }
    
    return res;
}

function RegistrarCabecera(ordn){
    
    var insertResult = Constants.MESSAGE_SUCCESS;
    
    try{
        
        var query = 'insert into '+Constants.BD_MOBILE+'."ORIN" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        var pstmt = conn.prepareStatement(query);   
        
        pstmt.setString(1, ordn.ClaveMovil);
        pstmt.setString(2, ordn.ClaveBase.toString());
        pstmt.setString(3, ordn.SocioNegocio);
        pstmt.setString(4, ordn.ListaPrecio.toString());
        pstmt.setString(5, ordn.CondicionPago.toString());
        pstmt.setString(6, ordn.Indicador.toString());
        pstmt.setString(7, ordn.Referencia);
        pstmt.setString(8, ordn.FechaContable);
        pstmt.setString(9, ordn.FechaVencimiento);
        pstmt.setString(10, ordn.Moneda.toString());
        pstmt.setString(11, ordn.EmpleadoVenta.toString());
        pstmt.setString(12, ordn.DireccionFiscal.toString());
        pstmt.setString(13, ordn.DireccionEntrega.toString());
        pstmt.setString(14, ordn.Comentario);
        pstmt.setString(15, 'N');
        pstmt.setString(16, '');
        pstmt.setString(17, '');
        pstmt.setInt(18, ordn.Empresa);
        
        if(ordn.hasOwnProperty('Latitud')){
            pstmt.setString(19, ordn.Latitud);
        }else{
            pstmt.setString(19, '');
        }
        
        if(ordn.hasOwnProperty('Longitud')){
            pstmt.setString(20, ordn.Longitud);
        }else{
            pstmt.setString(20, '');
        }
        
        if(ordn.hasOwnProperty('FechaCreacion')){
            pstmt.setString(21, ordn.FechaCreacion);
        }else{
            pstmt.setString(21, '');
        }
        
        if(ordn.hasOwnProperty('HoraCreacion')){
            pstmt.setString(22, ordn.HoraCreacion);
        }else{
            pstmt.setString(22, '');
        }
        
        if(ordn.hasOwnProperty('ModoOffLine')){
            pstmt.setString(23, ordn.ModoOffLine);
        }else{
            pstmt.setString(23, '');
        }
        
        pstmt.execute();
        
    }catch(e){
        insertResult = e.message;
    }
    
    return insertResult;
}

function RegistrarLotes(Lotes){
    
    var insertResult = Constants.MESSAGE_SUCCESS;
    var i;
    
    try{
        for(i = 0; i < Lotes.length ; i++)
		{
		    var query = 'insert into '+Constants.BD_MOBILE+'."RIN2" values(?,?,?,?)';
            var pstmt = conn.prepareStatement(query);   
            
            pstmt.setString(1, Lotes[i].ClaveBase.toString());
            pstmt.setInt(2, parseInt(Lotes[i].LineaBase));
            pstmt.setString(3, Lotes[i].Lote.toString());
            pstmt.setDouble(4, Lotes[i].Cantidad);
            pstmt.execute();
		}
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
		    var query = 'insert into '+Constants.BD_MOBILE+'."RIN1" values(?,?,?,?,?,?,?,?,?,?,?)';
            var pstmt = conn.prepareStatement(query);   
            
            pstmt.setString(1, ClaveMovil);
            pstmt.setString(2, lines[i].Articulo.toString());
            pstmt.setString(3, lines[i].UnidadMedida.toString());
            pstmt.setString(4, lines[i].Almacen.toString());
            pstmt.setString(5, lines[i].Cantidad.toString());
            pstmt.setString(6, lines[i].ListaPrecio.toString());
            pstmt.setString(7, lines[i].PrecioUnitario.toString());
            pstmt.setString(8, lines[i].PorcentajeDescuento);
            pstmt.setString(9, lines[i].Impuesto);
            pstmt.setString(10, lines[i].LineaBase.toString());
            pstmt.setInt(11, parseInt(lines[i].Linea));
            
            if(lines[i].hasOwnProperty('Lotes')){
                insertResult = RegistrarLotes(lines[i].Lotes);
            }
            
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
		var ordnCabe = JSON.parse(params);
		
		//validar las propiedades del documento
		var messageValidation = ValidarDocumento(ordnCabe);
		
		if(messageValidation === Constants.MESSAGE_SUCCESS){
		    
		    //realizar el registro en la BD de la cabecera del documento
		    var resCabe = RegistrarCabecera(ordnCabe);
		        
		    if(resCabe === Constants.MESSAGE_SUCCESS){
		            
	            //realizar el registro de las lineas del documento
	            var resDet = RegistrarDetalle(ordnCabe.ClaveMovil, ordnCabe.Lineas);
	            
	            if(resDet === Constants.MESSAGE_SUCCESS){
	                objType = Constants.SUCCESS_MESSAGE_RESPONSE;
			        objResult = functions.CreateJSONMessage(ordnCabe.ClaveMovil, Constants.MESSAGE_SUCCESS);
			        conn.commit();
	            }else{
	                conn.rollback();
	                objType = Constants.ERROR_MESSAGE_RESPONSE;  
		            objResult = functions.CreateJSONMessage(-103, resDet);
	            }
            }else{
                conn.rollback();
                objType = Constants.ERROR_MESSAGE_RESPONSE;  
    	        objResult = functions.CreateJSONMessage(-102, resCabe);
            }
		}else{
		    objType = Constants.ERROR_MESSAGE_RESPONSE;  
			objResult = functions.CreateJSONMessage(-101, "Validación de documento fallida: " + messageValidation);
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